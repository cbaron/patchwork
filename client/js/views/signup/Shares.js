var List = require('../util/List'),
    ShareSelection = function() { return List.apply( this, arguments ) }

Object.assign( ShareSelection.prototype, List.prototype, {

    ItemView: require('./Share'),

    collection: { model: require('../../models/Share'), url: "/share" },

    events: {
    },

    fetch: true,

    getItemViewOptions() {
        return { container: this.templateData.shares }
    },

    postRender() {
        List.prototype.postRender.call(this)
        this.on( 'itemSelected', () => this.templateData.container.removeClass('has-error') )
        this.signupData.shares = new this.Collection()
    },

    requiresLogin: false,

    selection: true,

    template: require('../../templates/signup/shares')( require('handlebars') ),

    validate() {
        var prevShares = this.signupData.shares,
            prevShareIds = ( prevShares ) ? prevShares.map( share => share.id ) : [ ],
            selectedShareIds = Object.keys( this.selectedItems )

        if( selectedShareIds.length === 0 ) { this.templateData.container.addClass('has-error'); return false }
                
        if( prevShares === undefined ) { 
            selectedShareIds.forEach( id => this.signupData.shares.add( this.items.get(id) ) )
        } else {
            this._( prevShareIds ).difference( selectedShareIds ).forEach( id => this.signupData.shares.remove( this.items.get(id) ) )
            this._( selectedShareIds ).difference( prevShareIds ).forEach( id => this.signupData.shares.add( this.items.get(id) ) )
        }
        
        return true
    }

} )

module.exports = ShareSelection
