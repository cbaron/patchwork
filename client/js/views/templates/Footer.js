module.exports = p => {
const fields = p.opts.fields.map( field => `<li data-id="${field.name}">${field.label}</li>` ).join('')

return `` +
`<footer data-js="container" class="row">
    <ul data-js="list">
        <li data-id="${p.opts.home.name}">${p.opts.home.footerLabel}</li>
        ${fields}
    </ul>
    <hr>
    <div class="future-days">
        <p>A <a href='mailto:topherbaron@gmail.com'>FutureDays</a> site</p>
    </div>
</footer>`
}
