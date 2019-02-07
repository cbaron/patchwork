var BaseResource = require('./__proto__'),
    Mail = function() { return BaseResource.apply( this, arguments ) }

Object.assign( Mail.prototype, BaseResource.prototype, {

    SendGrid: require('../lib/SendGrid'),

    POST() {
        return this.slurpBody.call(this)
        .then( () => {
            if( !this.user.id || !this.user.roles.includes('admin') ) throw Error("401")
            return this.Q(
                this.SendGrid.send( {
                    to: process.env.NODE_ENV === 'production' ? this.body.to : process.env.TEST_EMAIL,
                    from: 'Patchwork Gardens <eat.patchworkgardens@gmail.com>',
                    subject: this.body.subject,
                    html: this.Templates.EmailBase({ emailBody: this.Templates.PaymentReminder(this.body) })
                } )
            )
        } )
        .then( () => this.respond( { body: { } } ) )
    },

    Templates: {
        EmailBase: require('../templates/EmailBase'),
        PaymentReminder: require('../templates/PaymentReminder')
    }
} )

module.exports = Mail
