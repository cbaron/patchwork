module.exports = { ...require('./__proto__'),

  Views: {
    transactionDetails() {
      return {
        model: Object.create(this.Model).constructor({
          collection: Object.create(this.Model).constructor(),
          view: 'ShoppingTransactionDetails',
          delete: false
        })
      }
    }
  },
  
  model: require('../models/ShoppingTransaction'),

  async update(customer) {
    console.log('update');
    console.log(customer);
    console.log(this.model);
    await this.model.get({ query: { personId: customer.person.id } });
    console.log(this.model.data);

  }
}