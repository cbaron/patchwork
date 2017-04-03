var BaseResource = require('./__proto__'),
    Mail = function() { return BaseResource.apply( this, arguments ) }

Object.assign( Mail.prototype, BaseResource.prototype, {

    Email: require('../lib/Email'),

    POST() {
        return this.slurpBody.call(this)
        .then( () => {
            if( !this.user.id || !this.user.roles.includes('admin') ) throw Error("401")
            return this.Q(
                this.Email.send( {
                    to: process.env.NODE_ENV === 'production' ? this.body.to : process.env.TEST_EMAIL,
                    from: 'eat.patchworkgardens@gmail.com',
                    subject: this.body.subject,
                    body: this.body.body
                } )
            )
        } )
        .then( () => this.respond( { body: { } } ) )
    }
} )

module.exports = Mail
