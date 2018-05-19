var Base = require('./__proto__'),
    ResetPassword = function() { return Base.apply( this, arguments ) }

Object.assign( ResetPassword.prototype, Base.prototype, {

    email: require('../lib/Email'),

    User: require('./util/User'),

    POST() {
        const message = 'If you are registered, you will receive an email shortly to reset your password.'

        return this.slurpBody()
        .then( () =>
            this.Postgres.query( "SELECT * FROM person WHERE email = $1", [ this.body.email.toLowerCase() ], { rowsOnly: true } )
            .then( rows => {
                if( rows.length !== 1 ) return this.respond( { stopChain: true, body: { message } } )

                this.user.id = rows[0].id
                this.user.time = new Date().getTime()

                return this.User.createToken.call(this)
                .then( token =>
                    this.email.send( {
                        to: this.isProd ? this.body.email : process.env.TEST_EMAIL,
                        from: 'eat.patchworkgardens@gmail.com',
                        bodyType: 'html',
                        subject: `Patchwork Gardens Password Reset`,
                        body:
                            `<div>Dear ${rows[0].name},</div>
                            <div>Please click <a href="${this.reflectUrl()}/resetPassword/${token}">HERE</a> to reset your Patchwork Gardens password.</div>`
                    } )
                )
            } )
        )
        .then( () => this.respond( { body: { message } } ) )
    }

} )

module.exports = ResetPassword