module.exports = p => 
`<div class="fd-hide fd-hidden">
    <div class="section-heading">
        <h3>Adjust Member Share Options</h3>
    </div>
    <div class="content">
        <ul>
            <li class="clearfix line-item">
                <span>Weeks Removed: </span>
                <span data-js="weeksRemoved"></span>
                <span class="adjustment">
                    <span> Adjustment : </span>
                    <span class="is-negative" data-js="weeksRemovedPrice"></span>
                </span>
            </li>
            <li>
                <span>Weeks Added: </span>
                <span data-js="weeksAdded"></span>
                <span class="fd-hidden" data-js="weeksAddedPrice"></span>
            </li>
            <li data-js="options">
                <div>
                    <span>Options Update : </span>
                    <span data-js="shareOptionDescription"></span>
                </div>
                <div>
                    <span>Weekly price adjustment: </span>
                    <span class="original-price" data-js="originalWeeklyPrice"></span>
                    <span>to</span>
                    <span class="new-price" data-js="newWeeklyPrice"></span>
                </div>
                <div>
                    <span>Weeks affected: </span>
                    <span data-js="weeksAffected"></span>
                </div>
            <li>
                <span>Total Adjustment: </span>
                <span data-js="adjustment"></span>
            </li>
            <button class="save-btn" data-js="saveBtn">Save Changes</button>
        </ul>
    </div>
</div>`
