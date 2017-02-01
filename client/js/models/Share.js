module.exports = require('backbone').Model.extend( Object.assign( { }, require('../../../lib/MyObject').prototype, {

    Collection: require('backbone').Collection,

    DeliveryDate: require('./DeliveryDate'),

    Dropoff: require('./Dropoff'),

    dayOfWeekMap: require('./DeliveryRoute').prototype.dayOfWeekMap,

    getDeliveryDates() {
        var dates = [ ],
            now = this.moment(),
            deliveryDay = this.get('selectedDelivery').dayofweek,
            deliveryDate = this.moment( this.get('startdate') ),
            endDate = this.moment( this.get('enddate') ),
            nextWeek = ( now.day() === 6 || ( now.day() === 5 && now.hour() > 5 ) )
                ? this.moment().day(15).hour(0).minute(0).second(0).millisecond(0)
                : this.moment().day(8).hour(0).minute(0).second(0).millisecond(0),
            startDay = startDay = deliveryDate.day()

        if( ! Number.isInteger( deliveryDay ) ) return new this.Collection([])

        while( startDay != deliveryDay ) {
            deliveryDate.add( 1, 'days' )
            startDay = this.moment( deliveryDate ).day()
        }
        
        while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
            var model = new this.DeliveryDate( deliveryDate, { parse: true } )
            if( deliveryDate.diff( nextWeek ) < 0 ) model.set( { unselectable: true } )
            dates.push( model )
            deliveryDate.add( 7, 'days' )
        }
        
        this.set( { deliveryDates: new this.Collection( dates ) } )

        return this.get('deliveryDates')
    },

    getDeliveryOptions() {

        if( this.has('deliveryoptions') ) return this.Q( this.get('deliveryoptions') )

        return this.Q( new ( this.Collection.extend( { url: "/sharedeliveryoption" } ) )().fetch( { data: { shareid: this.id } } ) )
        .then( mappings => {
            var deliveryOptions = new ( this.Collection.extend( { url: "/deliveryoption" } ) )()

            this.set( { deliveryoptions: deliveryOptions } )

            if( mappings.length === 0 ) return this.Q()

            return this.Q( deliveryOptions.fetch( { data: { id: mappings.map( record => record.deliveryoptionid ).join(',') } } ) )
        } )
        .fail( e => console.log( "Getting Delivery Options : " + e.stack || e ) )
    },

    getGroupDropoffs() {
        var mappings = new ( this.Collection.extend( { url: "/sharegroupdropoff" } ) )()

        if( this.has('groupdropoffs') ) return this.Q( this.get('groupdropoffs') )

        return this.Q( mappings.fetch( { data: { shareid: this.id } } ) )
        .then( () => {
            var groupDropoffs

            if( mappings.length === 0 ) return

            groupDropoffs = new ( this.Collection.extend( { model: this.Dropoff, url: "/groupdropoff" } ) )()
            this.set( { groupdropoffs: groupDropoffs } )

            return this.Q( groupDropoffs.fetch( { data: { id: mappings.map( record => record.get('groupdropoffid') ).join(',') } } ) )
        } )
        .then( () => {
            
            if( mappings.length === 0 ) return this.set( 'groupdropoffs', [] )
              
            this.get('groupdropoffs').forEach( dropoff => { 
                var mapping = mappings.find( model => model.get('groupdropoffid') == dropoff.id )

                dropoff.set( {
                    dayofweek: mapping.get('dayofweek'),
                    starttime: this.timeToHumanTime( mapping.get('starttime') ),
                    endtime: this.timeToHumanTime( mapping.get('endtime') )
                } )
            } ) 
        } )
        .fail( e => console.log( "Getting Group Dropoffs : " + e.stack || e ) )
    },

    getSelectedDates() {
        this.set( { selectedDates:
            this._( this.get('deliveryDates')
                .reject( deliveryDay => deliveryDay.get('unselectable') ) )
                .reject( deliveryDay => this._(this.get('skipDays')).contains( deliveryDay.id ) )
        } )
    },

    getShareOptions() {
        
        if( this.has('shareoptions') ) return this.Q( this.get('shareoptions') )
                
        return this.Q( new ( this.Collection.extend( { url: "/shareoptionshare" } ) )().fetch( { data: { shareid: this.id } } ) )
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
    },

    moneyToFloat( money ) { return parseFloat( money.replace(/\$|,/g, "") ) },

    parse( response ) {
        var startDate = this.moment( response.startdate ),
            endDate = this.moment( response.enddate )

        return Object.assign( response, {
            duration: Math.ceil( endDate.diff( startDate, 'days' ) / 7 ),
            humanEnddate: endDate.format("MMM D"),
            humanStartdate: startDate.format("MMM D"),
            startEpoch: startDate.unix()
        } )
    },

    shareOptionComparator( a, b ) {
        var moneyToFloat = ( money ) => parseFloat( money.replace(/\$|,/g, "") ),
            aVal = moneyToFloat( a.get('options').at( a.get('options').length - 1 ).get('price') ),
            bVal = moneyToFloat( b.get('options').at( b.get('options').length - 1 ).get('price') )
        
        return ( aVal > bVal )
            ? -1
            : ( bVal > aVal )
                ? 1
                : 0
    },

    shareOptionOptionComparator( a, b ) {
        var moneyToFloat = ( money ) => parseFloat( money.replace(/\$|,/g, "") ),
            aVal = moneyToFloat( a.get('price') ),
            bVal = moneyToFloat( b.get('price') )
        
        return ( aVal > bVal )
            ? 1
            : ( bVal > aVal )
                ? -1
                : 0
    },

    timeToHumanTime( time ) {
        return this.moment( [ this.moment().format('YYYY-MM-DD'), time ].join(' ') ).format('h:mmA') 
    }

} ) )
