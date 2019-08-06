const Format = require('../../Format');
const Moment = require('moment');

module.exports = p => {
  const status = p.model.isCancelled ? 'Cancelled' : p.model.isFilled ? 'Filled' : 'Open';
  const headingClass = p.model.isCancelled ? 'cancelled' : p.model.isFilled ? 'filled' : '';
  const fillBtnText = p.model.isFilled ? 'Mark as Unfilled' : 'Mark as Filled';
  const cancelBtnText = p.model.isCancelled ? 'Undo Cancellation' : 'Cancel Order';

  return `` +
  `<div>
    <div data-js="orderHeading" class="order-heading ${headingClass}">
      <div>
        <div>${Moment(p.model.created).format("YYYY-MM-DD")}</div>
        <div>Total: ${Format.Currency.format(p.model.total)}</div>
      </div>
      <div>
        <div>Status: <span data-js="status">${status}</span></div>
        <div>Balance: <span data-js="balance"></span></div>
      </div>
      <div class="btn-row">
        <button data-js="addStoreTransactionBtn" class="btn-yellow">Add Transaction</button>
        <button data-js="fillOrderBtn" class="btn-yellow fill-btn">${fillBtnText}</button>
        <button data-js="cancelOrderBtn" class="btn-yellow cancel-order-btn">${cancelBtnText}</button>
      </div>
    </div>
    <div data-js="itemsList">
      <div class="section-title">Items:</div>
    </div>
    <div data-js="transactions" class="transactions fd-hidden">
      <div class="section-title">Transactions:</div>
    </div>
    <div class="fd-hidden" data-view="form" data-name="addStoreTransaction"></div>
  </div>`
}