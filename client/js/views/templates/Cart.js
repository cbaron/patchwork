module.exports = p => {
  return `` +
  `<div>
    <div data-js="backToShoppingBtn" class="back-btn">Back to Shopping</div>
    <h1>Your Cart</h1>
    <p data-js="cartIntroText"></p>
    <p data-js="noItemsMessage">You currently have no items in your cart</p>
    <div class="column-container">
      <div data-view="viewList" data-name="cartContents"></div>
      <div data-js="checkoutUi" class="checkout-ui">
        <div class="subtotal">
            <span>Subtotal: </span>
            <span data-js="subtotal"></span>
        </div>
        <div><button class="btn-yellow" data-js="checkoutBtn" type="button">Proceed to Checkout</button></div>
      </div>
    </div>
  </div>`
}