var BaseResource = require('./__proto__'),
    Auth = function() { return BaseResource.apply( this, arguments ) }

Object.assign( Auth.prototype, BaseResource.prototype, {

    createToken() {
    },

    attachUserRoles: Member.prototype.attachUserRoles,

    bcrypt: require('bcrypt-nodejs'),

    handleQueryResult: function( result ) {

        if( ( result.rows.length !== 1 ) || ( this.bcrypt.compareSync( this.body.password, result.rows[0].password ) === false ) ) {
            return BaseResource.prototype.respond.call( this, { } )
        }

        this.user = this._.omit( result.rows[0], [ 'password' ] )

        return this.Q.fcall( this.buildUser.bind(this), result )
            .then( this.attachUserRoles.bind(this) )
            .then( this.addToSession.bind(this) )
            .then( this.respond.bind(this) )
    },

    POST: function() {
        
        return [
            this.slurpBody.bind(this),
            this.queryByEmail.bind(this),
            this.handleQueryResult.bind(this) ].reduce( this.Q.when, this.Q({}) );
    },

    queryByEmail() { return this.dbQuery( { query: "SELECT * FROM person WHERE username = $1", values: [ this.body.username ] } ) },

    respond: Member.prototype.respond,

    validatePOST: function() {

        [ 'password', 'username' ].forEach( attr => {
            if( ! this.body[ attr ] ) throw new Error( this.util.format( "%s is a required field", attr ) )
        } )
    }

} )

module.exports = Auth
