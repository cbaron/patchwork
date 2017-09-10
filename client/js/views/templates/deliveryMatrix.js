module.exports = p => {
    const sizeOptions = p.sizeOptions.map( option => `<div class="cell">${option.label} Share</div>` ).join(''),
        rows = p.deliveryOptions.map( deliveryOption =>
            `<div>` +
                `<div class="cell">${deliveryOption.label}</div>` +
                p.sizeOptions.map( sizeOption => {
                    const price = ( parseFloat(sizeOption.price.replace('$','')) + parseFloat(deliveryOption.price.replace('$','')) ).toFixed(2)
                    return `<div class="cell">$${price} / box</div>`
                } ).join('') +
            `</div>`
        ).join('')

return `` +
`<div>
    <div>
        <div class="cell">Delivery Option</div>
        ${sizeOptions}
    </div>
    ${rows}
</div>`

}
