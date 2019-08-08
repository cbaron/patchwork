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

  events: {
    submitQueryBtn: 'click'
  },
  
  model: require('../models/ManageOrders'),

  async executeQuery() {
    const query = {
      sort: 'created desc'
    };

    switch(this.els.filterSelect.value) {
      case 'open':
        query.isFilled = false;
        break;
      case 'filled':
        query.isFilled = true;
        break;
      case 'cancelled':
        query.isCancelled = true;
        break;
      default:
        break;
    }

    this.model.data = {};

    await this.model.get({ query });
  },

  async onSubmitQueryBtnClick() {
    await this.executeQuery().catch(this.Error);
    this.renderOrders();
  },

  renderOrders() {
    this.views.orderDetails.clearItemViews();
    this.views.orderDetails.createItemViews(this.model.data);
  },

  requiresLogin: true,

  requiresRole: 'admin'

}