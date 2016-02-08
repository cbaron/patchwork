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

    requiresLogin: false,

    selection: true,

    template: require('../../templates/signup/shares')( require('handlebars') ),

} )

module.exports = ShareSelection
