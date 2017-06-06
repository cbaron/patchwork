module.exports = p =>
`<section>
    <h4>Reporting</h4>
    <form>
        <div>
            <label>Name:</label>
            <select data-js="report"></select>
        </div>
        <div>
            <label>From:</label>
            <input type="text" data-js="from" />
        </div>
        <div>
            <label>To:</label>
            <input type="text" data-js="to" />
        </div>
        <div>
            <button type="button" data-js="viewBtn" class="link">View</button>
            <button type="button" data-js="exportBtn" class="link">Export</button>
        </div>
    </form>
    <div class="results" data-js="results">
        <h4 class="fd-hide" data-js="empty">No results</h4>
        <ol class="columns" data-js="columns"></ol>
        <div class="rows" data-js="rows"></div>
    </div>
</section>`
