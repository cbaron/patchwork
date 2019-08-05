const Format = require('../../Format')

module.exports = item => {
  return `` +
  `<p class="detail-item">
    ${item.label} (${item.amount.amount} ${item.unit}), Quantity: ${item.quantity}, ${Format.Currency.format(item.price)}
  </p>`
};