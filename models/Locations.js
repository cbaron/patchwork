const Super = require('./__proto__')

module.exports = {
    schema: {
        attributes: Super.createAttributes( [
            {
                name: 'intro',
                label: 'Intro',
                range: 'Text'
            }, {
                name: 'farmersMarkets',
                label: 'Farmers Markets',
                range: [
                    {
                        name: 'heading',
                        label: 'Heading',
                        range: 'String'
                    }, {
                        name: 'description',
                        label: 'Description',
                        range: 'Text'
                    }
                ]
            }, {
                name: 'retailOutlets',
                label: 'Retail Outlets',
                range: [
                    {
                        name: 'heading',
                        label: 'Heading',
                        range: 'String'
                    }, {
                        name: 'description',
                        label: 'Description',
                        range: 'Text'
                    }
                ]
            }, {
                name: 'restaurants',
                label: 'Restaurants',
                range: [
                    {
                        name: 'heading',
                        label: 'Heading',
                        range: 'String'
                    }, {
                        name: 'description',
                        label: 'Description',
                        range: 'Text'
                    }
                ] 
            }, {
                name: 'pickupLocations',
                label: 'Pick-Up Locations',
                range: [
                    {
                        name: 'heading',
                        label: 'Heading',
                        range: 'String'
                    }, {
                        name: 'description',
                        label: 'Description',
                        range: 'Text'
                    }
                ]
            }

        ] )
    }

}