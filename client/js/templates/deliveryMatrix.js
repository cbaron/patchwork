module.exports = p => {
    const sizeOptions = p.sizeOptions.map( option => `<div class="cell">${option.label} Size</div>` ).join(''),
          rows = p.deliveryOptions.map( deliveryOption =>
              `<div class="">` +
                  `<div class="cell">${deliveryOption.label}</div>` +
                  p.sizeOptions.map( sizeOption => {
                      const price = ( parseFloat(sizeOption.price.replace('$','')) + parseFloat(deliveryOption.price.replace('$','')) ).toFixed(2)
                      return `<div class="cell">$${price} / box</div>` } ).join('') +
              `</div>`
          ).join('')

return `<div>`

}

/*    const colWidth = Math.floor( 12 / ( p.sizeOptions.length + 1 ) )
    const sizeOptions = p.sizeOptions.map( option => `<div class="cell col-xs-${colWidth}">${option.label} Size</div>` ).join(''),
          rows = p.deliveryOptions.map( deliveryOption =>
              `<div class="row">` +
                  `<div class="cell col-xs-${colWidth}">${deliveryOption.label}</div>` +
                  p.sizeOptions.map( sizeOption => {
                      const price = ( parseFloat(sizeOption.price.replace('$','')) + parseFloat(deliveryOption.price.replace('$','')) ).toFixed(2)
                      return `<div class="cell col-xs-${colWidth}">$${price} / box</div>` } ).join('') +
              `</div>`
          ).join('')
    return `<div class="col-xs-12 col-sm-8 col-sm-offset-2">
        <div class="row">
            <div class="cell col-xs-${colWidth}">Delivery Options</div>
            ${sizeOptions}
        </div>
        ${rows}
    </div>`
}*/
