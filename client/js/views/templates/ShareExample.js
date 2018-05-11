const Format = require('../../Format')

module.exports = p =>
`<div>
    <h4>${p.heading}</h4>
    <div><img data-src="${Format.ImageSrc( p.image )}" /></div>
    <div>${p.listHeading}</div>
    <ul>${Format.GetListItems( p.sampleList )}</ul>
</div>`