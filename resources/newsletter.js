const Base = require('./__proto__'),
    Newsletter = function() { return Base.apply( this, arguments ) }

Object.assign( Newsletter.prototype, Base.prototype, {

    async DELETE() {
        await this.slurpBody()
        const result = await this.Postgres.query( `DELETE FROM newsletter WHERE email = $1`, [ this.body.email ] )
        return this.respond( { body: {} } )
    },

    async POST() {
        await this.slurpBody()
        const result = await this.Postgres.query( `SELECT * FROM newsletter WHERE email = $1`, [ this.body.email ] )
        if( !result.rows.length ) await this.Postgres.query( `INSERT INTO newsletter (email) VALUES ($1)`, [ this.body.email ] )
        return this.respond( { body: {} } )
    },

    validate: { ...Base.prototype.validate,
        DELETE() { return Promise.resolve() }
    }

} )

module.exports = Newsletter