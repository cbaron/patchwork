module.exports = p => 
`<div class="fd-hide fd-hidden">
    <div class="section-heading">
        <h3>Week Options</h3>
        <div>
            <span>Delivery Day: </span>
            <span data-js="deliveryDay"></span>
        </div>
        <button class="reset-btn hidden" data-js="resetBtn">Reset</button>
    </div>
    <div class="content">
        <div class="data">
            <ol data-js="dates"></ol>
        </div>
        <div data-js="editSummary" class="edit-summary hidden">
            <div>Summary of Changes</div>
            <div data-js="changes">
                <div class="column">
                    <div>Added Dates</div>
                    <ol data-js="selectedDates" class="added-dates"></ol>
                </div>
                <div class="column">
                    <div>Removed Dates</div>
                    <ol data-js="removedDates" class="removed-dates"></ol>
                </div>
            </div>
        </div>
    </div>
</div>`
