var BaseResource = require('./__proto__'),
    CustomerLogin = function() { return BaseResource.apply( this, arguments ) }

Object.assign( CustomerLogin.prototype, BaseResource.prototype, {

    User: require('./util/User'),

    async PATCH() {
        await this.slurpBody()
        await this.validateUser()

        const rows = await this.Postgres.query( `SELECT * FROM person WHERE id = $1`, [ this.body.customerId ], { rowsOnly: true } )
        if( rows.length !== 1 ) return this.respond( { stopChain: true, code: 500 } )

        this.user = { ...rows[0], password: undefined, isAdminLogin: true }

        await Reflect.apply( this.User.attachUserRoles, this, [ ] )
        const token = await Reflect.apply( this.User.createToken, this, [ ] )
        Reflect.apply( this.User.respondSetCookie, this, [ token, this.user ] )
    }

} )

module.exports = CustomerLogin