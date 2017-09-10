module.exports = p => {
    const name = p.name ? `<div>${p.name}</div>` : ``,
        street = p.street ? `<div>${p.street}</div>` : ``,
        cityStateZip = p.citystatezip ? `<div>${p.citystatezip}</div>` : ``,
        phone = p.phonenumber ? `<div>${p.phonenumber}</div>` : ``,
        email = p.email ? `<div><a href="mailto:${p.email}">${p.email}</a></div>` : ``,
        hours = p.hours ? `<div>Hours: ${p.hours}</div>` : ``

return `` +
`<div>
    ${name}
    ${street}
    ${cityStateZip}
    ${phone}
    ${email}
    ${hours}
</div>`
}