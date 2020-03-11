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
    filterSelect: 'change',
    submitQueryBtn: 'click'
  },
  
  model: require('../models/ManageOrders'),

  async executeQuery() {
    const query = {
      sort: 'created desc'
    };

    switch(this.els.filterSelect.value) {
      case 'summary':
        query.from = this.els.from.value;
        query.to = this.els.to.value;
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

  onFilterSelectChange(e) {
    console.log(this.els.filterSelect.value);
    if (!this.els.filterSelect.value === 'summary') return;
    this.els.dateSearch.classList.remove('fd-hidden');
  },

  async onSubmitQueryBtnClick() {
    await this.executeQuery().catch(this.Error);
    this.renderOrders();
  },

  renderOrders() {
    this.views.orderDetails.clearItemViews();
    return this.els.filterSelect.value === 'summary'
      ? this.renderOrderSummaryTable()
      : this.views.orderDetails.createItemViews(this.model.data);
  },

  renderOrderSummaryTable() {
    console.log('renderordersummary');
    console.log(this.els.from.value);
    if (!this.els.from.value || !this.els.to.value) return;

    this.slurpTemplate({
      el: { insertion: this.els.orderSummaryTable },
      template: this.Templates.OrderSummaryTable(this.model.data);
  },

  requiresLogin: true,

  requiresRole: 'admin'

}