module.exports = p => {
  return `` +
  `<div>
    <div data-id="${p.model.itemId}">
      <div class="image-container"><img data-src="${p.ImageSrc(p.model.amount.image)}" /></div>
      <div class="item-info">
        <ul class="item-headers">
          <li>Name</li>
          <li>Amount (${p.model.unit})</li>
          <li>Quantity</li>
          <li>Price</li>
        </ul>
        <ul>
          <li>${p.model.label}</li>
          <li>${p.model.amount.amount}</li>
          <li>${p.model.quantity}</li>
          <li>${p.Currency.format(p.model.price)}</li>
        </ul>
      </div>
      <div class="icon-container">${p.GetIcon('ex')}</div>
    </div>
    <div data-id="${p.model.itemId}" class="mobile-cart-item">
      <div>
        <div class="image-container"><img data-src="${p.ImageSrc(p.model.amount.image)}" /></div>
        <div class="icon-container">${p.GetIcon('ex')}</div>
      </div>
      <div class="item-info">
        <ul>
          <li>
            <div>Name</div>
            <div>${p.model.label}</div>
          </li>
          <li>
            <div>Amount (${p.model.unit})</div>
            <div>${p.model.amount.amount}</div>
          </li>
          <li>
            <div>Quantity</div>
            <div>${p.model.quantity}</div>
          </li>
          <li>
            <div>Price</div>
            <div>${p.Currency.format(p.model.price)}</div>
          </li>
        </ul>
      </div>
    </div>    
  </div>`
};