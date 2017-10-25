module.exports = p =>
`<li class="delivery-option" data-id="${p.id}" data-js="container">
    <div>${p.label}</div>
    <div data-js="deliveryPrice">${p.price} / week</span></div>
</li>`