module.exports = { ...require('./__proto__'),

  parse: response => {
    const filteredItems = response.filter(item => {
      const minimumQuantity = Number.parseFloat(item.amountOptions[0].amount);
      const isDisplaying = item.isDisplaying === 'true';
      return Number.parseFloat(item.available) >= minimumQuantity && isDisplaying;
    });

    return filteredItems.sort((a, b) => Number.parseInt(a.order) - Number.parseInt(b.order));
  },

  resource: 'ShoppingItems'

}