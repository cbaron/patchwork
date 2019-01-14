var Base = require('./__proto__'),
    Signup = function() { return Base.apply( this, arguments ) }

Object.assign( Signup.prototype, Base.prototype, {

    SendGrid: require('../lib/SendGrid'),

    Stripe: require('../lib/stripe'),

    User: require('./util/User'),

    bcrypt: require('bcrypt-nodejs'),

    db: { ...Base.prototype.db,
        async POST() {
            this.membershareids = [ ]
            const memberid = await this.executeUserQueries()
            this.memberid = memberid

            await this.handleFoodOmission( memberid )

            let chain = Promise.resolve()
            this.body.shares.forEach( share => { chain = chain.then( () => this.executeShareQueries( share ) ) } )
            await chain

            if( Object.keys( this.body.payment ).length ) return this.executePayment()
        }
    },
    
    context: Object.assign( {}, Base.prototype.context, {
        POST() {
            this.body.member.password = this.body.member.password ? this.bcrypt.hashSync( this.body.member.password ) : ''
            delete this.body.member.repeatpassword

            this.body.totalCents = Math.floor( this.body.total * 100 )
        }
    } ),

    executePayment() {
        return this.Q(
            this.Stripe.charge( {
                amount: this.body.totalCents,
                description: this.format( 'Purchase of CSA share(s) %s', this.body.shares.map( share => share.label ).join(', ') ),
                metadata: { memberid: this.memberid, name: this.body.member.name, email: this.body.member.email.toLowerCase() },
                receipt_email: this.body.member.email.toLowerCase(),
                source: Object.assign( { object: 'card' }, this.body.payment ),
                statement_descriptor: 'Patchwork Gardens CSA'
            } )
        )
        .fail( failedPayment => {
            return this.rollbackShareQueries()
            .fail( e => {
                console.log( this.format( '%s Error rolling back after failed payment : %s -- body -- %s', new Date(), e.stack || e, JSON.stringify(this.body) ) )
                this.error = "Error rolling back after failed payment.  Please contact us at eat.patchworkgardens@gmail.com"
            } )
            .then( () => {
                console.log( this.format( '%s Failed payment : %s -- body -- %s', new Date(), failedPayment.stack || failedPayment, JSON.stringify(this.body) ) )
                if( !this.error ) this.error = `Payment failed. Please try again or contact us at eat.patchworkgardens@gmail.com for support.`
            } ) 
        } )
        .then( charge => {
            if( this.error ) return
            return this.Q.all( this.body.shares.map( ( share, i ) => this.Q(
                this.Postgres.query(
                    `INSERT INTO "csaTransaction" ( action, value, "memberShareId", description, initiator ) VALUES ( 'Payment', $1, ${this.membershareids[i]}, 'Stripe', 'customer' )`,
                    [ share.total ] 
                )
            ) ) )
        } )
        .fail( e => console.log( `${new Date()} - Failed to credit member or create transaction : ${e.stack || e} -- body -- ${JSON.stringify(this.body)}` ) )
    },

    executeShareQueries( share ) {
        let membershareid

        return this.dbQuery( {
            query: 'INSERT INTO membershare ( memberid, shareid, paymentmethod ) VALUES ( $1, $2, $3 ) RETURNING id',
            values: [ this.memberid, share.id, ( Object.keys( this.body.payment ).length ) ? "Stripe" : "Cash" ] } )
        .then( result => {
            membershareid = result.rows[0].id
            this.membershareids.push( membershareid )
            return this.Q.all( share.options.map( option =>
                this.dbQuery( {
                    query: "INSERT INTO membershareoption ( membershareid, shareoptionid, shareoptionoptionid ) VALUES ( $1, $2, $3 ) RETURNING id",
                    values: [ membershareid, option.shareoptionid, option.shareoptionoptionid ] } ) )
                .concat( share.seasonalAddOns.map( addon =>
                    this.dbQuery( {
                        query: `INSERT INTO "memberShareSeasonalAddOn" ( "seasonalAddOnId", "seasonalAddOnOptionId", "memberShareId" ) VALUES ( $1, $2, $3 )`,
                        values: [ addon.seasonalAddOnId, addon.seasonalAddOnOptionId, membershareid ]
                    } )
                ) )
            )
        } )
        .spread( () => {
            return this.dbQuery( {
                query: "INSERT INTO membersharedelivery ( membershareid, deliveryoptionid, groupdropoffid ) VALUES ( $1, $2, $3 ) RETURNING id",
                values: [ membershareid, share.delivery.deliveryoptionid, share.delivery.groupdropoffid ] } )
        } )
        .then( result => {
            return this.Q.all( share.skipDays.map( date =>
                this.dbQuery( { query: "INSERT INTO membershareskipweek ( membershareid, date ) VALUES ( $1, $2 ) RETURNING id",
                                values: [ membershareid, date ] } ) ) ) 
        } )
        .then( () => this.Q(
            this.Postgres.query(
                `INSERT INTO "csaTransaction" ( action, value, "memberShareId", description, initiator ) VALUES ( 'Season Signup', $1, ${membershareid}, $2, 'customer' )`,
                [ share.total, this.getShareSignupDescription(share) ]
             )
        ) )
    },

    executeUserQueries() {
        return this.dbQuery( { query: "SELECT * FROM person WHERE email = $1", values: [ this.body.member.email.toLowerCase() ] } )
        .then( result => this[ `${ result.rows.length === 0 ? 'new' : 'update' }PersonQueries` ]( result.rows.length ? result.rows[0].id : undefined ) )
    },

    generateEmailBody() {
        return this.Templates.SignupReceipt( {
            name: this.body.member.name,
            shares: this.body.shares,
            foodOmission: this.body.member.omission.length ? this.body.member.omission[0].name : '',
            payment: this.body.payment,
            total: this.body.total.toFixed(2)
        } )
    },

    getShareSignupDescription( share ) {
        const absent = share.skipDays.length ? `Absent: ${share.skipDays.map( day => day.slice(5) ).join(', ')}` : ``

        return `${share.options.map( option => this.getShortOptionDescription( option.description ).trim() ).join(', ')} -- ` +
               `${this.getShortDeliveryDescription( share.delivery.description )} -- ${absent}`
               
    },

    getShortOptionDescription( description ) {
        const colon = description.indexOf( ':' ),
            dash = description.indexOf( '--' )
       
        if( colon === -1 || dash === -1 ) return description
             
        return description.slice( 0, colon ) + description.slice( colon + 1, dash )
    },

    getShortDeliveryDescription( description ) {
        const match = /.*Method: (.+)/.exec( description )

        if( match === null ) return description

        return match[1].trim()
    },

    handleFoodOmission( memberid ) {
        if( this.body.member.omission.length === 0 ) return this.Postgres.query( `DELETE FROM memberfoodomission WHERE memberid = $1`, [ memberid ] )

        return this.dbQuery( {
            query: `SELECT * FROM memberfoodomission WHERE memberid = $1`,
            values: [ memberid ] } )
        .then( result => {
            var values = [ memberid, this.body.member.omission[0].produceid || this.body.member.omission[0].producefamilyid ],
                column = this.body.member.omission[0].produceid ? 'produceid' : 'producefamilyid',
                nullColumn = this.body.member.omission[0].produceid ? 'producefamilyid' : 'produceid'

            return result.rows.length === 0
                ? this.dbQuery( { query: `INSERT into memberfoodomission ( memberid, ${column} ) VALUES ( $1, $2 )`, values } )
                : this.dbQuery( { query: `UPDATE memberfoodomission SET ${column} = $2, ${nullColumn} = NULL WHERE memberid = $1`, values } )
        } )
    },

    insertMember( personid ) {
        return this.dbQuery( {
            query: "INSERT INTO member ( phonenumber, address, extraaddress, personid, heard, zipcode ) VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING id",
            values: [
                this.body.member.phonenumber,
                this.body.member.address,
                this.body.member.extraaddress,
                personid,
                this.body.member.heard,
                this.body.member.zipcode,
            ]
        } ).then( result => result.rows[0].id )
    },

    newPersonQueries() {
        return this.dbQuery( {
            query: `INSERT INTO person ( email, "secondaryEmail", password, name ) VALUES ( $1, $2, $3, $4 ) RETURNING id`,
            values: [ this.body.member.email.toLowerCase(), this.body.member.secondaryEmail.toLowerCase(), this.body.member.password, this.body.member.name ]
        } )
        .then( result => {
            this.user.id = result.rows[0].id
            this.user.email = this.body.member.email.toLowerCase()
            this.newMember = true
            return this.insertMember( result.rows[0].id )
        } )
    },

    responses: Object.assign( { }, Base.prototype.responses, {
        POST() {
            this.user.state.signup = { }
            this.user = this._.omit( this.user, [ 'password', 'repeatpassword' ] )

            return this.Q( this.User.createToken.call(this) )
            .then( token => {
                this.token = token

                if( !this.newMember ) return Promise.resolve()

                const templateOpts = { name: this.body.member.name, token: this.token, url: this.reflectUrl() }

                return this.Q( this.SendGrid.send( {
                    to: this.isProd ? this.body.member.email.toLowerCase() : process.env.TEST_EMAIL,
                    from: 'Patchwork Gardens <eat.patchworkgardens@gmail.com>',
                    subject: `Patchwork Gardens Email Verification`,
                    html: this.Templates.EmailBase({ emailBody: this.Templates.EmailVerification( templateOpts ) })
                } ) )
                .fail( err => console.log( "Error generating verification email : " + err.stack || err ) )
            } )
            .then( () => {
                if( this.error ) return this.respond( { body: { error: this.error } } )

                return this.Q( this.SendGrid.send( {
                    to: this.isProd ? this.body.member.email.toLowerCase() : process.env.TEST_EMAIL,
                    from: 'Patchwork Gardens <eat.patchworkgardens@gmail.com>',
                    subject: 'Welcome to Patchwork Gardens CSA',
                    html: this.Templates.EmailBase({ emailBody: this.generateEmailBody() })
                } ) )
                .fail( err => console.log( "Error generating confirmation email : " + err.stack || err ) )
            } )
            .then( () => this.User.respondSetCookie.call( this, this.token, { } ) )
        }
    } ),

    rollbackDelivery() {
        return this.dbQuery( { query: this.format("DELETE from membersharedelivery WHERE membershareid IN ( %s )", this.membershareids.join(', ') ) } )
    },

    rollbackSeasonalAddOns() {
        return this.dbQuery( { query: `DELETE FROM "memberShareSeasonalAddOn" WHERE "memberShareId" IN ( ${this.membershareids.join(', ')} )` } )
    },

    rollbackShareOptions() {
        return this.dbQuery( { query: this.format("DELETE from membershareoption WHERE membershareid IN ( %s )", this.membershareids.join(', ') ) } )
    },

    rollbackMemberShare() {
        return this.dbQuery( { query: this.format("DELETE from membershare WHERE id IN ( %s )", this.membershareids.join(', ') ) } )
    },

    rollbackShareQueries() {
        return [
            this.rollbackSkipWeeks.bind(this),
            this.rollbackDelivery.bind(this),
            this.rollbackShareOptions.bind(this),
            this.rollbackSeasonalAddOns.bind(this),
            this.rollbackMemberShare.bind(this) ].reduce( this.Q.when, this.Q() )
    },

    rollbackSkipWeeks() {
        return this.dbQuery( { query: this.format("DELETE from membershareskipweek WHERE membershareid IN ( %s )", this.membershareids.join(', ') ) } )
    },

    Templates: {
        EmailBase: require('../templates/EmailBase'),
        EmailVerification: require('../templates/EmailVerification'),
        SignupReceipt: require('../templates/SignupReceipt')
    },

    updatePersonQueries( personid ) {
        return this.dbQuery( { query: "SELECT * FROM member WHERE personid = $1", values: [ personid ] } )
        .then( result => {
            var row = ( result.rows.length ) ? result.rows[0] : undefined
            if( row ) {
                return this.dbQuery( {
                     query: "UPDATE member SET phonenumber = $1, address = $2, extraaddress = $3, heard = $4, zipcode = $5 WHERE id = $6",
                     values: [
                        this.body.member.phonenumber,
                        this.body.member.address,
                        this.body.member.extraaddress,
                        this.body.member.heard,
                        this.body.member.zipcode,
                        row.id
                    ]
                } ).then( () => row.id )
            } else { return this.insertMember( personid ) }
        } )
    }
    
} )

module.exports = Signup