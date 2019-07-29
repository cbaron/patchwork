module.exports = { ...require('./__proto__'),

  Views: {
    addShoppingTransaction() {
      return {
        model: Object.create( this.Model ).constructor( { }, {
          attributes: require('../../../models/ShoppingTransaction').attributes,
          data: {
            createdAt: new Date()
          },
          meta: {
            key: '_id',
            noPlaceholder: true
          },
          resource: 'ShoppingTransaction'
        }),
        templateOpts() {
          return {
          }
        }
      }
    },
    shoppingTransactionItems() {
      return {
        model: Object.create(this.Model).constructor({
          collection: Object.create(this.Model).constructor(),
          view: 'ShoppingTransactionDetails',
          delete: false
        })
      }
    }
  },

  events: {
    addShoppingTransactionBtn: 'click',
    views: {
      addShoppingTransaction: [
        ['put', function(model) {
          console.log('put');
          console.log(model);
        }],
        ['posted', function(model) {
          console.log('posted');
          console.log(model);
        }]
      ]
    }
  },
  
  model: require('../models/ShoppingTransaction'),

  onAddShoppingTransactionBtnClick() {
    this.views.addShoppingTransaction.show().catch(this.Error);
  },

  async update(customer) {
    console.log('update');
    console.log(customer);
    console.log(this.model);
    await this.model.get({ query: { personId: customer.person.id } });
    console.log(this.model.data);
    this.views.shoppingTransactionItems.clearItemViews();
    this.views.shoppingTransactionItems.createItemViews(this.model.data);
    this.views.addShoppingTransaction.model.data.personId = customer.person.id;
    this.updateBalance()
    await this.show();

  },

  updateBalance() {
    const balance = this.model.data.reduce((memo, order) => {
      const amountOwedOnOrder = Number.parseFloat(order.orderTotal) - Number.parseFloat(order.amountPaid);
      memo += amountOwedOnOrder;
      return memo;
    }, 0);

    this.els.storePurchasesBalance.textContent = this.Format.Currency.format(balance);
  }
}