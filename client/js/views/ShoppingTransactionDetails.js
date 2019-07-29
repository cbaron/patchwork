module.exports = { ...require('./__proto__'),

  Templates: {
    ShoppingTransactionDetailsItem: require('./templates/ShoppingTransactionDetailsItem')
  },

  postRender() {
    this.renderItemsPurchased();
    return this;
  },

  renderItemsPurchased() {
    this.model.data.items.forEach(item =>
      this.slurpTemplate({
        insertion: { el: this.els.itemsList },
        template: this.Templates.ShoppingTransactionDetailsItem(item)
      })
    )
  }
}