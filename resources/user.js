var BaseResource = require('./__proto__'),
    User = function() { return BaseResource.apply( this, arguments ) }

BaseResource.prototype._.extend( User.prototype, BaseResource.prototype, {

    GET: function() {
        var token = this.getCookieToken();

        if( ! token ) return new Promise( resolve => { this.respond( { body: { } } ); resolve() } )

        return this.verifyToken( token ).then( user => this.respond( { body: user } ) )
    },

    getCookieToken() {
        var list = {},
            rc = this.request.headers.cookie

        rc && rc.split(';').forEach( cookie => {
            var parts = cookie.split('=');
            list[ parts.shift().trim() ] = decodeURI( parts.join('=') )
        } )

        return list.patchworkjwt
    },

    jws: require('jws'),

    verifyToken( token ) {
        return new Promise( ( resolve, reject ) => {
            this.jws.createVerify( {
                key: process.env.JWS_SECRET,
                signature: token,
            } ).on( 'done', ( verified, obj ) => {
                if( ! verified ) reject( 'Invalid Signature' )
                resolve( obj )
            } )
        } )
    }

} )

module.exports = User
