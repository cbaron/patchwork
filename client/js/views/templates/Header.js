module.exports = p => {
    const fields = p.opts.fields.map( field => `<li data-name="${field.name}">${field.label}</li>` ).join('')

return `` +
`<div class="row">
    <div>
        <img data-src="${p.ImageSrc( 'red-sun.jpg' )}" />
    </div>
    <div>
        <div>
            ${require('./lib/justify')}
            <span data-js="title" data-name="${p.opts.home.name}">${p.opts.home.label}</span>
        </div>
        <ul data-js="nav">
            ${fields}
        </ul>
    </div>
    <div>
</div>`
}
