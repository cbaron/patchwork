module.exports = p => {
    const price = p.price === '$0.00' ? `No charge` : `${p.price} per week`

return `` +
`<div data-js="container" class="dropoff">
    <div>${p.label}</div>
    <div>${p.venue || ''}</div>
    <div>${p.street}</div>
    <div>${p.cityStateZip}</div>
    <div>${p.dayOfWeek} : ${p.starttime} - ${p.endtime}</div>
    <div>${price}</div>
</div>`
}