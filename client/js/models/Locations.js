module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: [
        { name: 'farmerMarket', el: 'farmerMarkets', label: "Farmer's Market", color: '#ed1c24' },
        { name: 'retailOutlet', el: 'retailOutlets', label: 'Retail Outlet', color: '#ffdd14' },
        { name: 'restaurant', el: 'restaurants', label: 'Restaurant', color: '#231f20' },
        { name: 'groupLocation', el: 'groupLocations', label: 'Group Location', color: '#f8941e' },
        { name: 'deliveryRange', label: 'Delivery Range', color: '#ed1c24' },
        { name: 'farmPickup', el: 'groupLocations', label: 'Patchwork Gardens'}
    ],

    data: {
        deliveryRangeCoords: [
            { lat: 39.871435, lng: -84.367880 },
            { lat: 39.901132, lng: -84.097279 },
            { lat: 39.926834, lng: -83.806420 },
            { lat: 39.813106, lng: -83.815755 },
            { lat: 39.726784, lng: -83.788941 },
            { lat: 39.615032, lng: -84.008702 },           
            { lat: 39.526260, lng: -84.088909 },
            { lat: 39.542528, lng: -84.293660 },
            { lat: 39.601278, lng: -84.369877 }
        ]
    }

} )