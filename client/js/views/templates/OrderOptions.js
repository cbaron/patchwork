module.exports = p => 
`<div class="fd-hide fd-hidden">
    <div>
        <h3>Order Options</h3>
        <button class="reset-btn hidden" data-js="resetBtn">Reset</button>
        <div data-js="seasonLabel"></div>
    </div>
    <div class="content">
        <div class="data">
            <ol data-js="options"></ol>
            <button class="review-btn hidden" data-js="reviewBtn">Review Changes</button>
        </div>
        <div data-js="editSummary" class="edit-summary hidden">
            <div>Summary of Changes</div>
            <div data-js="changes"></div>
        </div>
    </div>
</div>`
