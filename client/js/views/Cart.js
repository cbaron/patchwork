module.exports = { ...require('./__proto__'),

  Templates: {
    CartItem: require('./templates/CartItem')
  },

  Views: {
    cartContents() {
      return {
        model: Object.create(this.Model).constructor({
          collection: Object.create(this.Model).constructor(),
          view: 'CartItem',
          delete: false
        }),

      }
    }
  },

  events: {
      checkoutBtn: 'click'
  },

  deriveSubtotal() {
    return this.cart.reduce((memo, item) => {
      memo += item.price;
      return memo;
    }, 0)
  },

  updateSubtotal() {
      this.els.itemCount.textContent = `(${this.cart.length} items):`;
      this.els.subtotal.textContent = this.Format.Currency.format(this.deriveSubtotal());
  },

  onCheckoutBtnClick() {
      this.emit( 'navigate', 'checkout' )
  },

  onNavigation() {
      ( this.isHidden() ? this.show() : Promise.resolve() )
      .then( () => this.els.container.scrollIntoView( { behavior: 'smooth' } ) )
      .catch( this.Error )
  },

  postRender() {
    this.cart = JSON.parse(window.localStorage.getItem('cart'));
    this.cart.forEach(cartItem => this.views.cartContents.add(cartItem));
    console.log(this.cart);
    return this
  }

}