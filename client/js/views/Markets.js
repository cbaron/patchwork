var MyView = require('./MyView'),
    Markets = function() { return MyView.apply( this, arguments ) }

Object.assign( Markets.prototype, MyView.prototype, {

    getData(url) {        
        return new Promise( ( resolve, reject ) => {            
            this.$.ajax( {
                type: "GET",
                url: this.util.format("/%s", url),
                headers: { accept: "application/json" },
                success: data => resolve( data )
            } )                                  
        } )        
    },

    postRender() {
        [ 'farmermarket', 'retailoutlet', 'restaurant' ].forEach( table => {
            this.getData( table ).then( data => data[ table ].forEach( datum => {
                this.templateData[ table ].append( this.templates[ table ]( datum ) )
            }) ).catch( err => new this.Error( err ) )
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