const Format = require('../../Format');
const Moment = require('moment');

module.exports = p => {
  console.log('detail');
  console.log(p);
  //if (p.model.action ===)
  return `` +
  `<div>
    <h5>${Moment(p.model.createdAt || p.model.purchasedAt).format("YYYY-MM-DD")}, Type: ${p.model.action.toUpperCase()}, Total: ${Format.Currency.format(p.model.orderTotal)}</h5>
    <div data-js="itemsList"></div>
  </div>`
}