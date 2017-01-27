var List = require('../util/List'),
    ShareSelection = function() { return List.apply( this, arguments ) }

Object.assign( ShareSelection.prototype, List.prototype, {

    ItemView: require('./Share'),

    Models: {
        DeliveryDate: require('../../models/DeliveryDate'),
        Share: require('../../models/Share')
    },

    collection: { comparator: 'startEpoch', model: require('../../models/Share'), url: "/share" },

    events: {
        csaInfoBtn: { method: 'showCSAInfoPageInNewTab' }
    },

    fetch: { data: {
        display: true,
        enddate: JSON.stringify( { operation: '>', value: require('moment')().add( 2, 'weeks' ).format('YYYY-MM-DD') } ),
        signupcutoff: JSON.stringify( { operation: '>', value: require('moment')().format('YYYY-MM-DD') } )
    } },

    getItemViewOptions() {
        return { container: this.templateData.shares }
    },

    isSeason( season, model ) {
        const re = new RegExp( season, 'i' )

        return Boolean( re.test( model.get('name') ) || re.test( model.get('label') ) )
    },

    postRender() {
        List.prototype.postRender.call(this)

        this.on( 'itemSelected', model => {
            this.templateData.container.removeClass('has-error')
            if( this.isSeason( 'summer', model ) ) {
                this.items.forEach( share => {
                    if( this.isSeason( 'spring', share ) ) {
                        this.itemViews[share.id].show()
                    }
                } )
            }
        } )

        this.on( 'itemUnselected', model => {
            if( this.isSeason( 'summer', model ) ) {
                this.items.forEach( share => {
                    if( this.isSeason( 'spring', share ) ) {
                        this.itemViews[share.id].hide()
                        this.unselectItem( share )
                    }
                } )
            }
        } )

        this.signupData.shares = new ( this.Collection.extend( { comparator: 'startEpoch' } ) )()

        this.items.on( 'reset', () => { if( this.items.length === 0 ) return this.emit('noShares') } )

        if( this.sessionShares ) {
            var sessionShareIds = this.sessionShares.map( share => share.id )
            this.on( 'itemAdded', model => {
                var sessionShare = this._( this.sessionShares ).find( share => share.id == model.id )
                if( sessionShare ) {
                    this.selectItem( model )
                    this.signupData.shares.add( model )
                    if( sessionShare.selectedOptions ) model.set( 'selectedOptions', sessionShare.selectedOptions ) 
                    if( sessionShare.selectedDelivery ) model.set( 'selectedDelivery', sessionShare.selectedDelivery ) 
                    if( sessionShare.skipDays ) { model.set( 'skipDays', sessionShare.skipDays ) }
                }
                if( Object.keys( this.itemViews ).length === this.items.length ) this.emit('initialized')
            } )
        }
    },

    requiresLogin: false,

    selection: true,

    showCSAInfoPageInNewTab() { window.open('/csa#how-do-i-know') },

    template: require('../../templates/signup/shares')( require('handlebars') ),

    validate() {
        var prevShareIds = this.signupData.shares.map( share => share.id ),
            selectedShareIds = Object.keys( this.selectedItems ).map( id => parseInt(id) )

        if( selectedShareIds.length === 0 ) { this.templateData.container.addClass('has-error'); return false }
        
        this._( prevShareIds ).difference( selectedShareIds ).forEach( id => {
            var share = this.items.get(id)
            share.unset('selectedOptions')
            share.unset('selectedDelivery')
            share.unset('skipDays')
            this.signupData.shares.remove( share )
        } )

        this._( selectedShareIds ).difference( prevShareIds ).forEach( id => this.signupData.shares.add( this.items.get(id) ) )
        
        return true
    }

} )

module.exports = ShareSelection
