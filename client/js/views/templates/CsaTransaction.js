module.exports = ( p, format ) => {
    const negativeClass = p.isNegative ? 'negative' : ''

return `` +
`<li data-js="transaction" data-id="${p.id}">
    <span data-attr="action" class="cell">${p.action}</span>
    <span data-attr="value" class="cell ${negativeClass}">${format.currency(Math.abs(p.value))}</span>
    <span data-attr="checkNumber" class="cell">${p.checkNumber || ''}</span>
    <span data-attr="initiator" class="cell">${p.initiator}</span>
    <span data-attr="created" class="cell">${format.moment(p.created).format('MMM D, YYYY')}</span>
    <span data-attr="description" class="cell">${p.description}</span>
</li>`
}
