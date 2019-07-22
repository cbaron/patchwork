module.exports = p => {
  return `` +
  `<div>
    <h1>Checkout</h1>
    <div class="column-container">
      <div class="column-2">
        <div class="order-summary">
          <div>Order Summary</div>
          <div class="checkout-items" data-js="checkoutItems"></div>
          <div class="total">
            <div>Total:</div>
            <div data-js="total"></div>
          </div>
        </div>
      </div>
      <div class="column-1">
        <p data-js="checkoutIntroText"></p>
        <div class="payment">
          <p>Please select a method of payment.</p>
          <ul class="payment-options">
            <li data-js="cashOption" class="payment-option">
              <div>Cash or Check</div>
              <div>Mail payment to Patchwork</div>  
            </li>
            <li data-js="ccOption" class="payment-option">
              <div>Credit Card</div>
              <div>Pay online</div>  
            </li>
          </ul>
          <div class="fd-hidden" data-js="ccWrapper">
              <div data-view="form" data-name="creditCard"></div>
          </div>
          <div class="button-row">
            <button data-js="submitOrderBtn">Submit Your Order</button>
          </div>
        </div>
      </div>
    </div>
  </div>`
}