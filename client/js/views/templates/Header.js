module.exports = ( { opts, ImageSrc } ) => {
    const fields = opts.fields.map( field => `<li data-name="${field.name}">${field.label}</li>` ).join('')

return `` +
`<div class="row">
    <div>
        <img data-src="${ImageSrc( 'red-sun.jpg' )}" />
    </div>
    <div>
        <div>
            ${require('./lib/justify')}
            <span data-js="title" data-name="${opts.home.name}">${opts.home.label}</span>
        </div>
        <ul data-js="nav">
            ${fields}
        </ul>
    </div>
    <div>
</div>`
}
