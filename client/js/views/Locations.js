module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        legend: 'click'
    },

    model: require('../models/Locations'),

    models: {
        groupLocation: require('../models/CurrentShare'),
        farmerMarket: require('../models/FarmerMarket'),
        retailOutlet: require('../models/RetailOutlet'),
        restaurant: require('../models/Restaurant'),
        farmPickup: require('../models/FarmPickup')
    },

    templates: {
        infoWindow: require('./templates/InfoWindow'),
        location: require('./templates/Location')
    },

    createDeliveryRange() {
        const deliveryRangeCoords = this.model.data.deliveryRangeCoords,
            overlayColor = this.model.attributes.find( attr => attr.name === 'deliveryRange' ).color

        this.deliveryRange = new google.maps.Polygon( {
            paths: deliveryRangeCoords,
            strokeColor: overlayColor,
            strokeOpacity: .3,
            strokeWeight: 1,
            fillColor: overlayColor,
            fillOpacity: .3,
            clickable: false
        } )

        this.deliveryRange.setMap( this.map )
    },

    createMarkers() {
        this.markers = { }
        this.icons = { }

        this.model.attributes.forEach( attr => {
            if( !this.models[ attr.name ] ) return

            const category = attr.name,
                data = this.models[ category ].data.groupDropoffs || this.models[ category ].data

                this.icons[ category ] = this.getIcon( category )
                this.markers[ category ] = [ ]

                data.forEach( datum => {
                    if( datum.location ) {
                        const infowindow = new google.maps.InfoWindow( {
                            content: this.templates.infoWindow( datum ),
                        } )

                        const marker = new google.maps.Marker( {
                            position: { lat: datum.location[0], lng: datum.location[1] },
                            map: this.map,
                            draggable: false,
                            icon: this.icons[ category ],
                            title: datum.name
                        } )

                        this.markers[ category ].push( marker )

                        marker.addListener( 'click', () => infowindow.open( this.map, marker ) )

                    }
                } )
        } )
    },

    getIcon( name ) {
        if( name === 'farmPickup' ) return '/static/img/favicon.png'

        const color = this.model.attributes.find( attr => name === attr.name ).color

        return {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: color,
            fillColor: color,
            fillOpacity: 1,
            scale: 4
        }
    },

    initializeModels() {
        return Promise.all( Object.keys( this.models ).map( name => this.models[ name ].get() ) )
        .then( () => Promise.all( [ this.models.groupLocation.getCurrentGroupDropoffs(), this.models.farmPickup.getHours() ] ) )
    },

    initMap() {
        const mapOpts = {
            center: { lat: 39.758948, lng: -84.191607 },
            zoom: 10,
            mapTypeControl: false
        }

        this.map = new google.maps.Map( this.els.map, Object.assign( {
          disableDefaultUI: false,
        }, mapOpts ) )

        this.createDeliveryRange()
        this.createMarkers()

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push( this.els.legend )
    },

    insertListLocations() {
        this.model.attributes.forEach( attr => {
            if( !attr.el ) return

            const data = this.models[ attr.name ].data.groupDropoffs || this.models[ attr.name ].data,
                el = this.els[ attr.el ]

            data.forEach( datum =>
                this.slurpTemplate( {
                    template: this.templates.location( datum ),
                    insertion: { el }
                } )
            )
        } )
    },

    onLegendClick( e ) {
        if( e.target.tagName !== "INPUT" ) return

        const category = e.target.getAttribute('data-name'),
            checked = e.target.checked

        if( category === 'deliveryRange' ) return this.toggleDeliveryRange( checked )

        this.toggleMarkerCategory( category, checked )

    },

    postRender() {
        this.initializeModels()
        .then( () => {
            this.insertListLocations()
            if( window.google ) { this.initMap() } else { window.initMap = this.initMap }
        } )
        .catch( this.Error )

        return this
    },

    templateOpts() { return { categories: this.model.attributes } },

    toggleDeliveryRange( checked ) {
        this.deliveryRange.setMap( checked ? this.map : null )
    },

    toggleMarkerCategory( category, checked ) {
        this.markers[ category ].forEach( marker => marker.setMap( checked ? this.map : null ) )
    },

} )