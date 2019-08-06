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
    await this.model.get({
      query: {
        memberId: customer.member.data.id,
        sort: 'created desc'
      }
    });

    this.views.orderDetails.clearItemViews();
    this.views.orderDetails.createItemViews(this.model.data);
    await this.show();
  }

}