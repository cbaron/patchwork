const CustomContent = require('./util/CustomContent')

module.exports = { ...require('./__proto__'), ...CustomContent,

  ShoppingModel: require('../models/Shopping'),

  Views: {
    shoppingItems() {
      return {
        model: Object.create( this.Model ).constructor({
          collection: Object.create(this.ShoppingModel),
          view: 'ShoppingItem',
          delete: false,
          fetch: true,
          sort: { order: 1 }
        })
      }
    }
  },

  async onNavigation() {
    try {
      this.views.shoppingItems.clearItemViews();
      await this.show();
      await this.views.shoppingItems.fetch();
    } catch(err) { this.Error(err) }
  },

  postRender() {
    this.views.shoppingItems.on('fetched', () => {
      if (!this.views.shoppingItems.itemViews.length) {
        this.els.shoppingIntroText.textContent = 'We currently have no items for sale. Please check back again soon!';
      } else {
        CustomContent.postRender.call(this);
      }
    });

    return this;
  },

  requiresLogin: true,

  requiresRole: 'admin'

}