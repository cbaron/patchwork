module.exports = p =>
`<div>
    <div class="fd-hidden back-btn" data-js="backBtn">
        <span class="glyphicon glyphicon-menu-left"></span>
        <span>Account Options</span>
    </div>
    <div class="account-nav" data-js="accountNav">
        <div data-js="accountInfoBtn">
            <h4>Account Info</h4>
            <div>View and edit your name, email, phone number, and address.</div>
        </div>
        <div data-js="ordersBtn">
            <h4>Your Orders</h4>
            <div>View your past and current orders.</div>
        </div>
        <div data-js="paymentBtn">
            <h4>Payment</h4>
            <div>Make a credit card payment on any remaining balances.</div>
        </div>
    </div>
    <div class="fd-hidden account-info" data-js="accountInfo">
        <div data-view="form" data-name="personalInfo"></div>
    </div>
    <div class="fd-hidden" data-js="orderInfo">
        <div data-view="seasons"></div>
        <div data-view="orderOptions"></div>
        <div data-view="weekOptions"></div>
        <div data-view="sharePatch"></div>
    </div>
    <div class="fd-hidden" data-view="accountPayments"></div>
</div>`