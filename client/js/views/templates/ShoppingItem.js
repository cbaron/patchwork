const Format = require('../../Format');

module.exports = ({ model }) => {
  const amountOptions = model.amountOptions.map((opt, index) =>
    `<option data-index="${index}" value="${opt.price}">${opt.amount} ${model.unit} -- ${Format.Currency.format(opt.price)}</option>`
  );
  const quantityOptions = model.quantityOptions.map(opt =>
    `<option value="${opt}">${opt}</option>`
  );

  return `` +
  `<div class="shopping-item">
    <h3 class="name">${model.label}</h3>
    <div><img data-js="itemImage" data-src="${Format.ImageSrc(model.amountOptions[0].image)}" /></div>
    <div>
      <label>Choose Amount</label>
      <select data-js="amountSelect">${amountOptions}</select>
    </div>
    <div>
      <label>Choose Quantity</label>
      <select data-js="quantitySelect">${quantityOptions}</select>
    </div>
    <div class="description"><p>${model.description}</p></div>
    <div class="price">Price:<span data-js="itemPrice"></span></div>
    <div><button data-js="addToCartBtn" class="btn-yellow" type="button">Add to Cart</button></div>
  </div>`
}