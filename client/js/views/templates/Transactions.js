module.exports = p => {
    const actions = p.opts.actions.map( action => `<option value="${action}">${action}</option>` ).join('')

return `` +
`<div class="fd-hide fd-hidden">
    <div class="heading">
        <h3>Transactions</h3>
        <span>value</span>
        <span>check number</span>
        <span>description</span>
    </div>
    <ol data-js="transactions"></ol>
    <div class="add hidden" data-js="addTransactionRow">
        <select data-js="action">${actions}</select>
        <input type="text" data-js="value" />
        <input type="text" data-js="checkNumber" />
        <input type="text" data-js="description" />
    </div>
    <div class="buttons">
        <button data-js="addBtn">Add Transaction</button>
        <button class="hidden" data-js="cancelBtn">Cancel Transaction</button>
    </div>
    <div class="balance">
        <h3>Balance</h3>
        <span data-js="balance"></span>
        <span></span>
        <span></span>
    </div>
</div>`
}
