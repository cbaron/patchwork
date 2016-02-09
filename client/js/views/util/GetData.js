var MyView = require('../MyView'),
    GetData = function() { return MyView.apply( this, arguments ) }

Object.assign( GetData.prototype, MyView.prototype, {

    dataTables: [],

    getData( table ) {        
        this.collections[ table.name ] = new ( this.Collection.extend( { comparator: table.comparator, url: this.util.format("/%s", table.name ) } ) )()
        this.collections[ table.name ].fetch().then( () => this.collections[ table.name ].models.forEach( model => {
            this.templateData[ table.name ].append( this.templates[ table.name ]( model.attributes ) )
        }
        ) )
        .fail( err => new this.Error(err) )       
    },

    postRender() {
        this.collections = { }
        this.dataTables.forEach( table => this.getData( table ) )
    },

} )

module.exports = GetData