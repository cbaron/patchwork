module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {

        resetPassword() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: [
                        require('../../../models/Password'),
                        require('../../../models/ResetPassword')
                    ],
                    resource: 'person'
                } ),
                templateOpts() {
                    return {
                        heading: 'Reset Your Password',
                        prompt: 'Please enter a new password.'
                    }
                },
                submit() {
                    if( !this.validate( this.getFormValues() ) || !this.model.validateRepeatPassword() ) return Promise.resolve( this.onSubmitEnd() )

                    return this.Xhr( { method: 'patch', resource: 'reset-password', data: JSON.stringify( this.model.data ) } )
                    .then( response => {
                        this.model.data = { }
                        this.clear()
                        this.emit('patched')
                        return this.Toast.showMessage( 'success', response.message )
                    } )
                }
            }
        }

    },

    postRender() {
        this.views.resetPassword.model.set( 'token', window.location.pathname.split('/').pop() )
        return this
    }

} )