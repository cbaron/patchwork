module.exports = p =>
`<div data-js="container" class="dropoff">
    <div>${p.label}</div>
    <div>${p.venue || ''}</div>
    <div>${p.street}</div>
    <div>${p.cityStateZip}</div>
    <div>${p.dayOfWeek} : ${p.starttime} - ${p.endtime}</div>
</div>`