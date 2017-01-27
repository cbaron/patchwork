module.exports = p =>
    `<p>${p.homedeliveryintro}</p>
    <h3>Patchwork Gardens Home Delivery Range</h3>
    <img src="/file/csadeliveryinfo/deliveryrange/${p.id}" />
    <p>${p.groupdeliveryintro}</p>
    <div data-js="groupDeliveryOptions"></div>
    <div>
        <span>On-Farm pick-up</span>
        <div data-js="farmPickupOption"></div>
    </div>`
