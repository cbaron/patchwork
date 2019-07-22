const CustomContent = require('./util/CustomContent')

module.exports = { ...require('./__proto__'), ...CustomContent,

  ModalView: require('./modal'),
  Shopping: require('../models/Shopping'),
  ShoppingTransaction: require('../models/ShoppingTransaction'),
  Spinner: require('../plugins/spinner.js'),

  Templates: {
    CheckoutItem: require('./templates/CheckoutItem')
  },

  Views: {
    creditCard() {
      return {
        model: Object.create( this.Model ).constructor( { }, {
          attributes: require('../../../models/CreditCard').attributes,
          data: { isPayingWithCreditCard: false },
          meta: {
            noPlaceholder: true
          },
          resource: 'shopping-purchase'
        }),
        templateOpts() {
          return {
            hideButtonRow: true,
            prompt: 'Please enter your credit card information.'
          }
        }
      }
    }
  },

  events: {
    cashOption: 'click',
    ccOption: 'click',
    submitOrderBtn: 'click'
  },

  async checkAvailability() {
    let unavailableItems = [];

    await this.Shopping.get();

    this.cart.forEach(cartItem => {
      const latestDatum = this.Shopping.data.find(
        ({ _id }) => _id === cartItem.itemId
      );
      const amountPurchased =
        Number.parseFloat(cartItem.amount.amount) * Number.parseInt(cartItem.quantity);
      const amountLeft = Number.parseFloat(latestDatum.available) - amountPurchased;

      if (amountLeft < 0) {
        unavailableItems.push(cartItem.label);
        this.user.removeCartItem(cartItem.itemId);
      };
    })

    return unavailableItems
  },

  deriveTotal() {
    return this.cart.reduce((memo, item) => {
      memo += item.price;
      return memo;
    }, 0)
  },

  loadCart() {
    this.cart = JSON.parse(window.localStorage.getItem('cart'));
    
    if (!this.cart.length) return this.emit('navigate', '/cart');

    this.cart.forEach(cartItem => this.slurpTemplate({
      insertion: { el: this.els.checkoutItems },
      template: this.Templates.CheckoutItem(cartItem)
    }))
  },

  onCashOptionClick() {
    this.els.ccWrapper.classList.add('fd-hidden');
    this.els.cashOption.classList.add('selected');
    this.els.ccOption.classList.remove('selected');
    this.selectedPayment = 'cash/check';
    this.views.creditCard.model.data.isPayingWithCreditCard = false;
  },

  onCcOptionClick() {
    this.els.ccWrapper.classList.remove('fd-hidden')
    this.els.ccOption.classList.add('selected');
    this.els.cashOption.classList.remove('selected');
    this.selectedPayment = 'credit card';
    this.views.creditCard.model.data.isPayingWithCreditCard = true;
  },

  async onNavigation() {
    try {
      this.els.ccWrapper.classList.add('fd-hidden')
      this.views.creditCard.clear();
      this.els.ccOption.classList.remove('selected');
      this.els.cashOption.classList.remove('selected');
      this.selectedPayment = '';
      this.els.checkoutItems.innerHTML = '';
      await this.show();
      this.loadCart();
      this.updateTotal();
    } catch(err) { this.Error(err) }
  },

  async onSubmitOrderBtnClick() {
    if (!this.selectedPayment) {
      return this.Toast.showMessage('error', 'Please select a method of payment');
    };

    if (this.isSubmitting) return
    this.isSubmitting = true

    this.spinner.spin()
    this.els.submitOrderBtn.appendChild(this.spinner.el)
    this.els.submitOrderBtn.classList.add('has-spinner')

    try {
      const unavailableItems = await this.checkAvailability();

      if (unavailableItems.length) {
        const itemsString = unavailableItems.join(', ');
        await this.delete();
        this.Toast.showMessage('error', `${itemsString} no longer available. Your cart has been updated`);
        return this.emit('navigate', '/cart');
      };

      const orderTotal = this.deriveTotal();
      const transactionData = {
        personId: this.user.id,
        action: 'store purchase',
        paymentMethod: this.selectedPayment,
        amountPaid: this.selectedPayment === 'credit card' ? orderTotal : 0,
        items: this.cart,
        orderTotal,
        purchasedAt: new Date()
      };
      const transactionResult = await this.ShoppingTransaction.post(transactionData);
      const paymentResponse = await this.Xhr({
        method: 'POST',
        resource: 'shopping-purchase',
        data: JSON.stringify({
          ...this.views.creditCard.model.data,
          ...this.views.creditCard.getFormValues(),
          total: orderTotal
        })
      })

      if (paymentResponse.error) {
        this.Toast.showMessage('error', paymentResponse.error);
        await this.Xhr({ method: 'DELETE', resource: 'ShoppingTransaction', id: transactionResult._id });
      }

      await this.updateAvailability();
      this.els.submitOrderBtn.classList.remove('has-spinner');
      this.spinner.stop();
      this.isSubmitting = false;
      this.showSuccessModal();
    } catch(err) {
      this.Error(err);
      this.Toast.showMessage('error', 'There was a problem with your transaction. Please try again or contact support.');
      this.spinner.stop();
      this.els.submitOrderBtn.classList.remove('has-spinner');
      this.isSubmitting = false;
    }
  },

  postRender() {
    CustomContent.postRender.call(this);

    this.loadCart();
    this.updateTotal();
  
    this.user.on('cartItemDeleted', () => this.updateTotal());

    this.spinner = new this.Spinner({
      color: '#000',
      lines: 7,
      length: 4,
      radius: 16,
      scale: 0.6
    })

    return this;
  },

  requiresLogin: true,

  requiresRole: 'admin',

  showSuccessModal() {
    this.ModalView.show({
      title: `Thank you!`,
      body: 'We have received your order. You will receive a confirmation email shortly.',
      confirmText: 'Done',
      hideCancelBtn: true
    })
    .on('submit', async () => {
      this.ModalView.hide();
      this.user.clearCart();
      await this.delete().catch(this.Error);
      this.emit('navigate', '/');
    })
  },

  updateAvailability() {
    return Promise.all(
      this.cart.map(cartItem => {
        const latestDatum = this.Shopping.data.find(
          ({ _id }) => _id === cartItem.itemId
        );
        const amountPurchased =
          Number.parseFloat(cartItem.amount.amount) * Number.parseInt(cartItem.quantity);
        const amountLeft = Number.parseFloat(latestDatum.available) - amountPurchased;
        const updatedDatum = { ...latestDatum, available: amountLeft };
        delete updatedDatum._id;

        return this.Shopping.put(latestDatum._id, updatedDatum);
      })
    );
  },

  updateTotal() {
    this.cart = JSON.parse(window.localStorage.getItem('cart'));
    this.els.total.textContent = this.Format.Currency.format(this.deriveTotal());
  }
}