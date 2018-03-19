var Base = require('./__proto__'),
    CheckEmail = function() { return Base.apply( this, arguments ) }

Object.assign( CheckEmail.prototype, Base.prototype, {

    POST() {
        return this.slurpBody()
        .then( () =>
            return this.Postgres.query( `SELECT * FROM person WHERE email = $1`, [ this.body.email.toLowerCase() ] )
            .then( result => {
                const hasAccount = Boolean ( result.rows.length && result.rows[0].id )
                return this.respond( { body: { hasAccount } } )
            } )
        )
    }
} )

module.exports = CheckEmail