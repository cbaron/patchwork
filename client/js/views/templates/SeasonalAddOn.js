module.exports = p => {
    const options = p.options.map( option => `<option value="${option.id}">${option.label}</option>` ).join(''),
        description = p.description ? `<span data-js="${p.name}Icon" class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>` : ``

return `` +
`<div class="share-option">
    <div class="option-title">
        <div>
            <span>${p.label}</span>
            ${description}
       </div>
        <div>
            <select data-js="${p.name}" class="form-control">
                <option selected value="">None</option>
                ${options}
            </select>    
        </div>
    </div>
    <div class="total">
        <div data-js="${p.name}Total"></div>
    </div>
</div>`
}