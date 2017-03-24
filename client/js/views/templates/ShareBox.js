module.exports = p =>
`<div data-id="${p.id}" class="share-label">
    <div>${p.label}</div>
    <div>
        <span>${p.humanStartdate}</span>
        <span>-</span>
        <span>${p.humanEnddate}</span>
    </div>
    <div>${p.duration} weeks</div>
</div>`
