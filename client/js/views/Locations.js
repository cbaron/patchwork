const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    CurrentShare: require('../models/CurrentShare'),
    GroupDropoffs: Object.create( require('../models/__proto__'), { resource: { value: 'groupdropoff' } } ),
    ShareGroupDropoffs: require('../models/ShareGroupDropoff'),

    initMap() {

        const mapOpts = {
            center: { lat: 39.758948, lng: -84.191607 },
            zoom: 12
        }

        this.map = new google.maps.Map( this.els.map, Object.assign( {
          disableDefaultUI: false,
        }, mapOpts ) )

        //this.fetchAndRender()
        //.catch( this.Error )
    },

    postRender() {
        this.CurrentShare.getCurrentGroupDropoffsData()
        .then( dropoffData => {
            console.log( dropoffData )
            dropoffData.forEach( dropoffDatum =>
                this.slurpTemplate( {
                    template: this.templates.location( dropoffDatum ),
                    insertion: { el: this.els.groupPickup }
                } )
            )
        })
        .catch( this.Error )

        if( window.google ) { this.initMap() } else { window.initMap = this.initMap }

        return CustomContent.postRender.call(this)

    },

    tables: [
        { name: 'farmermarket', el: 'farmerMarkets', template: 'location' },
        { name: 'retailoutlet', el: 'retailOutlets', template: 'location' },
        { name: 'restaurant', el: 'restaurants', template: 'location' },
    ],

    templates: {
        location: require('./templates/Location')
    }

} )