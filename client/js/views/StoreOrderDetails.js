module.exports = { ...require('./__proto__'),

  Templates: {
    StoreOrderItem: require('./templates/StoreOrderItem')
  },

  Views: {
    addStoreTransaction() {
      return {
        model: Object.create( this.Model ).constructor( { }, {
          attributes: require('../../../models/StoreTransaction').attributes,
          meta: {
            key: 'id',
            noPlaceholder: true
          },
          resource: 'storeTransaction'
        }),
        templateOpts() {
          return {
          }
        }
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

  onAddShoppingTransactionBtnClick() {
    this.views.addShoppingTransaction.show().catch(this.Error);
  },

  postRender() {
    this.renderItemsPurchased();
    return this;
  },

  renderItemsPurchased() {
    console.log('renderItemsPurchased');
    console.log(this.model);
    this.model.data.items.forEach(item =>
      this.slurpTemplate({
        insertion: { el: this.els.itemsList },
        template: this.Templates.StoreOrderItem(item)
      })
    )
  }
}