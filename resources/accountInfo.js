var Base = require('./__proto__'),
    AccountInfo = function() { return Base.apply( this, arguments ) }

Object.assign( AccountInfo.prototype, Base.prototype, {

    /*GET() {
        return this.validate.GET.call(this)
        .then( () => this.Postgres.query(
            `SELECT p.name, p.email, m.phonenumber, m.address, m.extraaddress ` +
            `FROM person p JOIN member m ON p.id = m.personid ` +
            `WHERE p.id = '${this.user.id}'`
        ) )
        .then( result => this.respond( { body: result.rows[0] } ) )
    },*/

    POST() {
        return this.slurpBody()
        .then( () => {
            if( !this.user.id ) throw Error("401")

            return this.Postgres.query(
                `UPDATE person SET name = $1, email = $2 WHERE id = $3`,
                [ this.body.name, this.body.email, this.user.id ]
            )
            .then( () => this.Postgres.query(
                `UPDATE member SET phonenumber = $1, address = $2, extraaddress = $3 WHERE personid = $4`,
                [ this.body.phonenumber, this.body.address, this.body.extraaddress, this.user.id ]
            ) )
        } )
        .then( () => this.respond( { body: { } } ) )
    }

} )

module.exports = AccountInfo