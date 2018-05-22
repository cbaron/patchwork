var BaseResource = require('./__proto__'),
    CustomerLogin = function() { return BaseResource.apply( this, arguments ) }

Object.assign( CustomerLogin.prototype, BaseResource.prototype, {

    PATCH() {
        return this.slurpBody()
        .then( () => this.validateUser() )
        .then( () => {
            console.log( this.body )
            console.log( this.user )
            this.user = { }
            Object.keys( this.body ).forEach( key => this.user[ key ] = this.body[ key ] )
            console.log( this.user )
            return this.respond( { body: { user: this.user } } )
            //return this.User.createToken.call(this)
        } )
        //.then( token => this.User.respondSetCookie.call( this, token, { } ) )
    }

} )

module.exports = CustomerLogin