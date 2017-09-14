module.exports = p => {
    const name = p.venue ? `<div>${p.name} - ${p.venue}</div>` : `<div>${p.name}</div>`

return `` +
`<div data-js="container" class="dropoff col-sm-9">
    ${name}
    <div>${p.street}</div>
    <div>${p.dayOfWeek} : ${p.starttime} - ${p.endtime}</div>
</div>`
}