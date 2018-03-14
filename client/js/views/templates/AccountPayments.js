module.exports = p =>
`<div>
    <div class="section-heading">
        <h3>Make a Payment</h3>
        <p data-js="balanceMessage">Select a share to view your balance and make a credit card payment</p>
    </div>
    <div data-view="seasons"></div>
    <div class="payment">
        <div class="total" data-js="total"></div>
        <div class="fd-hidden" data-js="ccWrapper">
            <div data-view="form" data-name="creditCard"></div>
        </div>
    </div>
</div>`