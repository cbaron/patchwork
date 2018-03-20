module.exports = p => {
    const headers = p.fields.map( field => `<th class="w${field.width}" data-sort="${field.name}">${field.label}</th>` ).join('')

return `` +
`<div data-js="container" class="admin col-sm-10 col-sm-offset-1">
    <div class="sub-heading">Resources</div>
    <div class="row mytable">
        <table data-js="table">
            <thead data-js="header">
                <tr class="clearfix">
                    ${headers}
                </tr>
            </thead>
            <tbody data-js="body"></tbody>
        </table>
    </div>
</div>`
}