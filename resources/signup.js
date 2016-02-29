var Base = require('./__proto__'),
    Signup = function() { return Base.apply( this, arguments ) }

Object.assign( Signup.prototype, Base.prototype, {

    Stripe: require('../lib/stripe'),

    User: require('./util/User'),

    bcrypt: require('bcrypt-nodejs'),

    db: Object.assign( {}, Base.prototype.db, {
        POST() {
            return this.executeUserQueries()
            .then( memberid => {
                this.memberid = memberid
                return this.Q.all( this.body.shares.map( share => this.executeShareQueries( share ) ) )
            } )
            .then( () => { if( Object.keys( this.body.payment ).length ) return this.executePayment( ) } )
        }
    } ),
    
    context: Object.assign( {}, Base.prototype.context, {
        POST() {
            this.body.member.password = this.bcrypt.hashSync( this.body.member.password )
            delete this.body.member.repeatpassword

            this.body.totalCents = Math.floor( this.body.total * 100 )
        }
    } ),

    creditMember() {
        return this.dbQuery( {
            query: 'UPDATE member SET balance = balance + $1 WHERE id = $2',
            values: [ this.body.total, this.memberid ] } )
    },

    executePayment() {

        return this.Q(
            this.Stripe.charge( {
                amount: this.body.totalCents,
                description: this.format( 'Purchase of CSA share(s) %s', this.body.shares.map( share => share.label ).join(', ') ),
                metadata: { memberid: this.memberid },
                receipt_email: this.body.member.email,
                source: Object.assign( { object: 'card' }, this.body.payment ),
                statement_descriptor: 'Patchwork Gardens CSA'
            } )
        )
        .fail( failedPayment => {
            return this.creditMember()
            .then( () => this.rollbackShareQueries() )
            .fail( e => {
                console.log( this.format( '%s Error rolling back after failed payment : %s -- body -- %s', new Date(), e.stack || e, JSON.stringify(this.body) ) )
                this.error = "Error rolling back after failed payment.  Please contact us at eat.patchworkgardens@gmail.com"
            } )
            .then( () => {
                console.log( this.format( '%s Failed payment : %s -- body -- %s', new Date(), failedPayment.stack || failedPayment, JSON.stringify(this.body) ) )
                this.error = "Failed payment.  Please try again."
            } ) 
        } )
        .then( charge => {
            if( this.error ) return
            return this.Q.all( [ this.creditMember(),
                this.dbQuery( {
                    query: 'INSERT INTO transaction ( description, memberid, origin, amount ) VALUES ( $1, $2, $3, $4 )',
                    values: [ "Full CSA Payment", this.memberid, 'Stripe', this.body.total ]
                } )
            ] )
        } )
        .fail( e => {
            console.log( this.format( '%s Failed to credit member or create transaction : %s -- body -- %s', new Date(), e.stack || e, JSON.stringify(this.body) ) )
        } )
    },

    executeShareQueries( share ) {
        return this.dbQuery( { query: 'INSERT INTO membershare ( memberid, shareid ) VALUES ( $1, $2 ) RETURNING id', values: [ this.memberid, share.id ] } )
        .then( result => {
            this.membershareid = result.rows[0].id
            return this.Q.all( share.options.map( option =>
                this.dbQuery( {
                    query: "INSERT INTO membershareoption ( membershareid, shareoptionid, shareoptionoptionid ) VALUES ( $1, $2, $3 ) RETURNING id",
                    values: [ result.rows[0].id, option.shareoptionid, option.shareoptionoptionid ] } ) ) )
        } )
        .spread( () => {
            this.membershareoptionids = Array.prototype.slice.call(arguments, 0).map( result => { console.log( result ); return result.rows[0].id } )
            return this.dbQuery( {
                query: "INSERT INTO membersharedelivery ( membershareid, deliveryoptionid, groupdropoffid ) VALUES ( $1, $2, $3 ) RETURNING id",
                values: [ this.membershareid, share.delivery.deliveryoptionid, share.delivery.groupdropoffid ] } )
        } )
        .then( result => {
            this.membersharedeliveryid = result.rows[0].id
            return this.Q.all( share.skipDays.map( date =>
                this.dbQuery( { query: "INSERT INTO membershareskipweek ( membershareid, date ) VALUES ( $1, $2 ) RETURNING id",
                                values: [ this.membershareid, date ] } ) ) ) 
        } )
        .spread( () => this.membershareskipweekids = Array.prototype.slice.call(arguments, 0).map( result => result.rows[0].id ) )
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
            query: "INSERT INTO member ( phonenumber, address, extraaddress, balance, personid, heard ) VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING id",
            values: [
                this.body.member.phonenumber,
                this.body.member.address,
                this.body.member.extraaddress,
                this.body.total * -1,
                personid,
                this.body.member.heard
            ]
        } ).then( result => result.rows[0].id )
    },

    newPersonQueries() {
        return this.dbQuery( {
            query: "INSERT INTO person ( email, password, name ) VALUES ( $1, $2, $3 ) RETURNING id",
            values: [ this.body.member.email, this.body.member.password, this.body.member.name ] } )
        .then( result => this.insertMember( result.rows[0].id ) )
    },

    responses: Object.assign( { }, Base.prototype.responses, {
        POST() {
            if( this.error ) return this.respond( { body: { error: this.error } } )
            this.user.state.signup = { }
            return this.Q( this.User.createToken.call(this) )
                    .then( token => this.User.respondSetCookie.call( this, token, { } ) )
        }
    } ),

    rollbackShareQueries() {
        return this.dbQuery( { query: this.format("DELETE from membershareskipweek WHERE id IN ( %s )", this.membershareskipweekids.join(', ') ) } )
        .then( () => this.dbQuery( { query: "DELETE from membersharedelivery WHERE id = " + this.membersharedeliveryid } ) )
        .then( () => this.dbQuery( { query: this.format("DELETE from membershareoption WHERE id IN ( %s )", this.membershareoptionids.join(', ') ) } ) )
        .then( () => this.dbQuery( { query: "DELETE from membershare WHERE id = " + this.membershareid } ) )
    },


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
                     query: "UPDATE member SET phonenumber = $1, address = $2, extraaddress = $3, balance = $4, heard = $5 WHERE id = $6",
                     values: [
                        this.body.member.phonenumber,
                        this.body.member.address,
                        this.body.member.extraaddress,
                        row.balance + ( this.body.total * -1 ),
                        this.body.member.heard,
                        row.id
                    ]
                } ).then( () => row.id )
            } else { return this.insertMember( personid ) }
        } )
    }
    
} )

module.exports = Signup
