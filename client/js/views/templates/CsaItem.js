const Format = require('../../Format')

module.exports = p => {
    const price = p.unit ? `${p.price} per ${p.unit}` : p.price

return `` +
`<div class="item-detail">
    <div>
        <span>${p.heading}</span>
        <span>|</span>
        <span>${price}</span>
    </div>
    <p>${Format.ParseTextLinks( p.information || p.description )}</p>
</div>`
}