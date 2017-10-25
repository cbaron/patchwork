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
        return { container: this.templateData.shares, factory: this.factory }
    },

    isSeason( season, model ) {
        const re = new RegExp( season, 'i' )

        return Boolean( re.test( model.get('name') ) || re.test( model.get('label') ) )
    },

    postRender() {
        List.prototype.postRender.call(this)

        this.on( 'itemSelected', model => {
            this.templateData.container.removeClass('has-error')
            if( !this.user.isAdmin() && this.isSeason( 'summer', model ) ) {
                this.items.forEach( share => {
                    if( this.isSeason( 'spring', share ) ) {
                        this.itemViews[share.id].templateData.container
                            .removeClass('inactive')
                            .on( 'click', () => this.itemViews[share.id].emit( 'clicked', this.itemViews[share.id].model ) )
                    }
                } )
            }
        } )

        this.on( 'itemUnselected', model => {
            if( !this.user.isAdmin() && this.isSeason( 'summer', model ) ) {
                this.items.forEach( share => {
                    if( this.isSeason( 'spring', share ) ) {
                        this.itemViews[share.id].templateData.container.addClass('inactive').off('click')
                        this.unselectItem( share )
                    }
                } )
            }
        } )

        this.signupData.shares = new ( this.Collection.extend( { comparator: 'startEpoch' } ) )()

        this.items.on( 'reset', () => { if( this.items.length === 0 ) return this.emit('noShares') } )

        this.on( 'initialized', () =>
            this.items.forEach( item => {
                const sessionShare = this.sessionShares.find( share => share.id === item.id )
                if( sessionShare ) {
                    this.selectItem( item )
                    this.signupData.shares.add( item )
                    if( sessionShare.selectedOptions ) item.set( 'selectedOptions', sessionShare.selectedOptions ) 
                    if( sessionShare.selectedDelivery ) item.set( 'selectedDelivery', sessionShare.selectedDelivery ) 
                    if( sessionShare.skipDays ) { item.set( 'skipDays', sessionShare.skipDays ) }
                }
            } )
        )

        if( this.sessionShares ) {
            this.on( 'itemAdded', () => {
                if( Object.keys( this.itemViews ).length === this.items.length ) this.emit('initialized')
            } )
        }
    },

    requiresLogin: false,

    selection: true,

    showCSAInfoPageInNewTab() { window.open('/csa#how-do-i-know') },

    template: require('../../templates/signup/shares'),

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
