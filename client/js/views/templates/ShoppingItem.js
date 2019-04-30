const Format = require('../../Format');

module.exports = p => {
  console.log(p)
  const amountOptions = p.amountOptions.map(opt =>
    `<option value="${opt.price}">${opt.amount} ${p.unit} -- ${Format.Currency.format(opt.price)}</option>`
  );
  const quantityOptions = p.quantityOptions.map(opt =>
    `<option value="${opt}">${opt}</option>`
  );

  return `` +
  `<div class="shopping-item">
    <h3 class="name">${p.label}</h3>
    <div><img data-src="${Format.ImageSrc(p.amountOptions[0].image)}" /></div>
    <div>
      <label>Choose Amount</label>
      <select data-js="amountSelect">${amountOptions}</select>
    </div>
    <div>
      <label>Choose Quantity</label>
      <select data-js="quantitySelect">${quantityOptions}</select>
    </div>
    <div class="description"><p>${p.description}</p></div>
    <div class="price">Price:<span data-js="itemPrice"></span></div>
    <div><button data-js="addToCartBtn" class="btn-yellow" type="button">Add to Cart</button></div>
  </div>`
}