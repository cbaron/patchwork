module.exports = ( p, { Moment } ) => {
    const actions = p.opts.actions.map( action => `<option value="${action}">${action}</option>` ).join('')

return `` +
`<div class="fd-hide fd-hidden">
    <div class="heading">
        <h3>Transactions</h3>
        <span>Value</span>
        <span>Check #</span>
        <span>Date</span>
        <span>Description</span>
    </div>
    <ol data-js="transactions"></ol>
    <div class="add hidden" data-js="addTransactionRow">
        <select data-js="action">${actions}</select>
        <input type="text" data-js="value" />
        <input type="text" data-js="checkNumber" />
        <input type="text" data-js="created" value="${Moment().format('YYYY-MM-DD')}" />
        <input type="text" data-js="description" />
    </div>
    <div class="buttons">
        <div data-view="buttonFlow" data-name="addTransactionButtons"></div>
    </div>
    <div class="balance">
        <h3>Balance</h3>
        <span data-js="balance"></span>
        <span></span>
        <span>
            <div data-view="buttonFlow" data-name="emailButtons"></div>
        </span>
    </div>
</div>`
}
