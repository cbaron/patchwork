module.exports = p => {
    const dataId = p.membershareid ? `data-id="${p.membershareid}"` : ``

    return `` +
    `<div ${dataId}" class="share-label">
        <div>${p.label}</div>
        <div>
            <span>${p.humanStartdate}</span>
            <span>-</span>
            <span>${p.humanEnddate}</span>
        </div>
        <div>${p.duration} weeks</div>
    </div>`
}
