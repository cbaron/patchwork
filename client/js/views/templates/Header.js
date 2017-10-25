module.exports = ( { opts, ImageSrc } ) => {
    const fields = opts.fields.map( field => `<li data-name="${field.name}">${field.label}</li>` ).join('')

return `` +
`<div class="row">
    <div>
        <img data-src="${ImageSrc('header_sun')}" />
    </div>
    <div>
        <div>
            ${require('./lib/justify')}
            <div data-js="title" data-name="${opts.home.name}">${opts.home.label}</div>
        </div>
        <ul data-js="nav">${fields}</ul>
    </div>
    <div>
</div>`
}