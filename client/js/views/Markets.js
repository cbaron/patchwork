var MyView = require('./MyView'),
    Markets = function() { return MyView.apply( this, arguments ) }

Object.assign( Markets.prototype, MyView.prototype, {

    getData( url ) {
        return new ( this.Collection.extend( { comparator: 'name', url: this.util.format("/%s", url ) } ) )()
        .fetch( { parse: true, success: response => console.log(response) } )           
    },

    postRender() {
        [ 'farmermarket', 'retailoutlet', 'restaurant' ].forEach( table => {
            this.getData( table ).done( data => data[ table ].forEach( datum => {
                this.templateData[ table ].append( this.templates[ table ]( datum ) )
            }) ).fail( err => new this.Error( err ) )
        } )        
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