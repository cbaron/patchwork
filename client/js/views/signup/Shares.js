var List = require('../util/List'),
    ShareSelection = function() { return List.apply( this, arguments ) }

Object.assign( ShareSelection.prototype, List.prototype, {

    ItemView: require('./Share'),

    collection: { model: require('../../models/Share'), url: "/share" },

    events: {
        csaInfoBtn: { method: 'showCSAInfoPageInNewTab' }
    },

    fetch: { data: { display: true } },

    getItemViewOptions() {
        return { container: this.templateData.shares }
    },

    postRender() {
        List.prototype.postRender.call(this)
        this.on( 'itemSelected', () => this.templateData.container.removeClass('has-error') )

        this.signupData.shares = new this.Collection()
        this.items.on( 'reset', () => { if( this.items.length === 0 ) return this.emit('noShares') } )

        if( this.sessionShares ) {
            var sessionShareIds = this.sessionShares.map( share => share.id )
            this.on( 'itemAdded', model => {
                if( this._( sessionShareIds ).contains( model.id ) ) {
                    this.selectItem( model )
                    this.signupData.shares.add( model )
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
            share.unset('selectedDeliveryDayOfWeek')
            share.unset('skipWeeks')
            this.signupData.shares.remove( share )
        } )

        this._( selectedShareIds ).difference( prevShareIds ).forEach( id => this.signupData.shares.add( this.items.get(id) ) )
        
        return true
    }

} )

module.exports = ShareSelection
