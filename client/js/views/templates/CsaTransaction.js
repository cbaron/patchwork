module.exports = p =>
`<li data-id="${p.id}">
    <span class="cell">${p.action}</span>
    <span class="cell">${p.value}</span>
    <span class="cell">${p.checkNumber}</span>
    <span class="cell">${p.description}</span>
</li>`
