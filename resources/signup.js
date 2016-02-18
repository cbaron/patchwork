var Base = require('./__proto__'),
    Signup = function() { return Base.apply( this, arguments ) }

Object.assign( Signup.prototype, Base.prototype, {

    Stripe: require('../lib/stripe'),

    bcrypt: require('bcrypt-nodejs'),

    db: Object.assign( {}, Base.prototype.db, {
        POST() {
            var memberid

            return this.executeUserQueries()
            .then( memberid => {
                memberid = memberid
                return this.Q.all( this.body.shares.map( share => this.executeShareQueries( share, memberid ) ) )
            } )
            .then( () => { if( Object.keys( this.body.payment ).length ) return this.executePayment( memberid ) } )
        }
    } ),
    
    context: Object.assign( {}, Base.prototype.context, {
        POST() {
            this.body.member.password = this.bcrypt.hashSync( this.body.member.password )
            delete this.body.member.repeatpassword

            this.body.totalCents = Math.floor( this.body.total * 100 )
        }
    } ),

    executePayment( memberid ) {

        return this.Q(
            this.Stripe.charge( {
                amount: this.body.totalCents,
                description: this.format( 'Purchase of CSA share(s) %s', this.body.shares.map( share => share.label ).join(', ') ),
                metadata: { memberid: memberid },
                receipt_email: this.body.member.email,
                source: Object.assign( { object: 'card' }, this.body.payment ),
                statement_descriptor: 'Patchwork Gardens CSA'
            } )
        ).then( charge => this.Q.all( [
            this.dbQuery( {
                query: 'UPDATE member SET balance = balance + $1 WHERE id = $2',
                values: [ this.body.total, memberid ] } ),
            this.dbQuery( {
                query: 'INSERT INTO transaction ( description, memberid, origin, amount ) VALUES ( $1, $2, $3, $4 )',
                values: [ "Full CSA Payment", memberid, 'Stripe', this.body.total ]
            } )
        ] ) )
    },

    executeShareQueries( share, memberid ) {
        var membershareid

        return this.dbQuery( { query: 'INSERT INTO membershare ( memberid, shareid ) VALUES ( $1, $2 ) RETURNING id', values: [ memberid, share.id ] } )
        .then( result => {
            membershareid = result.rows[0].id
            return this.Q.all( share.options.map( option =>
                this.dbQuery( {
                    query: "INSERT INTO membershareoption ( membershareid, shareoptionid, shareoptionoptionid ) VALUES ( $1, $2, $3 )",
                    values: [ result.rows[0].id, option.shareoptionid, option.shareoptionoptionid ] } ) ) )
        } )
        .then( () => 
            this.dbQuery( {
                query: "INSERT INTO membersharedelivery ( membershareid, deliveryoptionid, groupdropoffid ) VALUES ( $1, $2, $3 ) RETURNING membershareid",
                values: [ membershareid, share.delivery.deliveryoptionid, share.delivery.groupdropoffid ] } ) )
        .then( () =>
            this.Q.all( share.skipWeeks.map( membershareskipweek =>
                this.dbQuery( { query: "INSERT INTO membershareskipweek ( membershareid, date ) VALUES ( $1, $2 )",
                                values: [ membershareid, membershareskipweek.date ] } ) ) ) )
    },

    executeUserQueries() {
        return this.dbQuery( { query: "SELECT * FROM person WHERE email = $1", values: [ this.body.member.email ] } )
        .then( result =>
            this[ this.format( '%sPersonQueries', ( result.rows.length === 0 ) ? 'new' : 'update' ) ]
                ( ( result.rows.length ) ? result.rows[0].id : undefined )
        )
    },

    insertMember( personid ) {
        return this.dbQuery( {
            query: "INSERT INTO member ( phonenumber, address, extraaddress, balance, personid ) VALUES ( $1, $2, $3, $4, $5 ) RETURNING id",
            values: [ this.body.member.phonenumber, this.body.member.address, this.body.member.extraaddress, this.body.total * -1, personid ]
        } ).then( result => result.rows[0].id )
    },

    newPersonQueries() {
        return this.dbQuery( {
            query: "INSERT INTO person ( email, password, name ) VALUES ( $1, $2, $3 ) RETURNING id",
            values: [ this.body.member.email, this.body.member.password, this.body.member.name ] } )
        .then( result => this.insertMember( result.rows[0].id ) )
    },

    responses: Object.assign( { }, Base.prototype.responses, {
        POST() { this.respond( { body: { } } ) }
    } ),

    updatePersonQueries( personid ) {
        return this.dbQuery( {
            query: "UPDATE person SET password = $1, name = $2 WHERE id = $3",
            values: [ this.body.member.password, this.body.member.name, personid ] } )
        .then( () => this.dbQuery( { query: "SELECT * FROM member WHERE personid = $1", values: [ personid ] } ) )
        .then( result => {
            var row = ( result.rows.length ) ? result.rows[0] : undefined
            if( row ) {
                row.balance = parseFloat( row.balance.replace( /\$|,/g,'' ) )
                return this.dbQuery( {
                     query: "UPDATE member SET phonenumber = $1, address = $2, extraaddress = $3, balance = $4 WHERE id = $5",
                     values: [ this.body.member.phonenumber, this.body.member.address, this.body.member.extraaddress, row.balance + ( this.body.total * -1 ), row.id ]
                } ).then( () => row.id )
            } else { return this.insertMember( personid ) }
        } )
    }
    
} )

module.exports = Signup
