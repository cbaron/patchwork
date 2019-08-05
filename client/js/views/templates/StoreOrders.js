module.exports = p => {
  console.log(p);
    //const heading = p.opts.isAdmin ? 'Store Transactions' : 'Your Patchwork Store Orders';

return `` +
`<div class="fd-hidden section">
  <div class="section-heading">
    <h3>Store Orders</h3>
  </div>
  <div data-view="viewList" data-name="orderDetails"></div>
  <div class="balance">Total balance owed on store purchases: 
    <span data-js="storePurchasesBalance"></span>
  </div>
</div>`
}