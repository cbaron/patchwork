const Format = require('../../Format')

module.exports = p =>
`<div class="item-detail">
    <div>
        <span>${p.heading || p.name}</span>
        <span>|</span>
        <span>${p.price}</span>
    </div>
    <p>${Format.ParseTextLinks( p.description )}</p>
</div>`