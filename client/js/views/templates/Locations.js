module.exports = p =>
`<div>
    <h1>Locations</h1>
    <section>
        <div class="map-wrap">
            <div data-js="map"></div>
            <div class="legend" data-js="legend">
                <div class="farmer-market">Farmer's Market</div>
                <div class="retail-outlet">Retail Outlet</div>
                <div class="restaurant">Restaurant</div>
                <div class="group-location">Group Location</div>
                <div class="delivery-range">Delivery Range</div>
            </div>
        </div>
        <p>Patchwork Gardens has a truly local presence, and chances are our veggies are closer than you think. Use the interactive map above or read below to find locations where we sell and distribute our chemical-free produce.</p>
    </section>
    <section>
        <h2>Farmer's Markets</h2>
        <p>For the past 7 years, PWG has been attending Yellow Springs Saturday market, where we've had the good fortune to form friendships and positive relationships with many customers. We are pleased to be a reliable source of fresh, healthy food for those who prefer to purchase through the weekly market. Come out and say hello!</p>
        <ul data-js="farmerMarkets"></ul>
    </section>
    <section>
        <h2>Retail Outlets</h2>
        <p>We currently partner with two retail outlets in order to provide produce to an expanded customer base, and to complement the goods and services being provided by other businesses. You can buy our produce on a weekly basis at the following outlets:</p>
        <ul data-js="retailOutlets"></ul>
    </section>
    <section>
        <h2>Restaurants</h2>
        <p>We are proud to supply our region’s restaurants with healthy, locally grown, and seasonal produce. PWG sells to restaurants whose owners, chefs, and cooks value using local, chemical-free ingredients. We strive to offer an abundance and wide variety of high-quality vegetables and fruits to our buyers all year long.</p>
        <p>The following list of restaurants cook with PWG produce:</p>
        <ul data-js="restaurants"></ul>
    </section>  
    <section>
        <h2>Group Pick-Up Locations</h2>
        <p>Group Locations are shown below. There is no additional fee for this service.</p>
        <ul data-js="groupPickup"></ul>
        <div class="button-row">
            <button data-js="signupBtn" type="button">Sign Up Now!</button>
        </div>
    </section>
</div>`