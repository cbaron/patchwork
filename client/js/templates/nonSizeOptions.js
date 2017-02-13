module.exports = p => {

    const tableRows = p.options.map( option => `
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