module.exports = p => 
`<div class="fd-hidden section">
    <div class="section-heading">
        <h3>Order Options</h3>
        <span data-js="seasonLabel"></span>
        <button class="reset-btn fd-hidden" data-js="resetBtn">Reset</button>
    </div>
    <div class="content">
        <div class="data">
            <ol data-js="options"></ol>
        </div>
        <div data-js="editSummary" class="edit-summary fd-hidden">
            <div>Summary of Changes</div>
            <div data-js="changes"></div>
            <div>
                <span>Weekly price adjustment: </span>
                <span class="original-price" data-js="originalWeeklyPrice"></span>
                <span>to</span>
                <span class="new-price" data-js="newWeeklyPrice"></span>
            </div>
        </div>
    </div>
    <div data-js="seasonalItems" class="fd-hidden seasonal-items">
        <h3>Seasonal Items Purchased</h3>
        <div data-js="seasonalItemsList"></div>
    </div>
</div>`
