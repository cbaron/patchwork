module.exports = p => {
    const instructions = p.opts.isAdmin ? `` : `<p>Select a season to view your order details.</p>`

return `` +
`<div class="fd-hidden section">
    <div class="section-heading">
        <h3>CSA Seasons</h3>
        ${instructions}
    </div>
    <div class="table">
        <ol class="table-row" data-js="list"></ol>
    </div>
    <div data-js="totals" class="totals">
        <div data-js="seasonLabel"></div>
        <div data-js="weeklyPrice"></div>
        <div data-js="weekNumber"></div>
        <div data-js="orderTotal"></div>
    </div>
    <div class="fd-hidden" data-js="noDataMessage">Order has no data.</div>
    <div class="fd-hidden" data-name="orderDeleteButtonFlow" data-view="buttonFlow"></div>
    <div data-js="balanceNotice" class="fd-hidden">Our records indicate an outstanding balance of <span data-js="balanceAmount"></span> for this share. <span class="link" data-js="payment">Pay now</span> if you'd like or continue below if you want to view your order details.</div>
</div>`
}