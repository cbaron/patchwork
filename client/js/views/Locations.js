const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    events: {
        legend: 'click',
        signupBtn: 'click'
    },

    model: require('../models/Locations'),

    models: {
        groupLocation: require('../models/CurrentGroups'),
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
        const overlayColor = this.model.attributes.find( attr => attr.name === 'deliveryRange' ).color

        this.deliveryRange = new google.maps.Polygon( {
            paths: this.model.data.deliveryRangeCoords,
            strokeColor: overlayColor,
            strokeOpacity: .3,
            strokeWeight: 1,
            fillColor: overlayColor,
            fillOpacity: .3,
            clickable: false
        } )

        this.deliveryRange.setMap( this.map )
    },

    createMarkers( data, category ) {
        this.icons[ category ] = this.getIcon( category )
        this.markers[ category ] = [ ]

        data.forEach( datum => {
            if( !datum.location ) return

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

        } )
    },

    fetchAndRender() {
        let chain = Promise.resolve()

        return Promise.all( Object.keys( this.models ).map( name => {
            chain = chain.then( () => 
                this.models[ name ].get()
                .then( () =>
                    name === 'farmPickup'
                        ? this.models.farmPickup.getHours()
                        : Promise.resolve()
                )
                .then( () => {
                    const modelAttr = this.model.attributes.find( attr => attr.name === name ),
                        data = this.models[ name ].data

                    this.insertListLocations( data, this.els[ modelAttr.el ] )
                    this.createMarkers( data, name )

                    return Promise.resolve()
                } )
                .catch( e => Promise.resolve( console.log( `Failed to retrieve ${name} data.` ) ) )
            )
        } ) )
    },

    getIcon( category ) {
        if( category === 'farmPickup' ) return '/static/img/favicon.png'

        const color = this.model.attributes.find( attr => category === attr.name ).color

        return {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: color,
            fillColor: color,
            fillOpacity: 1,
            scale: 4
        }
    },

    initMap() {
        const mapOpts = {
            center: { lat: 39.758948, lng: -84.191607 },
            zoom: 10,
            mapTypeControl: false
        }

        this.map = new google.maps.Map( this.els.map, mapOpts )

        this.markers = { }
        this.icons = { }

        this.createDeliveryRange()

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push( this.els.legend )
    },

    insertListLocations( data, el ) {
        data.forEach( datum =>
            this.slurpTemplate( {
                template: this.templates.location( datum ),
                insertion: { el }
            } )
        )
    },

    onLegendClick( e ) {
        if( e.target.tagName !== "INPUT" ) return

        const category = e.target.getAttribute('data-name'),
            checked = e.target.checked

        if( category === 'deliveryRange' ) return this.toggleDeliveryRange( checked )

        this.toggleMarkerCategory( category, checked )

    },

    onNavigation() {
        return this.show()
        .then( () => window.scrollTo(0,0) )
        .catch( this.Error )
    },

    onSignupBtnClick() { this.emit( 'navigate', 'sign-up' ) },

    postRender() {
        if( window.google ) { this.initMap() } else { window.initGMap = this.initMap }

        this.fetchAndRender()

        return CustomContent.postRender.call(this)
    },

    templateOpts() { return { categories: this.model.attributes } },

    toggleDeliveryRange( checked ) {
        this.deliveryRange.setMap( checked ? this.map : null )
    },

    toggleMarkerCategory( category, checked ) {
        this.markers[ category ].forEach( marker => marker.setMap( checked ? this.map : null ) )
    },

} )