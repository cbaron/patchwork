module.exports = require('backbone').Model.extend( Object.assign( { }, require('../../../lib/MyObject').prototype, {

    Collection: require('backbone').Collection,

    DeliveryDate: require('./DeliveryDate'),

    getDeliveryDates() {
        var dates = [ ],
            deliveryDay = this.get('selectedDelivery').dayofweek,
            deliveryDate = this.moment( this.get('startdate') ),
            endDate = this.moment( this.get('enddate') ),
            startDay = this.moment( deliveryDate ).day()
        
        if( ! deliveryDay ) throw Error("No delivery Day")

        while( startDay != deliveryDay ) {
            deliveryDate.add( 1, 'days' )
            startDay = this.moment( deliveryDate ).day()
        }
        
        while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
            dates.push( new this.DeliveryDate( deliveryDate, { parse: true } ) )
            deliveryDate.add( 7, 'days' )
        }
        
        this.set( { deliveryDates: new this.Collection( dates ) } )
        return this.get('deliveryDates')
    },

    getDeliveryOptions() {

        this.Q( new ( this.Collection.extend( { url: "/sharedeliveryoption" } ) )().fetch() )
        .then( mappings => {
            var deliveryOptions

            if( mappings.length === 0 ) return

            deliveryOptions = new ( this.Collection.extend( { url: "/deliveryoption" } ) )()
            this.set( { deliveryoptions: deliveryOptions } )

            return this.Q( deliveryOptions.fetch( { data: { id: mappings.map( record => record.deliveryoptionid ).join(',') } } ) )
        } )
    },

    getGroupDropoffs() {
        var mappings = new ( this.Collection.extend( { url: "/sharegroupdropoff" } ) )()

        this.Q( mappings.fetch() )
        .then( () => {
            var groupDropoffs

            if( mappings.length === 0 ) return

            groupDropoffs = new ( this.Collection.extend( { model: this.Models.Dropoff, url: "/groupdropoff" } ) )()
            this.set( { groupdropoffs: groupDropoffs } )

            return this.Q( groupDropoffs.fetch( { data: { id: mappings.map( record => record.get('groupdropoffid') ).join(',') } } ) )
        } )
        .then( () => {
         
            this.get('groupdropoffs').forEach( dropoff => { 
                var mapping = mappings.find( model => model.get('groupdropoffid') == dropoff.id )

                model.set( {
                    dayofweek: mapping.get('dayofweek'),
                    starttime: this.timeToHumanTime( mapping.get('starttime') ),
                    endtime: this.timeToHumanTime( mapping.get('starttime') )
                } )
            } ) 
        } )
    },

    getSelectedDates() {
        this.set( { selectedDates: this.get('deliveryDates').reject( deliveryDay => this._(this.get('skipDays')).contains( deliveryDay.id ) ) } )
    },

    getShareOptions() {
       
        this.Q( new ( this.Collection.extend( { url: "/shareoptionshare" } ) )().fetch() )
        .then( mappings => {
            var shareOptions

            if( mappings.length === 0 ) return
            
            shareOptions = new ( this.Collection.extend( { url: "/shareoption" } ) )()
            this.set( { shareoptions: shareOptions } )

            return this.Q( shareOptions.fetch( { data: { id: mappings.map( record => record.shareoptionid ).join(',') } } ) )
        } )
        .then( () =>
            this.Q.all( this.get('shareoptions').map( shareOption => {
                shareOption.set( { options: new ( this.Collection.extend( { comparator: this.shareOptionOptionComparator, url: "/shareoptionoption" } ) )() } )
                return this.Q( shareOption.get('options').fetch( { data: { shareoptionid: shareOption.id } } ) )
            } ) )
        )
        .then( () => {
            this.get('shareoptions').comparator = this.shareOptionComparator
            this.get('shareoptions').sort()
        } )
        .fail( e => console.log( "Getting Share Options : " + e.stack || e ) )
        .done() 
    },

    parse( response ) {
        return Object.assign( response, {
            duration: Math.ceil( this.moment( response.enddate ).diff( this.moment( response.startdate ), 'days' ) / 7 ),
            humanEnddate: this.moment( response.enddate ).format("MMM D"),
            humanStartdate: this.moment( response.startdate ).format("MMM D"),
        } )
    },

    shareOptionComparator( a, b ) {
        var moneyToFloat = ( money ) => money.replace(/\$|,/g, ""),
            aVal = moneyToFloat( a.get('options').at( a.get('options').length - 1 ).get('price') ),
            bVal = moneyToFloat( b.get('options').at( b.get('options').length - 1 ).get('price') )

        return ( a > b )
            ? -1
            : ( b > a )
                ? 1
                : 0
    },

    shareOptionOptionComparator( a, b ) {
        var moneyToFloat = ( money ) => money.replace(/\$|,/g, ""),
            aVal = moneyToFloat( a.get('price') ),
            bVal = moneyToFloat( b.get('price') )

        return ( a > b )
            ? -1
            : ( b > a )
                ? 1
                : 0
    },

    timeToHumanTime( time ) {
        return this.moment( [ this.moment().format('YYYY-MM-DD'), time ].join(' ') ).format('hA') 
    }

} ) )
