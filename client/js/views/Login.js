module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {

        loginForm() {
            return {
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
        }

    },

    events: {
        views: {
            loginForm: [
                [ 'posted', function( data ) {
                    this.hide()
                    .then( () => {
                        require('../models/User').set( data )
                        this.emit( "success", data )
                    } )
                    .catch( this.Error )
                } ]
            ]
        }
    }

} )
