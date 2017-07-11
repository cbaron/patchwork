module.exports = p =>
    `<p data-js="homeDeliveryIntro">${p.homedeliveryintro}</p>
    <h3>Patchwork Gardens Home Delivery Range</h3>
    <img src="/file/csainfo/deliveryrange/${p.id}" />
    <p>${p.groupdeliveryintro}</p>
    <ul class="group-deliveries" data-js="groupDeliveryOptions"></ul>
    <div data-js="farmPickupOption"></div>
    <div class="row delivery-matrix" data-js="deliveryMatrix"></div>
    <div class="non-size-options" data-js="nonSizeOptions"></div>
    <h2>Payment</h2>
    <div>${p.payment || ''}</div>`
