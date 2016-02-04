var MyView = require('./MyView'),
    Markets = function() { return MyView.apply( this, arguments ) }

Object.assign( Markets.prototype, MyView.prototype, {

    dataTables: [
        { name: 'farmermarket', comparator: 'id'},
        { name: 'retailoutlet', comparator: 'id'},
        { name: 'restaurant', comparator: 'name'}
    ],

    getData( table ) {
        var self = this
        return new ( this.Collection.extend( { comparator: table.comparator, url: this.util.format("/%s", table.name ) } ) )()
        .fetch( { 
            success: function(response) {
                response.models.forEach( datum =>
                    self.templateData[ table.name ].append( self.templates[ table.name ]( datum.attributes ) )
                )
            },
            error: function(error) { return new self.Error( err ) }
        } )           
    },

    postRender() { 
        this.dataTables.forEach( table => this.getData( table ) )
    },

    requiresLogin: false,

    template: require('../templates/markets')( require('handlebars') ),

    templates: {
        farmermarket: require('../templates/business')( require('handlebars') ),
        retailoutlet: require('../templates/business')( require('handlebars') ),
        restaurant: require('../templates/restaurant')( require('handlebars') )
    }

} )

module.exports = Markets