module.exports = p => {
    const name = p.url ? `<div><a target="_blank" href="${p.url}">${p.name || ''}</a></div>` : `<div>${p.name || ''}</div>`
    const hours = p.hours ? p.hours.split(',').map( item => `<div>${item}</div>` ).join('') : ``

return `` +
`<li class="location">
    ${name}
    <div>${p.label || ''}</div>
    <div>${p.venue || ''}</div>
    <div>${p.street || ''}</div>
    <div>${p.cityStateZip || ''}</div>
    <div>${p.phonenumber || ''}</div>
    <div><a href="mailto:${p.email}">${p.email || ''}</a></div>
    ${hours}
</li>`
}