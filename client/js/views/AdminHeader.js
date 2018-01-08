module.exports = Object.assign( { }, require( './__proto__' ), {

    events: {
        'signoutBtn': 'click'
    },

    templateOpts: { logo: '/static/img/logo.gif' },

    insertionMethod: 'before',

    onUser() {
        this.els.name.textContent = this.user.get('name')
        this.els.userPanel.classList.remove( 'hide' )
    },
    
    requiresLogin: false,

    onSignoutBtnClick: function() {
        document.cookie = `patchworkjwt=; domain=${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
        this.user.clear()

        this.user.set( this.user.defaults )

        this.els.name.textContent = ''
        this.els.userPanel.classList.add('hide')

        this.emit('signout')
    }

} )
