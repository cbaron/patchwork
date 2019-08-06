const Format = require('../../Format')

module.exports = item => {
  return `` +
  `<div class="detail-item">
    <span>${item.label} (${item.amount.amount} ${item.unit}, quantity: ${item.quantity}):</span>
    <span>${Format.Currency.format(item.price)}</span>
  </div>`
};