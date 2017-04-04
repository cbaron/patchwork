module.exports = p => 
`<div class="fd-hide fd-hidden section">
    <div class="section-heading">
        <h3>Order Options</h3>
        <span data-js="seasonLabel"></span>
        <button class="reset-btn hidden" data-js="resetBtn">Reset</button>
    </div>
    <div class="content">
        <div class="data">
            <ol data-js="options"></ol>
        </div>
        <div data-js="editSummary" class="edit-summary hidden">
            <div>Summary of Changes</div>
            <div data-js="changes"></div>
        </div>
    </div>
</div>`
