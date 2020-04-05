module.exports = { ...require('./__proto__'),

  Pikaday: require('pikaday'),

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
    orderSummaryTable: 'click',
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
    if (this.els.filterSelect.value !== 'summary') {
      this.els.from.value = '';
      this.els.to.values = '';
      this.els.dateSearch.classList.add('fd-hidden');
      this.els.orderSummaryTable.innerHTML = '';
      return;
    };
    this.els.dateSearch.classList.remove('fd-hidden');
  },

  onOrderSummaryTableClick(e) {
    const tableRow = e.target.closest('tr');
    if (!tableRow) return;
    tableRow.classList.toggle('selected');
  },

  async onSubmitQueryBtnClick() {
    await this.executeQuery().catch(this.Error);
    this.renderOrders();
  },

  postRender() {
    new this.Pikaday({ field: this.els.from, format: 'YYYY-MM-DD' });
    new this.Pikaday({ field: this.els.to, format: 'YYYY-MM-DD' });
    return this;
  },

  renderOrders() {
    this.views.orderDetails.clearItemViews();
    return this.els.filterSelect.value === 'summary'
      ? this.renderOrderSummaryTable()
      : this.views.orderDetails.createItemViews(this.model.data);
  },

  renderOrderSummaryTable() {
    if (!this.els.from.value || !this.els.to.value) return;
    this.els.orderSummaryTable.innerHTML = '';
    this.slurpTemplate({
      insertion: { el: this.els.orderSummaryTable },
      template: this.Templates.OrderSummaryTable(this.model.data)
    });
  },

  requiresLogin: true,

  requiresRole: 'admin',

  Templates: {
    OrderSummaryTable: require('./templates/OrderSummaryTable')
  }

}