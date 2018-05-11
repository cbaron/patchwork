module.exports = p =>
`<li class="delivery-option" data-id="${p.id}" data-js="container">
    <div>${p.label}</div>
    <div data-js="deliveryPrice"></div>
</li>`