module.exports = p => {
    const website = p.url ? `<a target="_blank" href="${p.url}">Website</a>` : ``,
        directions = p.street && p.cityStateZip ? `<a target="_blank" href="http://maps.google.com/?q=${p.street}, ${p.cityStateZip}">Directions</a>` : ``

return `` +
`<div class="info-window">
    <div>${p.name}</div>
    <div>
        <div>${p.street || ''}</div>
        <div>${p.cityStateZip || ''}</div>
        <div>${p.phonenumber || ''}</div>
    </div>
    <div>
        <div>${directions}</div>
        <div>${website}</div>
    </div>
</div>`

}