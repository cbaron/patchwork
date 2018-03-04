module.exports = p =>
`<li data-js="container">
    <div class="single-share">
        <div data-js="shareBox"></div>
        <div>
            <h4>Weekly Options</h4>
            <div data-js="options"></div>
        </div>
        <div data-js="seasonalContainer">
            <h4>Seasonal Options</h4>
            <div data-js="seasonalOptions"></div>
        </div>
    </div>
    <div>
        <div><span>Weekly Options Total: </span><span data-js="weeklyTotal"></span></div>
        <div><span>Seasonal Options Total: </span><span data-js="seasonalTotal"></span></div>
    </div>
</li>`