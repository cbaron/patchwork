module.exports = ( { opts, ImageSrc } ) => {
    const fields = opts.fields.map( field => `<li data-name="${field.name}">${field.label}</li>` ).join('')

return `` +
`<div>
    <div>
        <img data-src="${ImageSrc('header_sun')}" />
    </div>
    <div data-js="nav" class="fd-hidden">
        <div>
            ${require('./lib/justify')}
            <div><span data-js="title" data-name="${opts.home.name}">${opts.home.label}</span></div>
        </div>
        <ul data-js="navLinks">${fields}</ul>
    </div>
    <div>
</div>`
}