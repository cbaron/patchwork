module.exports = ( p, { Moment } ) => {
    const actions = p.opts.actions.map( action => `<option value="${action}">${action}</option>` ).join('')
    return `` +
`<div>
    <form data-js="form">
        <select data-js="action">${actions}</select>
        <input type="text" data-js="value" placeholder="$0.00"/>
        <input type="text" data-js="checkNumber"/>
        <input type="text" data-js="initiator" value="admin" readonly/>
        <input type="text" data-js="created" value="${Moment().format('MMM D, YYYY')}" />
        <input type="text" data-js="description" placeholder="description"/>
    </form>
    <div data-view="buttonFlow"></div>
</div>`
}
