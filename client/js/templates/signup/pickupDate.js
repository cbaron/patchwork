module.exports = p =>
`<div data-js="container" class="pickup-date ${p.selected ? 'selected' : ''} ${p.unselectable ? 'unselectable' : ''}">
    <div>${p.dayOfWeek}</div>
    <div>${p.month}</div>
    <div>${p.dayOfMonth}</div>
</div>`