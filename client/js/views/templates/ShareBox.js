module.exports = p => {
    const dataId = p.membershareid ? `data-id="${p.membershareid}"` : ``,
          count = p.count ? `<span>(${p.count})</span>` : ``

    return `` +
    `<div ${dataId}" class="share-label">
        <div><span>${p.label}</span> ${count}</div>
        <div>
            <span>${p.humanStartdate}</span>
            <span>-</span>
            <span>${p.humanEnddate}</span>
        </div>
        <div>${p.duration} weeks</div>
    </div>`
}
