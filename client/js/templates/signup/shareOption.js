module.exports = p => {
    const options = p.options.map( option => `<option value="${option.id}">${option.label}</option>` ).join(''),
        description = p.description ? `<span data-js="optionIcon" class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>` : ``

return `` +
`<div data-js="container" class="share-option">
    <div class="option-title">
        <div>
            <span>${p.prompt}</span>
            ${description}
       </div>
        <div>
            <select data-js="input" class="form-control">
                ${options}
            </select>    
        </div>
    </div>
    <div class="total">
        <div data-js="total"></div>
    </div>
</div>`
}