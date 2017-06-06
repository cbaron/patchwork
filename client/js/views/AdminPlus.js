module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        'manageBtn': 'click',
        'reportingBtn': 'click'
    },

    onManageBtnClick() {
        this.emit( 'navigate', 'admin-plus/manage-customer' )
    },

    onReportingBtnClick() {
        this.emit( 'navigate', 'admin-plus/reporting' )
    },

    requiresLogin: true,

    requiresRole: 'admin'
} )
