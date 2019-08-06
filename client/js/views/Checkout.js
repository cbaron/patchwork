const CustomContent = require('./util/CustomContent')

module.exports = { ...require('./__proto__'), ...CustomContent,

  ModalView: require('./modal'),
  Member: require('../models/Member'),
  Shopping: require('../models/Shopping'),
  StoreOrder: require('../models/StoreOrder'),
  StoreTransaction: require('../models/StoreTransaction'),
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

  async getMemberId() {
    const [memberRow] = await this.Member.get({ query: { personid: this.user.id } });
    return memberRow.id;
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
    this.selectedPayment = 'cash or check';
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

  onSubmitEnd() {
    this.els.submitOrderBtn.classList.remove('has-spinner');
    this.spinner.stop();
    this.isSubmitting = false;
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

      const memberId = await this.getMemberId();
      const orderTotal = this.deriveTotal();
      const orderData = {
        memberId,
        paymentMethod: this.selectedPayment,
        items: JSON.stringify(this.cart),
        total: orderTotal
      };

      const orderResult = await this.StoreOrder.post(orderData);

      if (this.selectedPayment === 'credit card') {
        const transactionResult = await this.StoreTransaction.post({
          orderId: orderResult.id,
          action: 'payment',
          amount: orderTotal,
          initiator: 'customer'
        })
      }

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

        if (this.selectedPayment === 'credit card') {
          await this.Xhr({ method: 'DELETE', resource: 'storeTransaction', id: paymentTransactionResult.id });
        };

        await this.Xhr({ method: 'DELETE', resource: 'storeOrder', id: transactionResult.id });

        return this.onSubmitEnd();
      }

      await this.updateAvailability();
      this.onSubmitEnd();
      this.showSuccessModal();
    } catch(err) {
      this.Error(err);
      this.Toast.showMessage('error', 'There was a problem with your transaction. Please try again or contact support.');
      this.onSubmitEnd();
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
      this.Shopping.data = {};
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