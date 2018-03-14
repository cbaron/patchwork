module.exports = p => {
    const heading = p.opts.isAdmin ? `Adjust Member Share Options` : `Summary of Share Updates`

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
                    <div>
                        <span>Weeks Removed: </span>
                        <span data-js="weeksRemoved"></span>
                    </div>
                    <div class="adjustment" data-js="weeksRemovedPrice"></div>
                </li>
                <li class="line-item">
                    <div>
                        <span>Weeks Added: </span>
                        <span data-js="weeksAdded"></span>
                    </div>
                    <div data-js="weeksAddedPrice" class="adjustment"></div>
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
                        <div>
                            <span>Weeks affected: </span>
                            <span data-js="weeksAffected"></span>
                        </div>
                        <div>
                            <span class="adjustment">
                                <span data-js="optionsAdjustment"></span>
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
            <div data-js="adjustment" class="total"></div>
            <div class="email ${!p.isAdmin ? 'fd-hidden' : ''}">
                <label><input data-js="sendEmail" type="checkbox">Send Email</label>
            </div>
            <div data-view="buttonFlow"></div>
        </div>
    </div>
</div>`
}
