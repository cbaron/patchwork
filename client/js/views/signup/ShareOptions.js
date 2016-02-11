var List = require('../util/List'),
    ShareOptions = function() { return List.apply( this, arguments ) }

Object.assign( ShareOptions.prototype, List.prototype, {

    ItemView: require('./SingleShareOptions'),

    events: {
    },

    getItemViewOptions() { return { container: this.templateData.shares, signupData: this.signupData } },
    
    itemModels() { return this.signupData.shares },

    requiresLogin: false,

    selection: true,

    template: require('../../templates/signup/shareOptions')( require('handlebars') ),

    validate() { return true }

} )

module.exports = ShareOptions
