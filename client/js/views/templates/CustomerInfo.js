module.exports = p => {

    const rows = p.fields.map( field => {
        const rowValue = field.name === 'neverReceive'
            ? `<div data-js="neverReceive" class="cell"></div>`
            : field.name === 'onPaymentPlan'
                ? `<select data-js="onPaymentPlan" class="cell">
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>`
                : `<div data-name="${field.name}" data-js="${field.name}" class="cell" contenteditable="true"></div>`

        return `` +
        `<div class="table-row">
            <div class="cell">${field.label}</div>
            ${rowValue}
        </div>`
    } ).join('')

    return `` +
    `<div class="fd-hide fd-hidden">
        <h3>Customer Info</h3>
        <button class="reset-btn hidden" data-js="resetBtn">Reset</button>
        <div class="content">
            <div class="customer-table">
                ${rows}
                <button class="review-btn hidden" data-js="reviewBtn">Review Changes</button>
            </div>
            <div data-js="editSummary" class="edit-summary hidden">
                <div>Summary of Changes</div>
                <div data-js="changes"></div>
                <div>
                    <button class="save-btn" data-js="saveBtn">Save Changes</button>
                </div>
            </div>
        </div>
    </div>`
}
