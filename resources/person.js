var BaseResource = require('./__proto__'),
    Person = function() { return BaseResource.apply( this, arguments ) }

Object.assign( Person.prototype, BaseResource.prototype, {

    bcrypt: require('bcrypt-nodejs'),

    context: Object.assign( {}, BaseResource.prototype.context, {
        POST: function() { this.body.password = this.bcrypt.hashSync( this.body.password ) }
    } ),

    PATCH() {
        return this.slurpBody()
        .then( () => {
            this.token = this.body.token
            return this.validate.User.call(this)
        } )
        .then( () => {
            if( new Date().getTime() - this.user.time >= (24*60*60*1000) ) {
                return this.respond( { stopChain: true, body: 'Password must be updated within 24 hours of request', code: 500 } )
            }

            delete this.body.repeatPassword
            delete this.body.token
            this.body.password = this.bcrypt.hashSync( this.body.password )

            return this.Postgres.query(
                `UPDATE person SET password = $1 WHERE id = $2`,
                [ this.body.password, this.user.id ]
            )
        } )
        .then( () => this.respond( { body: { message: 'Password successfully reset' } } ) )
    }

} )

module.exports = Person
