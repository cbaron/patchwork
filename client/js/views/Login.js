module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {

        loginForm() {
            return {
                handleSubmissionError( err ) {
                    this.Toast.showMessage( 'error', err )
                    this.Error( err )
                    this.onSubmitEnd()
                },
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/Login').attributes,
                    resource: 'auth'
                } ),
                templateOpts() {
                    return {
                        heading: 'Sign In',
                    }
                },
                onCancelBtnClick() { this.emit('cancel') },
                toastSuccess: 'You are signed in!'
            }
        },
        forgotPassword() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: [ require('../../../models/Email') ],
                    resource: 'reset-password'
                } ),
                templateOpts() {
                    return {
                        heading: 'Reset Password',
                        prompt: 'Please enter your email address'
                    }
                },
                onCancelBtnClick() { this.emit('cancel') }
            } 
        }

    },

    events: {
        forgotPassword: 'click',

        views: {
            loginForm: [
                [ 'posted', function( data ) {
                    this.user.set( data )
                    this.emit( "success", data )
                    this.delete().catch( this.Error )
                } ],
                [ 'cancel', function() { this.delete().then( () => this.emit('loginCancelled') ).catch( this.Error ) } ]
            ],
            forgotPassword: [
                [ 'posted', function( data ) { this.Toast.showMessage( 'success', data.message ) } ],
                [ 'cancel', function() { this.views.forgotPassword.hide().then( () => this.showEl( this.els.loginWrapper ) ).catch( this.Error ) } ]
            ]
        }
    },

    onForgotPasswordClick() {
        return this.hideEl( this.els.loginWrapper )
        .then( () => this.views.forgotPassword.show() )
        .catch( this.Error )
    }

} )
