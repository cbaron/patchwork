module.exports = p => {
    const actions = p.actions.map( action => {
        const selected = action === p.action ? `selected="selected"`: ``
        return `<option value="${action}" ${selected}>${action}</option>`
    } ).join('')
    return `` +
`<li data-js="editTransaction" class="edit-transaction">
    <span></span>
    <select data-attr="action">${actions}</select>
    <input type="text" data-attr="value" value="${p.value}"/>
    <input type="text" data-attr="checkNumber" value="${p.checkNumber || ''}"/>
    <input type="text" data-attr="created" value="${p.created || ''}" />
    <input type="text" data-attr="description" value="${p.description || ''}"/>
</li>`
}
