var MyView = require('../MyView'),
    GetData = function() { return MyView.apply( this, arguments ) }

Object.assign( GetData.prototype, MyView.prototype, {

    dataTables: [],

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

} )

module.exports = GetData