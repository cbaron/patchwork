var BaseResource = require('./__proto__'),
    Verify = function() { return BaseResource.apply( this, arguments ) }

Object.assign( Verify.prototype, BaseResource.prototype, {

    GET() {
        this.getQs()
        if( ! this.query.token ) return this.respond( { stopChain: true, code: 404 } )
        this.token = this.query.token

        return this.validate.User.call(this)
        .then( () => this.Postgres.query( 'SELECT id, email FROM person WHERE id = $1 and email = $2', [ this.user.id, this.user.email ] ) )
        .then( result => {
            if( result.rows.length !== 1 ) return this.respond( { stopChain: true, code: 404 } )

            return this.Postgres.query(
                `UPDATE person SET "emailVerified" = true WHERE id = ${this.user.id}`
            )
        } )
        .then( () => this.respond( { body: { success: true } } ) )
    }

} )

module.exports = Verify