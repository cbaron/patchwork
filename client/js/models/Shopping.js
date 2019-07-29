module.exports = { ...require('./__proto__'),

  parse: response => {
    return response.filter(item => {
      const minimumQuantity = Number.parseFloat(item.amountOptions[0].amount);
      const isDisplaying = item.isDisplaying !== 'false';
      return Number.parseFloat(item.available) >= minimumQuantity && isDisplaying;
    })
  },

  resource: 'ShoppingItems'

}