module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {

        accountInfo() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/AccountInfo').attributes,
                    resource: 'updateAccount'
                } ),
                templateOpts() {
                    return {
                        heading: 'Update Your Account',
                    }
                },
                onCancelBtnClick() { this.emit('cancel') },
                toastSuccess: 'Account upadated!'
            }
        }

    },

    events: {
        views: {
            accountInfo: [
                [ 'posted', function( data ) { this.returnToSite() } ],
                [ 'cancel', function() { this.returnToSite() } ]
            ]
        }
    },

    postRender() {
        this.Xhr( { method: 'get', resource: 'accountInfo' } )
        .then( response => {
            Object.keys( response ).forEach( key => {
                if( this.views.accountInfo.els[ key ] ) this.views.accountInfo.els[ key ].value = response[ key ]
            } )
        } )
        .catch( this.Error )

        return this
    },

    returnToSite() {
        return this.delete()
        .then( () => window.history.back() )
        .catch( this.Error )
    },

    requiresLogin: true

} )