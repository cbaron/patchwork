module.exports = p => {
    const heading = p.isAdmin ? 'All Seasons' : 'Your Orders',
        instructions = p.isAdmin ? `` : `<p>Select a share to view your order details. If the share is still current, you may change its options. We will bill or refund you based on the price adjustment.</p>`

return `` +
`<div class="fd-hidden section">
    <div class="section-heading">
        <h3>${heading}</h3>
        ${instructions}
    </div>
    <div class="table">
        <ol class="table-row" data-js="list"></ol>
    </div>
</div>`
}
