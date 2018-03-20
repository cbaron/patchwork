const Format = require('../../Format')

module.exports = p =>
`<div class="bio">
    <div>
        <img data-src="${Format.ImageSrc( p.image )}" />
        <div class="overlay">
            <div>${p.bio || ''}</div>
        </div>
    </div>
    <div>${p.name}</div>
</div>`