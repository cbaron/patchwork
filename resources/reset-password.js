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
                if( result.rows.length !== 1 ) return this.respond( { body: { message: 'If you are registered, you will receive an email shortly to reset your password.' } } )

                this.user.id = result.rows[0].id
                this.user.time = new Date().getTime()

                return this.User.createToken.call(this)
                .then( token => {
                    const isProd = process.env.NODE_ENV === 'production'
                    const port = isProd ? '' : `:${process.env.PORT}`

                    return this.email.send( {
                        to: isProd ? this.body.email : process.env.TEST_EMAIL,
                        from: 'eat.patchworkgardens@gmail.com',
                        bodyType: 'html',
                        subject: `Patchwork Gardens Password Reset`,
                        body:
                            `<div>Please click the following link to reset your password: </div>
                            <div><a href="http://${process.env.DOMAIN}${port}/resetPassword/${token}">http://${process.env.DOMAIN}${port}/resetPassword/${token}</a></div>`
                    } )
                } )
            } )
        )
        .then( () => this.respond( { body: { message: 'If you are registered, you will receive an email shortly to reset your password.' } } ) )
        .catch( this.Error )
    }

} )

module.exports = ResetPassword