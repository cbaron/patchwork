var Base = require('./__proto__'),
    AccountInfo = function() { return Base.apply( this, arguments ) }

Object.assign( AccountInfo.prototype, Base.prototype, {

    User: require('./util/User'),

    POST() {
        return this.slurpBody()
        .then( () => {
            if( !this.user.id ) throw Error("401")

            const zipcode = this.body.zipcode || this.body.oldZipcode

            return this.Postgres.query(
                `UPDATE person SET name = $1, email = $2 WHERE id = $3`,
                [ this.body.name, this.body.email, this.user.id ]
            )
            .then( () => this.Postgres.query(
                `UPDATE member SET phonenumber = $1, address = $2, extraaddress = $3, zipcode = $4 WHERE personid = $5`,
                [ this.body.phonenumber, this.body.address, this.body.extraaddress, zipcode, this.user.id ]
            ) )
            .then( () => {
                Object.keys( this.body ).forEach( key => {
                    if( this.user[ key ] ) this.user[ key ] = this.body[ key ]
                } )

                this.user.zipcode = zipcode
                return this.User.createToken.call(this)
            } )
            .then( token => this.User.respondSetCookie.call( this, token, Object.assign( { }, this.body, { zipcode } ) ) )
        } )
    }

} )

module.exports = AccountInfo