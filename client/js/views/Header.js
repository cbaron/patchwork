module.exports = Object.assign( {}, require('./__proto__'), {

    Nav: require( '../models/Nav'),

    events: {
        accountBtn: 'click',
        cart: 'click',
        csaSignUpBtn: 'click',
        justify: 'click',
        navLinks: 'click',
        //shoppingBtn: 'click',
        signInBtn: 'click',
        signOutBtn: 'click',
        title: 'click',
        userName: 'click'
    },

    checkForLogin() {
        if( this.displayingLogin ) { this.displayingLogin = false; this.emit('removeLogin') }
    },

    onAccountBtnClick() {
        this.toggleAccountMenu()
        this.emit( 'navigate', 'account-home' )
    },

    onCartClick() { this.emit('navigate', 'cart') },

    onCsaSignUpBtnClick() {
        this.checkForLogin()
        this.emit( 'navigate', 'sign-up' )
    },

    onJustifyClick() { this.els.navLinks.classList.toggle('is-mobile') },

    onLogin() {
        this.onUser()
        this.displayingLogin = false
        this.toggleAccountUI()
        return Promise.resolve()
    },

    onNavLinksClick( e ) {
        this.checkForLogin()
        const el = e.target.closest('li')

        if( !el ) return

        this.emit( 'navigate', el.getAttribute('data-name') )
        if( this.els.navLinks.classList.contains('is-mobile') ) this.els.navLinks.classList.remove('is-mobile')
    },

    onShoppingBtnClick() {
        this.toggleAccountMenu()
        this.emit('navigate', 'shopping')
    },

    onSignInBtnClick() {
        if( this.displayingLogin ) return
        this.emit('signInClicked')
        this.displayingLogin = true
    },

    onSignOutBtnClick() {
        document.cookie = `patchworkjwt=; domain=${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`

        this.user.clear()

        this.user.set( this.user.defaults() )

        this.toggleAccountUI()
        this.toggleAccountMenu()
        this.els.cart.classList.add('fd-hidden');

        this.emit('signOutClicked')

        this.Toast.showMessage( 'success', 'You are now signed out.' )
    },

    onTitleClick() {
        this.checkForLogin()
        this.emit( 'navigate', '/' )
    },

    onUser() {
        this.els.userName.textContent = `Hello, ${this.user.get('name')}`;
        this.user.on('cartItemAdded', () => this.updateCartCount());
        this.user.on('cartItemDeleted', () => this.updateCartCount());
        this.user.on('cartCleared', () => this.updateCartCount());
        this.els.cart.classList.toggle('fd-hidden', !this.user.isAdmin());
        this.updateCartCount();
    },

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
    },

    updateCartCount() {
        const cart = window.localStorage.getItem('cart');
        const cartLength = cart ? JSON.parse(cart).length : 0;

        this.els.cartCount.textContent = `(${cartLength})`;
    }

} )
