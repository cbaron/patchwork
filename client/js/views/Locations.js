const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    events: {
        mapCategoryBtn: 'click'
    },

    model: require('../models/Locations'),

    models: {
        currentShare: require('../models/CurrentShare'),
        farmerMarket: require('../models/FarmerMarket'),
        retailOutlet: require('../models/RetailOutlet'),
        restaurant: require('../models/Restaurant'),
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
            zoom: 10,
            mapTypeControl: false
        }

        this.map = new google.maps.Map( this.els.map, Object.assign( {
          disableDefaultUI: false,
        }, mapOpts ) )

        const deliveryRangeCoords = this.model.data.deliveryRangeCoords

        this.deliveryRange = new google.maps.Polygon( {
            paths: deliveryRangeCoords,
            strokeColor: '#ed1c24',
            strokeOpacity: .3,
            strokeWeight: 1,
            fillColor: '#ed1c24',
            fillOpacity: .3
        } )

        this.deliveryRange.setMap( this.map )

        this.markers = { }
        this.icons = { }

        Object.keys( this.models ).forEach( name => {
            const category = name === 'currentShare' ? 'groupLocation' : name,
                data = this.models[ name ].data.groupDropoffs || this.models[ name ].data

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

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push( this.els.legend )

    },

    insertListLocations() {
        Object.keys( this.models ).forEach( name => {
            const data = this.models[ name ].data.groupDropoffs || this.models[ name ].data,
                el = this.els[ name === 'currentShare' ? 'groupLocation' : name ]

            data.forEach( datum =>
                this.slurpTemplate( {
                    template: this.templates.location( datum ),
                    insertion: { el }
                } )
            )
        } )
    },

    nameToColor: {
        farmerMarket: '#ed1c24',
        retailOutlet: '#ffdd14',
        restaurant: '#231f20',
        groupLocation: '#f8941e'
    },

    onMapCategoryBtnClick( e ) {
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