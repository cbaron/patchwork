var BaseResource = require('./__proto__'),
    Auth = function() { return BaseResource.apply( this, arguments ) }

Object.assign( Auth.prototype, BaseResource.prototype, {

    User: require('./util/User'),

    bcrypt: require('bcrypt-nodejs'),

    context() {
        [ 'password', 'email' ].forEach( attr => {
            if( ! this.body[ attr ] ) throw new Error( this.format( "%s is a required field", attr ) )
        } )
    },

    handleQueryResult( result ) {
        if( ( result.rows.length !== 1 ) || ( this.bcrypt.compareSync( this.body.password, result.rows[0].password ) === false ) ) {
            return this.respond( { stopChain: true, body: "Your email and password are incorrect. Please try again.", code: 500 } )
        }

        if( result.rows[0].emailVerified !== true ) return this.respond( { stopChain: true, body: "Your email has not been verified. Please find the verification email that was sent to you when you first signed up and click on the link inside. If you do not have this email, please contact us for support.", code: 500 } )

        this.user = this._.omit( result.rows[0], [ 'password' ] )

        return this.validate.GET.call(this)
        .then( () => this.User.attachUserRoles.call(this) )
        .then( () => this.User.createToken.call(this) )
        .then( token => this.User.respondSetCookie.call( this, token, this.user ) )
    },

    POST() {
        return this.slurpBody()
        .then( () => this.context() )
        .then( () => this.queryMemberTable() )
        .then( result => this.handleQueryResult( result ) )
    },

    query( attr ) { return this.Postgres.query( `SELECT * FROM person WHERE ${attr} = $1`, [ this.body.email.toLowerCase() ] ) }, 

    queryMemberTable() {
        return this.query( "email" ).then( result => {
            if( result.rows.length === 1 ) return result
            return this.query( "username" )
        } )
    }

} )

module.exports = Auth