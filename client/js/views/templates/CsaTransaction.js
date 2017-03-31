module.exports = ( p, format ) => {
    const negativeClass = p.isNegative ? 'negative' : ''

return `` +
`<li data-js="transaction" data-id="${p.id}">
    ${require('./lib/error')}
    <span class="cell">${p.action}</span>
    <span class="cell ${negativeClass}">${format(p.value)}</span>
    <span class="cell">${p.checkNumber || ''}</span>
    <span class="cell">${p.description}</span>
</li>`
}
