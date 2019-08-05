const Format = require('../../Format');
const Moment = require('moment');

module.exports = p => {
  console.log('order');
  console.log(p);
  return `` +
  `<div>
    <h5>${Moment(p.model.created).format("YYYY-MM-DD")}, Total: ${Format.Currency.format(p.model.total)}</h5>
    <div data-js="itemsList"></div>
    <button data-js="addStoreTransactionBtn" class="btn-yellow">Add Transaction</button>
    <div class="fd-hidden" data-view="form" data-name="addStoreTransaction"></div>
  </div>`
}