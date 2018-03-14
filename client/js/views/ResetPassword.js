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

                    return this.Xhr( { method: 'patch', resource: 'person', data: JSON.stringify( this.model.data ) } )
                    .then( response => {
                        this.model.data = { }
                        this.clear()
                        return this.Toast.showMessage( 'success', response.message )
                    } )
                    .then( () => Promise.resolve( this.emit('patched') ) )
                }
            }
        }

    },

    events: {
        views: {
            resetPassword: [
                [ 'patched', function() { this.delete().then( () => this.emit( 'navigate', '' ) ).catch( this.Error ) } ]
            ]
        }
    },

    postRender() {
        this.views.resetPassword.model.set( 'token', window.location.pathname.split('/').pop() )
        return this
    }

} )