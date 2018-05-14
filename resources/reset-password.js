var Base = require('./__proto__'),
    ResetPassword = function() { return Base.apply( this, arguments ) }

Object.assign( ResetPassword.prototype, Base.prototype, {

    email: require('../lib/Email'),

    User: require('./util/User'),

    POST() {
        return this.slurpBody()
        .then( () =>
            this.Postgres.query( "SELECT id FROM person WHERE email = $1", [ this.body.email.toLowerCase() ] )
            .then( result => {
                if( result.rows.length !== 1 ) return this.respond( { stopChain: true, body: 'Email Not Registered', code: 500 } )

                this.user.id = result.rows[0].id
                this.user.time = new Date().getTime()

                return this.User.createToken.call(this)
                .then( token =>
                    this.email.send( {
                        to: process.env.NODE_ENV === 'production' ? this.body.email : process.env.TEST_EMAIL,
                        from: 'eat.patchworkgardens@gmail.com',
                        subject: `Patchwork Gardens Password Reset`,
                        body:
                            `Please click the following link to reset your password :\n` +
                            `http://${process.env.DOMAIN}:${process.env.PORT}/resetPassword/${token}`
                    } )
                )
            } )
        )
        .then( () => this.respond( { body: { message: 'An email has been sent to your address to reset your password.' } } ) )
        .catch( this.Error )
    }

} )

module.exports = ResetPassword