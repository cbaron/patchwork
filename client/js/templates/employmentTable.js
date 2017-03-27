module.exports = p => {
    console.log( p )
    const rows = ''

    return `<div class="col-xs-12 col-sm-8 col-sm-offset-2">
        <div class="row">
            <div class="cell col-xs-6">Title</div>
            <div class="cell col-xs-6">Description</div>
        </div>
        ${rows}
    </div>`
}

    /*const tableRows = p.options.map( option => `
        <div class="add-on-row">      
            <div class="add-on-name">${option.prompt}</div>
            <div class="add-on-details">
                <div class="add-on-price">${option.price} per ${option.unit}</div>
                <div class="add-on-paragraph">${option.information}</div>
                <div class="add-on-image">
                    <img src="/file/shareoption/image/${option.shareOptionId}" />
                </div>
            </div>
        </div>`
    ).join('')

    return `` +
        `<h2>Add-Ons</h2>
        <div class="intro">In addition to the vegetables, we offer the following Add-On options to your box:</div>
        <div class="add-on-table">
            ${tableRows}
        </div>
        <div>Feel free to contact us directly if you have any more questions about the Add-On options.</div>`

}

    const colWidth = Math.floor( 12 / ( p.sizeOptions.length + 1 ) )
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