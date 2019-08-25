module.exports = ({ Currency, model, opts }) => {
  const checked = model.isFilled ? `checked` : ``;
  const hideFromCustomer = opts.user.isAdmin() ? `` : `fd-hidden`;

  return `` +
  `<div class="detail-item">
    <div>
      <span>${model.label} (${model.amount.amount} ${model.unit}, quantity: ${model.quantity}):</span>
      <span>${Currency.format(model.price)}</span>
    </div>
    <div class="${hideFromCustomer}">
      <label>Filled</label>
      <input type="checkbox" data-js="fillItemCheckbox" ${checked} />
    </div>
  </div>`
};