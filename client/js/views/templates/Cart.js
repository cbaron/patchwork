module.exports = p => {
  return `` +
  `<div>
    <h1>Your Cart</h1>
    <div class="column-container">
      <div data-view="viewList" data-name="cartContents"></div>
      <div class="checkout-ui">
        <div class="subtotal">
            <span>Subtotal</span>
            <span data-js="itemCount"></span>
            <span data-js="subtotal"></span>
        </div>
        <div><button class="btn-yellow" data-js="checkoutBtn" type="button">Proceed to Checkout</button></div>
      </div>
    </div>
  </div>`
}