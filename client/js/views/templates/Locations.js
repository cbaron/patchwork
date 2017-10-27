module.exports = p => {
    const categories = p.opts.categories.map( attr =>
        `<li>
            <label>
                <input data-name="${attr.name}" type="checkbox" checked />
                <span></span>
                <span class="${attr.name}">${attr.label}</span>
            </label>
        </li>`
    ).join('')

return `` +
`<div>
    <h1>Locations</h1>
    <div>
        <div class="map-wrap">
            <div data-js="map"></div>
            <ul class="legend" data-js="legend">
                ${categories}
            </ul>
        </div>
    </div>
    <section>
        <p data-js="intro"></p>
    </section>
    <section data-js="farmersMarkets" class="striped">
        <h2></h2>
        <p></p>
        <ul data-js="farmerMarketsList"></ul>
    </section>
    <section data-js="retailOutlets">
        <h2></h2>
        <p></p>
        <ul data-js="retailOutletsList"></ul>
    </section>
    <section data-js="restaurants" class="striped">
        <h2></h2>
        <p></p>
        <ul data-js="restaurantsList"></ul>
    </section>  
    <section data-js="pickupLocations">
        <h2></h2>
        <p></p>
        <ul data-js="groupLocationsList"></ul>
        <div class="button-row">
            <button class="btn-yellow" data-js="signupBtn" type="button">Sign Up Now!</button>
        </div>
    </section>
</div>`
}