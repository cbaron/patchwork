const Format = require('../../Format');
const Moment = require('moment');

module.exports = p => {
  const checkNumber = p.checkNumber ? `<div>Check #: ${p.checkNumber}</div>` : ``;
  const notes = p.notes ? `<div>Notes: ${p.notes}</div>` : ``;

  return `` +
  `<div class="transaction-row">
    <div>
      <div>${Moment(p.created).format("YYYY-MM-DD")}</div>
      <div>Type: ${p.action}</div>
      <div>Amount: ${Format.Currency.format(p.amount)}</div>
      <div>Initiator: ${p.initiator}</div>
      ${checkNumber}
    </div>
    ${notes}
  </div>`
}