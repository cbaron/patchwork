module.exports = p =>
    `<p>${p.homedeliveryintro}</p>
    <h3>Patchwork Gardens Home Delivery Range</h3>
    <img src="/file/csadeliveryinfo/deliveryrange/${p.id}" />
    <p>${p.groupdeliveryintro}</p>
    <div data-js="groupDeliveryOptions"></div>
    <div>
        <span>On-Farm pick-up</span>
        <span> - 41 N. Lutheran Church Rd., Dayton, OH 45417 - </span>
        <span data-js="farmPickupTime">Thurs. 3:00 - 7:00pm</span>
        <span>(Discount this option:</span>
        <span data-js="discount"></span>
        <span>)</span>
    </div>`
