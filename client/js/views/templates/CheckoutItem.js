const Format = require('../../Format')

module.exports = item => {
  return `` +
  `<ul class="checkout-item" data-id="${item.itemId}">
    <li>
      <div>${item.label} (${item.amount.amount} ${item.unit})</div>
      <div>Quantity: ${item.quantity}</div>
    </li>
    <li>${Format.Currency.format(item.price)}</li>
  </ul>`
};