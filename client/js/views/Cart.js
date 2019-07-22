const CustomContent = require('./util/CustomContent')

module.exports = { ...require('./__proto__'), ...CustomContent,

  Views: {
    cartContents() {
      return {
        model: Object.create(this.Model).constructor({
          collection: Object.create(this.Model).constructor(),
          view: 'CartItem',
          delete: false
        })
      }
    }
  },

  events: {
    backToShoppingBtn: 'click',
    checkoutBtn: 'click'
  },

  deriveSubtotal() {
    return this.cart.reduce((memo, item) => {
      memo += item.price;
      return memo;
    }, 0)
  },

  loadCart() {
    this.cart = JSON.parse(window.localStorage.getItem('cart'));
    this.els.noItemsMessage.classList.toggle('fd-hidden', this.cart.length);
    this.els.checkoutUi.classList.toggle('fd-hidden', !this.cart.length);
    this.cart.forEach(cartItem => this.views.cartContents.add(cartItem));
  },

  onBackToShoppingBtnClick() {
    this.emit('navigate', 'shopping');
  },

  onCheckoutBtnClick() {
    this.emit('navigate', 'checkout');
  },

  async onNavigation() {
    try {
      this.views.cartContents.clearItemViews();
      await this.show();
      this.loadCart();
      this.updateSubtotal();
    } catch(err) { this.Error(err) }
  },

  postRender() {
    CustomContent.postRender.call(this)

    this.loadCart();
    this.updateSubtotal();
  
    this.user.on('cartItemDeleted', () => {
      this.cart = JSON.parse(window.localStorage.getItem('cart'));
      this.els.noItemsMessage.classList.toggle('fd-hidden', this.cart.length);
      this.els.checkoutUi.classList.toggle('fd-hidden', !this.cart.length);
      this.updateSubtotal()
    });
    this.user.on('cartItemAdded', item => {
      this.views.cartContents.add(item);
      this.updateSubtotal();
    });

    return this;
  },

  requiresLogin: true,

  updateSubtotal() {
    this.cart = JSON.parse(window.localStorage.getItem('cart'));
    this.els.subtotal.textContent = this.Format.Currency.format(this.deriveSubtotal());
  }
}