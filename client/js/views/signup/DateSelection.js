var List = require('../util/List'),
    DateSelection = function() { return List.apply( this, arguments ) }

Object.assign( DateSelection.prototype, List.prototype, {

    ItemView: require('./PickupDates'),

    getItemViewOptions() { return { container: this.templateData.shares } },
    
    itemModels() { return this.signupData.shares },

    requiresLogin: false,

    selection: true,

    template: require('../../templates/signup/dateSelection')( require('handlebars') ),

    validate() { return true }

} )

module.exports = DateSelection
