module.exports = Object.assign( {}, require('./__proto__'), {

    Nav: require( '../models/Nav'),

    events: {
        accountBtn: 'click',
        justify: 'click',
        navLinks: 'click',
        signInBtn: 'click',
        signOutBtn: 'click',
        title: 'click',
        userName: 'click'
    },

    onAccountBtnClick() {
        this.toggleAccountMenu()
        this.emit( 'navigate', 'account-home' )
    },

    onJustifyClick() { this.els.navLinks.classList.toggle('is-mobile') },

    onSignInBtnClick() {
        this.hide().then( () => this.emit('signInClicked') ).catch( this.Error )
    },

    onSignOutBtnClick() {
        document.cookie = `patchworkjwt=; domain=${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
        this.user.clear()

        this.user.set( this.user.defaults )

        this.toggleAccountUI()
        this.toggleAccountMenu()
    },

    onNavLinksClick( e ) {
        const el = e.target.closest('li')

        if( !el ) return

        this.emit( 'navigate', el.getAttribute('data-name') )

        if( this.els.navLinks.classList.contains('is-mobile') ) this.els.navLinks.classList.remove('is-mobile')
    },

    onTitleClick() { this.emit( 'navigate', '/' ) },

    onUser() {
        this.els.userName.textContent = `Hello, ${this.user.get('name')}`
    },

    onUserNameClick() { this.toggleAccountMenu() },

    postRender() {
        this.on('imgLoaded', () => this.els.nav.classList.remove('fd-hidden') )

        this.toggleAccountUI()
        if( this.user.id ) this.onUser()

        return this
    },

    templateOpts() {
        return { fields: this.Nav.data, home: { label: 'Patchwork Gardens', name: 'home' } }
    },

    toggleAccountUI() {
        this.els.signInBtn.classList.toggle( 'fd-hidden', this.user && this.user.id )
        this.els.memberMenu.classList.toggle( 'fd-hidden', !this.user || !this.user.id )
    },

    toggleAccountMenu() {
        this.els.accountMenu.classList.toggle( 'fd-hidden', !this.els.accountMenu.classList.contains('fd-hidden') )
    },

    onLogin() {
        return this.show()
        .then( () => {
            this.onUser()
            this.toggleAccountUI()
        } )
        .catch( this.Error )
    }

} )
