const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    models: {
        currentShare: require('../models/CurrentShare'),
        farmerMarkets: require('../models/FarmerMarket'),
        retailOutlets: require('../models/RetailOutlet'),
        restaurants: require('../models/Restaurant'),
    },

    templates: {
        infoWindow: require('./templates/InfoWindow'),
        location: require('./templates/Location')
    },

    getIcon( name ) {
        const color = this.nameToColor[ name ]

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
        .then( () => this.models.currentShare.getCurrentGroupDropoffs() )
    },

    initMap() {

        const mapOpts = {
            center: { lat: 39.758948, lng: -84.191607 },
            zoom: 13,
            mapTypeControl: false
        }

        this.map = new google.maps.Map( this.els.map, Object.assign( {
          disableDefaultUI: false,
        }, mapOpts ) )

        this.markers = { }
        this.icons = { }

        Object.keys( this.models ).forEach( name => {
            const iconName = name === 'currentShare' ? 'groupPickup' : name,
                data = this.models[ name ].data.groupDropoffs || this.models[ name ].data

                this.icons[ iconName ] = this.getIcon( iconName )

                data.forEach( datum => {
                    if( datum.location ) {
                        const infowindow = new google.maps.InfoWindow( {
                            content: this.templates.infoWindow( datum ),
                            disableAutoPan: true
                        } )

                        const marker = new google.maps.Marker( {
                            position: { lat: datum.location[0], lng: datum.location[1] },
                            map: this.map,
                            draggable: false,
                            icon: this.icons[ iconName ],
                            title: datum.name
                        } )

                        marker.addListener( 'click', () => infowindow.open( this.map, marker ) )//;this.onMarkerClick( marker, datum ) )

                    }
                } )
        } )

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push( this.els.legend )

    },

    insertListLocations() {
        Object.keys( this.models ).forEach( name => {
            const data = this.models[ name ].data.groupDropoffs || this.models[ name ].data,
                el = this.els[ name === 'currentShare' ? 'groupPickup' : name ]

            data.forEach( datum =>
                this.slurpTemplate( {
                    template: this.templates.location( datum ),
                    insertion: { el }
                } )
            )
        } )
    },

    nameToColor: {
        farmerMarkets: '#ed1c24',
        retailOutlets: '#ffdd14',
        restaurants: '#231f20',
        groupPickup: '#f8941e'
    },

    onMarkerClick() { return },

    postRender() {
        this.initializeModels()
        .then( () => {
            this.insertListLocations()
            if( window.google ) { this.initMap() } else { window.initMap = this.initMap }
        } )
        .catch( this.Error )

        return this
    }

} )