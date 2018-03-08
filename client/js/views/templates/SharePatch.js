module.exports = p => {
    const heading = p.isAdmin ? `Adjust Member Share Options` : `Summary of Share Option Updates`

return `` +
`<div class="fd-hidden">
    <div class="section-heading">
        <h3>${heading}</h3>
    </div>
    <div class="content">
        <div>
            <ul>
                <li class="line-item">
                    <span>Share Change</span>
                    <span>Price Adjustment</span>
                </li>
                <li class="line-item">
                    <span>Weeks Removed: </span>
                    <span data-js="weeksRemoved"></span>
                    <span class="adjustment">
                        <span class="is-negative" data-js="weeksRemovedPrice"></span>
                    </span>
                </li>
                <li class="line-item">
                    <span>Weeks Added: </span>
                    <span data-js="weeksAdded"></span>
                    <span data-js="addedAdjustment" class="adjustment">
                        <span data-js="weeksAddedPrice"></span>
                    </span>
                </li>
                <li data-js="options" class="line-item options fd-hidden">
                    <div>
                        <div>Options Update:</div>
                        <ul data-js="shareOptionDescription"></ul>
                    </div>
                    <div>
                        <span>Weekly price adjustment: </span>
                        <span data-js="weeklyAdjustment"></span>
                    </div>
                    <div>
                        <span>Weeks affected: </span>
                        <span data-js="weeksAffected"></span>
                        <span class="adjustment">
                            <span data-js="optionsAdjustment"></span>
                        </span>
                    </div>
                </li>
                <li>
                    <span>Total Adjustment: </span>
                    <span data-js="adjustment"></span>
                </li>
            </ul>
            <div class="email ${!p.isAdmin ? 'fd-hidden' : ''}">
                <label><input data-js="sendEmail" type="checkbox">Send Email</label>
            </div>
            <div data-view="buttonFlow"></div>
        </div>
    </div>
</div>`
}
