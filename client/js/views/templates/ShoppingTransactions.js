module.exports = p => {
  console.log(p);
    //const heading = p.opts.isAdmin ? 'Shopping Transactions' : 'Your Patchwork Store Orders';

return `` +
`<div class="fd-hidden section">
  <div class="section-heading">
    <h3>Store Orders</h3>
  </div>
  <div data-view="viewList" data-name="shoppingTransactionItems"></div>
  <div class="balance">Total balance owed on store purchases: <span data-js="storePurchasesBalance"></span></div>
  <button data-js="addShoppingTransactionBtn" class="btn-yellow">Add Transaction</button>
  <div class="fd-hidden" data-view="form" data-name="addShoppingTransaction"></div>
</div>`
}