module.exports = Object.assign( require( './__proto__' ), {

    events: {
        'signoutBtn': 'click'
    },

    getTemplateOpts: { logo: '/static/img/logo.gif' },

    insertionMethod: 'before',

    onUser: function( user ) {
        this.user = user
        this.els.name.textContent = this.user.get('name')
        this.els.userPanel.classList.remove( 'hide' )
    },
    
    requiresLogin: false,

    onSignoutBtnClick: function() {
        document.cookie = 'patchworkjwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.user.clear()

        this.els.name.textContent = ''
        this.templateData.userPanel.classList.add('hide')

        this.emit('signout')
    }

} )
