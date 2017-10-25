module.exports = p =>
`<li data-js="container" class="share-dates">
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
        <div data-js="dates"></div>
    </div>
    <div class="error">Please select at least one date to receive a share.</div>
</li>`