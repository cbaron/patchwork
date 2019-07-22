module.exports = new ( require('backbone').Model.extend( {

    clearCart() {
        window.localStorage.setItem('cart', JSON.stringify([]));
        this.trigger('cartCleared');
    },

    defaults: function() { return { state: {} } },

    isAdmin() {
        const roles = this.get('roles')

        if( ! Array.isArray( roles ) ) return false

        return roles.includes( 'admin' )
    },

    isLoggedIn() {
        return Boolean( this.id && this.get('emailVerified') )
    },

    removeCartItem(id) {
        const cart = JSON.parse(window.localStorage.getItem('cart'));
        if (!cart) return;
        const cartItemIndex = cart.findIndex(({ itemId }) => itemId === id);
        const removed = cart.splice(cartItemIndex, 1);
        window.localStorage.setItem('cart', JSON.stringify(cart));
        this.trigger('cartItemDeleted');
    },

    url() { return "/user" }

} ) )()
