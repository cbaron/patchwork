var BaseResource = require('./__proto__'),
    User = function() { return BaseResource.apply( this, arguments ) }

BaseResource.prototype._.extend( User.prototype, BaseResource.prototype, {

    GET: function() {
        var token = this.getCookieToken();

        if( ! token ) return this.respond( { body: { }, code: 404 } )

        return this.Q.ninvoke( this.redisClient, "HGETALL", token )
            .then( function( user ) {
                if( user ) user.roles = user.roles.split(',')

                if( user && this.request.headers.iosapp ) {
                    this.transform( user, require('./member').prototype.transformer.to.iOS )
                    user.birthdate = ( user.birthdate ) ? new Date( user.birthdate ).getTime() / 1000 : null
                    user.createdAt = new Date( user.createdAt ).getTime() / 1000
                    user.updatedAt = new Date( user.updatedAt ).getTime() / 1000
                }

                return this.respond( { body: { success: true, result: user } } )
            }.bind(this) )
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

    verifyToken() {
        return new Promise( ( resolve, reject ) => {
            this.jws.process.env.createVerify( {
                key: process.env.JWS_SECRET,
                signature: this.token,
            } ).on( 'done', ( verified, obj ) {
                if( ! verified ) reject( this.getOurError( 'Invalid Signature' ) )
                this.user = obj
                resolve( obj )
            } );
        } )
    }

} )

module.exports = User
