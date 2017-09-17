module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: [
        { name: 'farmerMarket', klass: 'farmer-market', label: "Farmer's Market" },
        { name: 'retailOutlet', klass: 'retail-outlet', label: 'Retail Outlet' },
        { name: 'restaurant', klass: 'restaurant', label: 'Restaurant' },
        { name: 'groupLocation', klass: 'group-location', label: 'Group Location' },
        { name: 'deliveryRange', klass: 'delivery-range', label: 'Delivery Range' }
    ],

    data: {
        deliveryRangeCoords: [
            { lat: 39.704862, lng: -84.061294 },
            { lat: 39.782949, lng: -84.070065 },
            { lat: 39.789851, lng: -84.156621 },            
            { lat: 39.770353, lng: -84.251258 },
            { lat: 39.723073, lng: -84.269446 },
            { lat: 39.688424, lng: -84.237978 },
            { lat: 39.670205, lng: -84.156276 },
            { lat: 39.678648, lng: -84.067646 }
        ]
    }

} )