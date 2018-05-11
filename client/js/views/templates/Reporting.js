module.exports = p =>
`<section>
    <h4>Reporting</h4>
    <form>
        <div>
            <div>
                <label>Name:</label>
                <select data-js="report"></select>
            </div>
            <div>
                <label>Select Date By:</label>
                <select data-js="dateTypeSelect">
                    <option value="custom">Custom Range</option>
                    <option value="year">Year</option>
                    <option value="season">Season</option>
                </select>
            </div>
        </div>
        <div>
            <div data-js="custom">
                <div>
                    <label>From:</label>
                    <input type="text" data-js="from" />
                </div>
                <div>
                    <label>To:</label>
                    <input type="text" data-js="to" />
                </div>
            </div>
            <div class="fd-hidden">
                <label>Choose Year:</label>
                <select data-js="year"></select>
            </div>
            <div class="fd-hidden">
                <label>Choose Season:</label>
                <select data-js="season"></select>
            </div>
        </div>
        <div>
            <button type="button" data-js="viewBtn" class="btn-yellow">View</button>
            <button type="button" data-js="exportBtn" class="btn-yellow">Export</button>
        </div>
    </form>
    <div class="results" data-js="results">
        <h4 class="fd-hidden" data-js="empty">No results</h4>
        <ol class="columns" data-js="columns"></ol>
        <div class="rows" data-js="rows"></div>
    </div>
</section>`
