module.exports = { ...require('./__proto__'),

  Views: {
    orderDetails() {
      return {
        model: Object.create(this.Model).constructor({
          collection: Object.create(this.Model).constructor(),
          view: 'StoreOrderDetails',
          delete: false
        })
      }
    }
  },
  
  model: require('../models/StoreOrder'),

  async update(customer) {
    console.log('update');
    console.log(customer);
    console.log(this.model);
    await this.model.get({ query: { memberId: customer.member.id } });
    console.log(this.model.data);
    this.views.orderDetails.clearItemViews();
    this.views.orderDetails.createItemViews(this.model.data);
    this.updateBalance()
    await this.show();

  },

  updateBalance() {
    return
    const balance = this.model.data.reduce((memo, order) => {
      const amountOwedOnOrder = Number.parseFloat(order.total) - Number.parseFloat(order.amountPaid);
      memo += amountOwedOnOrder;
      return memo;
    }, 0);

    this.els.storePurchasesBalance.textContent = this.Format.Currency.format(balance);
  }
}