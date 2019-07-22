module.exports = { ...require('./__proto__'),

  parse: response => {
    return response.filter(item => {
      const minimumQuantity = Number.parseFloat(item.amountOptions[0].amount);
      return Number.parseFloat(item.available) >= minimumQuantity;
    })
  },

  resource: 'ShoppingItems'

}