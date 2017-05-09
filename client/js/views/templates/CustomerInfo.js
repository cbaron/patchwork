module.exports = p => {

    const rows = p.fields.map( field => {
        const rowValue = field.name === 'neverReceive'
            ? `<div data-js="neverReceive" class="cell"></div>`
            : field.name === 'onpaymentplan'
                ? `<select data-js="onpaymentplan" class="cell">
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>`
                : `<div data-name="${field.name}" data-js="${field.name}" class="cell" contenteditable="true"></div>`

        return `` +
        `<div class="table-row ${field.name}">
            <div class="cell">${field.label}</div>
            ${rowValue}
        </div>`
    } ).join('')

    return `` +
    `<div class="fd-hide fd-hidden section">
        <div class="section-heading">
            <h3>Customer Info</h3>
            <button class="reset-btn fd-hidden" data-js="resetBtn">Reset</button>
        </div>
        <div class="content">
            <div class="data">
                <div data-js="infoTable" class="customer-table">${rows}</div>
            </div>
            <div data-js="editSummary" class="edit-summary fd-hidden">
                <div>Summary of Changes</div>
                <div data-js="changes"></div>
                <div>
                    <button class="save-btn" data-js="saveBtn">Save Changes</button>
                </div>
            </div>
        </div>
    </div>`
}
