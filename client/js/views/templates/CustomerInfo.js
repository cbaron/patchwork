module.exports = p => {
    const rows = p.fields.map( field =>
        `<div class="table-row">
            <div class="cell">${field.label}</div>
            <div data-js="${field.name}" class="cell" contenteditable="true"></div>
        </div>`
    ).join('')

    return `` +
    `<div class="fd-hide fd-hidden">
        <h3>Customer Info</h3>
        <div class="customer-info-table">${rows}</div>
    </div>`
}
