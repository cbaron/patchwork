module.exports = p => {
    const sizeOptions = p.sizeOptions.map( option => `<div>${option.label} Size</div>` ).join(''),
          rows = p.deliveryOptions.map( deliveryOption =>
              `<div>` +
                  `<div>${deliveryOption.label}</div>` +
                  p.sizeOptions.map( sizeOption => {
                      const price = ( parseFloat(sizeOption.price.replace('$','')) + parseFloat(deliveryOption.price.replace('$','')) ).toFixed(2)
                      return `<div>$${price} / box</div>` } ).join('') +
              `</div>`
          ).join('')
    return `<div>
        <div>Delivery Options</div>
        ${sizeOptions}
        ${rows}
    </div>`
}
