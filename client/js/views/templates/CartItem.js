//const Format = require('../../Format');

module.exports = p => {
  console.log(p);
  return `` +
  `<div>
    <div class="image-container"><img data-src="${p.ImageSrc(p.model.amount.image)}" /></div>
    <div class="item-info">
      <ul class="item-headers">
        <li>Name</li>
        <li>Amount (${p.model.unit})</li>
        <li>Quantity</li>
        <li>Price</li>
      </ul>
      <ul>
        <li>${p.model.label}</li>
        <li>${p.model.amount.amount}</li>
        <li>${p.model.quantity}</li>
        <li>${p.Currency.format(p.model.price)}</li>
      </ul>
    </div>
    <div class="icon-container">${p.GetIcon('ex')}</div>
  </div>`
};