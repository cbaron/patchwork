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

    handleQueryResult: function( result ) {

        if( ( result.rows.length !== 1 ) || ( this.bcrypt.compareSync( this.body.password, result.rows[0].password ) === false ) ) {
            return BaseResource.prototype.respond.call( this, { body: {} } )
        }

        this.user = this._.omit( result.rows[0], [ 'password' ] )

        return this.User.attachUserRoles.call(this)
        .then( () => this.User.createToken.call(this) )
        .then( token => this.User.respondSetCookie.call( this, token, this.user ) )
    },

    POST() {
        return this.slurpBody()
        .then( () => this.context() )
        .then( () => this.queryMemberTable() )
        .then( result => this.handleQueryResult( result ) )
    },

    query( attr ) { return this.Postgres.query( `SELECT * FROM person WHERE ${attr} = $1`, [ this.body.email ] ) }, 

    queryMemberTable() {
        return this.query( "email" ).then( result => {
            if( result.rows.length === 1 ) return result
            return this.query( "username" )
        } )
    }

} )

module.exports = Auth
