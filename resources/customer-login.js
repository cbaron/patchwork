var BaseResource = require('./__proto__'),
    CustomerLogin = function() { return BaseResource.apply( this, arguments ) }

Object.assign( CustomerLogin.prototype, BaseResource.prototype, {

    User: require('./util/User'),

    async PATCH() {
        await this.slurpBody()
        await this.validateUser()

        const rows = await this.Postgres.query( `SELECT * FROM person WHERE id = $1`, [ this.body.customerId ], { rowsOnly: true } )
        if( rows.length !== 1 ) return this.respond( { stopChain: true, code: 500 } )

        this.user = Object.entries( rows[0] ).reduce( ( memo, [ key, val ] ) => {
            if( key === 'password' ) return memo
            memo[ key ] = val
            return memo
        }, { } )

        await this.User.attachUserRoles.call(this)
        const token = await this.User.createToken.call(this)
        this.User.respondSetCookie.call( this, token, this.user )
    }

} )

module.exports = CustomerLogin