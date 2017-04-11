module.exports = p => 
`<div class="fd-hide fd-hidden">
    <div class="section-heading">
        <h3>Adjust Member Share Options</h3>
    </div>
    <div class="content">
        <div>
            <ul>
                <li class="clearfix line-item">
                    <span>Weeks Removed: </span>
                    <span data-js="weeksRemoved"></span>
                    <span class="adjustment">
                        <span>Adjustment: </span>
                        <span class="is-negative" data-js="weeksRemovedPrice"></span>
                    </span>
                </li>
                <li data-js="added">
                    <span>Weeks Added: </span>
                    <span data-js="weeksAdded"></span>
                    <span data-js="addedAdjustment" class="adjustment fd-hidden">
                        <span>Adjustment: </span>
                        <span data-js="weeksAddedPrice"></span>
                    </span>
                </li>
                <li data-js="options" class="line-item fd-hidden">
                    <div>
                        <span>Options Update: </span>
                        <span data-js="shareOptionDescription"></span>
                    </div>
                    <div>
                        <span>Weekly price adjustment: </span>
                        <span data-js="weeklyAdjustment"></span>
                    </div>
                    <div>
                        <span>Weeks affected: </span>
                        <span data-js="weeksAffected"></span>
                        <span class="adjustment">
                            <span> Adjustment: </span>
                            <span data-js="optionsAdjustment"></span>
                        </span>
                    </div>
                <li>
                    <span>Total Adjustment: </span>
                    <span data-js="adjustment"></span>
                </li>
            </ul>
            <div data-view="buttonFlow"></div>
        </div>
    </div>
</div>`
