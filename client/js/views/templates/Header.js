module.exports = p => {
    const Format = require('../../Format'),
        fields = p.opts.fields.map( field => `<li data-name="${field.name}">${field.label}</li>` ).join('')

return `` +
`<div class="row">
    <div><img data-src="${Format.ImageSrc( 'red-sun.jpg' )}" /></div>
    <div>
        <div><span data-js="title" data-name="${p.opts.home.name}">${p.opts.home.label}</span></div>
        <ul data-js="nav">
            <li data-name="${p.opts.home.name}">${p.opts.home.label}</li>
            ${fields}
        </ul>
    </div>
    <div>
</div>`
}
