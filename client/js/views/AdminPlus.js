module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        'manageBtn': 'click'
    },

    onManageBtnClick() {
        this.emit( 'navigate', 'admin-plus/manage-customer' )
    },

    requiresLogin: true,

    template: require('../templates/adminPlus')

} )