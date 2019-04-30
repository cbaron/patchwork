module.exports = { ...require('./__proto__'),

  ShoppingModel: require('../models/Shopping'),

  Views: {
    shoppingItems() {
      return {
        events: {
          amountSelect: 'change',
          list: 'click'
        },
        model: Object.create( this.Model ).constructor({
          collection: Object.create(this.ShoppingModel),
          delete: false,
          fetch: true
        }),
        onAmountSelectChange: e => this.onAmountSelectChange(e),
        itemTemplate: shoppingItem => this.Templates.ShoppingItem(shoppingItem),
        templateOpts: {}
      }
    }
  },

  onAmountSelectChange(e) {
    console.log('onamountchange');
    console.log(e.target.value)
    console.log(this.views.list)
    console.log(this.views.shoppingItems)
    this.updatePrice()
  },

  postRender() {
    return this;
  },

  requiresLogin: true,

  Templates: {
    ShoppingItem: require('./templates/ShoppingItem')
  },

  updatePrice(newPrice) {
    return
  }

}