const Super = require('./__proto__')

module.exports = Object.assign( {}, Super, {

    DeliveryOption: Object.create( Super.Model, { resource: { value: 'deliveryoption' } } ),
    GroupDropoffs: Object.create( Super.Model, { resource: { value: 'groupdropoff' } } ),
    Route: Object.create( Super.Model, { resource: { value: 'deliveryroute' } } ),
    SkipWeeks: Object.create( Super.Model, { resource: { value: 'membershareskipweek' } } ),

    Share: require('../models/Share'),

    events: {
        dates: 'click',
        resetBtn: 'click',
    },

    clear() {
        this.els.dates.innerHTML = ''
        this.els.resetBtn.classList.add('hidden')
    },

    determineDates( dayOfWeek ) {
        this.els.deliveryDay.textContent = this.Moment().isoWeekday( dayOfWeek ).format('dddd')
        this.dates = [ ]

        if( ! Number.isInteger( dayOfWeek ) ) return this

        const now = this.Moment(),
            nextDeliveryCutoff = now,
            endDate = this.Moment( this.model.share.enddate )
            
        let deliveryDate = this.Moment( this.model.share.startdate ),
            startDay = deliveryDate.day()

        while( startDay != dayOfWeek ) {
            deliveryDate.add( 1, 'days' )
            startDay = this.Moment( deliveryDate ).day()
        }
       
        while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
            const isSkipWeek = this.SkipWeeks.data.find( week => 
                this.Moment( week.date ).week() === this.Moment( deliveryDate ).week() ) ? true : false
            
            this.dates.push( {
                date: this.Moment( deliveryDate ),
                unselectable: Boolean( deliveryDate.diff( nextDeliveryCutoff ) < 0 ),
                selected: !isSkipWeek
            } )

            deliveryDate.add( 7, 'days' )

        }

        return this
    },

    getPatchData() {
        const addedDates = [ ],
              removedDates = [ ]

        Object.keys( this.changedDates ).forEach( date => {
            const editedStatus = this.changedDates[ date ].editedStatus

            if( !editedStatus ) return

            const formattedDate = this.Moment( date ).format("YYYY-MM-DD")
            if( editedStatus === 'selected' ) addedDates.push( formattedDate )
            else removedDates.push( formattedDate )
        } )

        return {
            addedDates,
            removedDates, 
            allRemoved: Array.from( this.els.dates.querySelectorAll('li:not(.selected)') ).map( el => this.Moment( el.getAttribute('data-date'), 'YYYYMMDD' ).format('YYYY-MM-DD') )
        }
    },

    getWeeksAffected() {
        const selectableDates = this.dates.filter( date => !date.unselectable ) 
        return { selectable: selectableDates.length, skipped: selectableDates.filter( date => !date.selected ).length }
    },

    getDayOfWeek() {
        const delivery = this.model.delivery.data[0]

        return delivery.groupdropoff.id
            ? this.Xhr( { method: 'get', resource: 'sharegroupdropoff', qs: JSON.stringify( { shareid: this.model.share.id, groupdropoffid: delivery.groupdropoff.id } ) } )
              .then( response => Promise.resolve( response[0].dayofweek ) )
            : delivery.deliveryoption.name === 'farm'
                ? this.Route.data.find( route => route.label == 'farm' ).dayofweek
                : this.Xhr( {
                    method: 'get',
                    resource: 'zipcoderoute',
                    qs: JSON.stringify( {
                        zipcode: this.model.customer.member.data.zipcode,
                        routeid: { operation: 'join', value: { table: 'deliveryroute', column: 'id' } }
                    } )
                  } )
                  .then( response => Promise.resolve( response[0][ 'deliveryroute.dayofweek' ] ) )
    },

    getTotalDates() {
        return this.els.dates.querySelectorAll('li.selected').length
    },

    onDatesClick( e ) {
        if( !this.isAdmin ) return
        const el = e.target.closest('li'),
              date = el.getAttribute('data-date')
        
        if( el.classList.contains('unselectable') ) return

        let editedStatus

        if( ! this.changedDates[ date ] ) this.changedDates[ date ] = { initialStatus: el.classList.contains('selected') ? 'selected' : 'removed' }

        el.classList.toggle('selected')
        editedStatus = el.classList.contains('selected') ? 'selected' : 'removed'

        if( editedStatus !== this.changedDates[ date ].initialStatus ) {
            this.changedDates[ date ].editedStatus = editedStatus
            el.classList.add('edited')
            this.els.resetBtn.classList.remove('hidden')
        } else {
            this.changedDates[ date ].editedStatus = undefined
            el.classList.remove('edited')
        }

        if( ! Object.keys( this.changedDates ).find( key => this.changedDates[key].editedStatus !== undefined ) ) {
            this.els.resetBtn.classList.add('hidden')
            this.emit( 'reset', this.model )
            return this.slideOut( this.els.editSummary, 'right' )
        }

        this.showEditSummary()
    },

    onResetBtnClick() {
        this.els.resetBtn.classList.add('hidden')

        Object.keys( this.changedDates ).forEach( key => {
            if( this.changedDates[key].editedStatus ) {
                const el = this.els.dates.querySelector(`li[data-date=${CSS.escape( key )}`)
                el.classList.toggle('selected')
                el.classList.remove('edited')
            }
        } )

        this.update( this.model )
        this.emit( 'reset', this.model )
    },

    renderDates() {
        this.dates.forEach( datum => this.slurpTemplate( { template: this.templates.date( { ...datum, isAdmin: this.isAdmin } ), insertion: { el: this.els.dates } } ) )
        return this
    },

    showEditSummary() {
        let result = 0,
            added = 0,
            removed = 0

        this.els.selectedDates.innerHTML = ''
        this.els.removedDates.innerHTML = ''

        Object.keys( this.changedDates ).forEach( date => {
            const editedStatus = this.changedDates[ date ].editedStatus

            if( editedStatus ) {

                editedStatus === 'selected'
                    ? added += 1
                    : removed += 1

                this.slurpTemplate( {
                    insertion: { el: this.els[ `${editedStatus}Dates` ] },
                    template: this.templates.summaryColumn( { value: this.Moment( date ).format("MMM D") } )
                } )
            }
        } )

        result = added - removed
        this.els.weekChange.textContent = result
        this.els.weekChange.classList.toggle( 'is-negative', Boolean( result < 0 ) )

        if( this.isHidden( this.els.editSummary ) ) this.slideIn( this.els.editSummary, 'right' )

        this.emit( 'adjustment', { added, removed } )
    },

    templates: {
        date: require('./templates/DeliveryDate'),
        summaryColumn: date => `<li>${date.value}</li>`
    },

    update( { customer, delivery, share, isAdmin } ) {
        if( this.updating ) return

        this.isAdmin = isAdmin
        this.els.editSummary.classList.add('fd-hidden')

        this.updating = true

        this.model = arguments[0]

        this.changedDates = { }

        return this.Route.get()
        .then( () => this.SkipWeeks.get( { query: { membershareid: share.membershareid } } ) )
        .then( () => this.getDayOfWeek() )
        .then( dayOfWeek => {
            this.clear()
            this.determineDates( dayOfWeek ).renderDates().show()
            return Promise.resolve( this.updating = false )
        } )
    },

    updateDelivery( data ) {
        const modelCopy = JSON.parse( JSON.stringify( this.model ) ) 

        return this.DeliveryOption.get( { query: { name: data.deliveryOption } } )
        .then( () => {
            if( this.DeliveryOption.data.length ) modelCopy.delivery.data[0].deliveryoption = this.DeliveryOption.data[0]

            if( ! data.groupOption ) {
                Object.keys( modelCopy.delivery.data[0].groupdropoff ).forEach( key =>
                    modelCopy.delivery.data[0].groupdropoff[ key ] = null
                )
            }

            return ( data.groupOption )
                ? this.GroupDropoffs.get( { query: { name: data.groupOption } } )
                  .then( () => {
                    if( this.GroupDropoffs.data.length ) modelCopy.delivery.data[0].groupdropoff = this.GroupDropoffs.data[0]
                    this.update( modelCopy )
                  } )
                : this.update( modelCopy )
        } )
        .catch( this.Error )
    }

} )
