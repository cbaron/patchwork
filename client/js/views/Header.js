module.exports = Object.assign( {}, require('./__proto__'), {

    Nav: require( '../models/Nav'),

    events: {
        accountBtn: 'click',
        csaSignUpBtn: 'click',
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

    onCsaSignUpBtnClick() { this.emit( 'navigate', 'sign-up' ) },

    onJustifyClick() { this.els.navLinks.classList.toggle('is-mobile') },

    onLogin() {
        this.onUser()
        this.displayingLogin = false
        this.toggleAccountUI()
        return Promise.resolve()
    },

    onNavLinksClick( e ) {
        if( this.displayingLogin ) this.emit('removeLogin')
        const el = e.target.closest('li')

        if( !el ) return

        this.emit( 'navigate', el.getAttribute('data-name') )
        if( this.els.navLinks.classList.contains('is-mobile') ) this.els.navLinks.classList.remove('is-mobile')
    },

    onSignInBtnClick() {
        this.emit('signInClicked')
        this.displayingLogin = true
    },

    onSignOutBtnClick() {
        document.cookie = `patchworkjwt=; domain=${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`

        this.user.clear()

        this.user.set( this.user.defaults() )

        this.toggleAccountUI()
        this.toggleAccountMenu()

        this.emit('signOutClicked')

        this.Toast.showMessage( 'success', 'You are now signed out.' )
    },

    onTitleClick() {
        if( this.displayingLogin ) this.emit('removeLogin')
        this.emit( 'navigate', '/' )
    },

    onUser() { this.els.userName.textContent = `Hello, ${this.user.get('name')}` },

    onUserNameClick() { this.toggleAccountMenu() },

    postRender() {
        this.on( 'imgLoaded', () => this.els.nav.classList.remove('fd-hidden') )

        this.toggleAccountUI()

        if( this.user.isLoggedIn() ) this.onUser()

        return this
    },

    templateOpts() {
        return { fields: this.Nav.data, home: { label: 'Patchwork Gardens', name: 'home' } }
    },

    toggleAccountUI() {
        this.els.signInBtn.classList.toggle( 'fd-hidden', this.user.isLoggedIn() )
        this.els.memberMenu.classList.toggle( 'fd-hidden', !this.user || !this.user.id )
    },

    toggleAccountMenu() {
        this.els.accountMenu.classList.toggle( 'fd-hidden', !this.els.accountMenu.classList.contains('fd-hidden') )
    },

    toggleSignUpBtn( view ) {
        this.els.csaSignUpBtn.parentNode.classList.toggle( 'fd-hidden', view === 'home' )
    }

} )
