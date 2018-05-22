var BaseResource = require('./__proto__'),
    CustomerLogin = function() { return BaseResource.apply( this, arguments ) }

Object.assign( CustomerLogin.prototype, BaseResource.prototype, {

    User: require('./util/User'),

    PATCH() {
        return this.slurpBody()
        .then( () => this.validateUser() )
        .then( () => {
            this.user = { }
            Object.keys( this.body ).forEach( key => this.user[ key ] = this.body[ key ] )

            return this.User.attachUserRoles.call(this)
            .then( () => this.User.createToken.call(this) )
            .then( token => this.User.respondSetCookie.call( this, token, this.user ) )
        } )
    }

} )

module.exports = CustomerLogin