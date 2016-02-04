var MyView = require('./MyView'),
    CSA = function() { return MyView.apply( this, arguments ) }

Object.assign( CSA.prototype, MyView.prototype, {

    dataTables: [
        { name: 'csapageimage', comparator: 'id'},
        { name: 'csastatements', comparator: 'id'},
        { name: 'largeshareexamplecolumnone', comparator: 'id'},
        { name: 'largeshareexamplecolumntwo', comparator: 'id'}
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

    template: require('../templates/csa')( require('handlebars') ),

    templates: {
        csapageimage: require('../templates/imageInstance')( require('handlebars') ),
        csastatements: require('../templates/listItem')( require('handlebars') ),
        largeshareexamplecolumnone: require('../templates/listItem')( require('handlebars') ),
        largeshareexamplecolumntwo: require('../templates/listItem')( require('handlebars') )
    }

} )

module.exports = CSA