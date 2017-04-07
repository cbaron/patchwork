module.exports = p => 
`<div class="fd-hide fd-hidden">
    <div class="section-heading">
        <h3>Adjust Member Share Options</h3>
    </div>
    <div class="content">
        <div>
            <div>
                <span>Weeks Removed:"></span>
                <span data-js="weeksRemoved"></span>
                <span> -> </span>
                <span data-js="weeksRemovedPrice"></span>
            </div>
            <div>
                <span>Weeks Added: </span>
                <span data-js="weeksAdded"></span>
            </div>
            <div data-js="options">
                <span data-js="shareOptionDescription"></span>
                <span>Weekly price adjustment: </span>
                <span class="original-price" data-js="originalWeeklyPrice"></span>
                <span>to</span>
                <span class="new-price" data-js="newWeeklyPrice"></span>
            </div>
            <div data-js="affected">
                <span>Weeks affected: </span>
                <span data-js="weeksAffected"></span>
            </div>
            <div>
                <span>Total Adjustment: </span>
                <span data-js="adjustment"></span>
            </div>
            <button class="save-btn" data-js="saveBtn">Save Changes</button>
        </div>
    </div>
</div>`
