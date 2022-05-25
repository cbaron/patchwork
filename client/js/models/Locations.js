module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: [
        { name: 'farmerMarket', el: 'farmerMarketsList', label: "Farmer's Market", color: '#ed1c24' },
        { name: 'retailOutlet', el: 'retailOutletsList', label: 'Retail Outlet', color: '#ffdd14' },
        { name: 'restaurant', el: 'restaurantsList', label: 'Restaurant', color: '#231f20' },
        { name: 'groupLocation', el: 'groupLocationsList', label: 'Group Location', color: '#f8941e' },
        { name: 'deliveryRange', label: 'Delivery Range', color: '#ed1c24' },
        { name: 'farmPickup', el: 'groupLocationsList', label: 'Patchwork Gardens'}
    ],

    data: {
        deliveryRangeCoords: [
            { lat: 40.050819, lng: -84.415036 },
            { lat: 40.052451, lng: -84.131934 },
            { lat: 39.950290, lng: -84.021203 },
            { lat: 39.955089, lng: -83.746882 },
            { lat: 39.736703, lng: -83.802856 },
            { lat: 39.524257, lng: -84.088678 },
            { lat: 39.558610, lng: -84.304644 },
            { lat: 39.617890, lng: -84.365931 },
            { lat: 39.836353, lng: -84.428133 },
        ]
    }

} )