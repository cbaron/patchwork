module.exports = { ...require('./__proto__'),

  ShoppingModel: require('../models/Shopping'),

  Views: {
    shoppingItems() {
      return {
        model: Object.create( this.Model ).constructor({
          collection: Object.create(this.ShoppingModel),
          view: 'ShoppingItem',
          delete: false,
          fetch: true
        })
      }
    }
  },

  requiresLogin: true

}