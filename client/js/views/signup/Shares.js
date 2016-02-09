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
    },

    requiresLogin: false,

    selection: true,

    template: require('../../templates/signup/shares')( require('handlebars') ),

    validate() {
        var selectedShares = Object.keys( this.selectedItems ).map( id => this.items.get(id) )
        if( selectedShares.length !== 0 ) {
            this.signupData.shares = selectedShares
            return true
        }
        this.templateData.container.addClass('has-error')
    }

} )

module.exports = ShareSelection
