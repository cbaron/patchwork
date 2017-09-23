module.exports = p => {
    const fields = p.fields.map( field =>
        `<div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <div>
                <input type="${field.type}" class="form-control" id="${field.name}" data-js="${field.name}">
                <span class="glyphicon form-control-feedback hide" aria-hidden="true"></span>
            </div>
        </div>`
    ).join('')

return `` +
`<div class="MemberInfo" data-js="container">
    <p>Please provide us with some information about yourself</p>
    <form>
        ${fields}
        <div style="display: none;"><input type="text" id="PreventChromeAutocomplete" name="PreventChromeAutocomplete" autocomplete="address-level4" /></div>
    </form>
</div>`
}
