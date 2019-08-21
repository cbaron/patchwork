module.exports = ({ Currency, model }) => {
  const checked = model.isFilled ? `checked` : ``;

  return `` +
  `<div class="detail-item">
    <div>
      <span>${model.label} (${model.amount.amount} ${model.unit}, quantity: ${model.quantity}):</span>
      <span>${Currency.format(model.price)}</span>
    </div>
    <div>
      <label>Filled</label>
      <input type="checkbox" data-js="fillItemCheckbox" ${checked} />
    </div>
  </div>`
};