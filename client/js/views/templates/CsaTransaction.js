module.exports = ( p, format ) => {
    const negativeClass = p.isNegative ? 'negative' : ''

return `` +
`<li data-js="transaction" data-id="${p.id}">
    <span class="cell"></span>
    <span class="cell">${p.action}</span>
    <span class="cell ${negativeClass}">${format.currency(Math.abs(p.value))}</span>
    <span class="cell">${p.checkNumber || ''}</span>
    <span class="cell">${format.moment(p.created).format('MMM D, YYYY')}</span>
    <span class="cell">${p.description}</span>
</li>`
}
