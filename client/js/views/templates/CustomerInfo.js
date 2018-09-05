module.exports = p => {
    const heading = p.isAdmin ? 'Customer Info' : 'Your Account Info'
    const rows = p.fields.map( field => {
        const rowValue = field.name === 'neverReceive'
            ? `<div data-js="neverReceive" class="cell"></div>`
            : field.type === 'select'
                ? `<select data-name="${field.name}" data-js="${field.name}" class="cell">
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
    `<div class="fd-hidden section">
        <div class="section-heading">
            <h3>${heading}</h3>
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
                    <button class="save-btn" data-js="saveBtn">Update Account</button>
                </div>
            </div>
        </div>
    </div>`
}
