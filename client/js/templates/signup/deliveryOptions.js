module.exports = p =>
`<li data-js="container" class="delivery-options">
    <div>
        <div class="share-label">
            <div>${p.label}</div>
            <div>
                <span>${p.humanStartdate}</span>
                <span>-</span>
                <span>${p.humanEnddate}</span>
            </div>
            <div>${p.duration} weeks</div>
        </div>
        <div>
            <div data-js="options" class="options"></div>
            <div data-js="feedback" class="feedback-messages"></div>
        </div>
    </div>
    <div data-js="dropoffs"></div>
    <div class="error">Please select a valid option.</div>
</li>`