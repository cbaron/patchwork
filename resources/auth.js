var BaseResource = require('./__proto__'),
    Auth = function() { return BaseResource.apply( this, arguments ) }

Object.assign( Auth.prototype, BaseResource.prototype, {

    User: require('./util/User'),

    createToken() {
        return new Promise( ( resolve, reject ) => {
            this.jws.createSign( {
                header: { "alg": "HS256", "typ": "JWT" },
                payload: JSON.stringify( this.user ),
                privateKey: process.env.JWS_SECRET,
            } ).on( 'done', signature => resolve( signature ) )
        } )
    },

    bcrypt: require('bcrypt-nodejs'),

    handleQueryResult: function( result ) {

        if( ( result.rows.length !== 1 ) || ( this.bcrypt.compareSync( this.body.password, result.rows[0].password ) === false ) ) {
            return BaseResource.prototype.respond.call( this, { } )
        }

        this.user = this._.omit( result.rows[0], [ 'password' ] )

        return this.User.attachUserRoles.call(this).then( () => this.createToken() )
        .then( token => this.respond( { body: this.user, headers: { 'Set-Cookie': this.format( 'patchworkjwt=%s;', token ) } } ) )
    },

    jws: require('jws'),

    POST() {
        return this.slurpBody().then( () => this.queryByEmail() ).then( result => this.handleQueryResult( result ) )
    },

    queryByEmail() { return this.dbQuery( { query: "SELECT * FROM person WHERE email = $1", values: [ this.body.email ] } ) },

    validatePOST() {
        [ 'password', 'email' ].forEach( attr => {
            if( ! this.body[ attr ] ) throw new Error( this.format( "%s is a required field", attr ) )
        } )
    }

} )

module.exports = Auth
