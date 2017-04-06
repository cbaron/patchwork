module.exports = p =>
`<div class="fd-hide fd-hidden section">
    <div class="heading">
        <span></span>
        <h3>Transactions</h3>
        <span>Value</span>
        <span>Check #</span>
        <span>Date</span>
        <span>Description</span>
    </div>
    <ol data-js="transactions"></ol>
    <div data-view="buttonFlow" data-name="editButtons"></div>
    <div data-view="addTransaction"></div>
    <div class="balance">
        <h3>Balance</h3>
        <span data-js="balance"></span>
        <span></span>
        <span>
            <div data-view="buttonFlow" data-name="emailButtons"></div>
        </span>
    </div>
</div>`
