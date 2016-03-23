var MyView = require('../MyView'),
    CustomContent = function() { return MyView.apply( this, arguments ) }

Object.assign( CustomContent.prototype, MyView.prototype, {

    loadImageTable( table, model ) {
        return new Promise( ( resolve, reject ) => {
            var imageEl = new Image();
            imageEl.src = this.util.format( '/file/%s/image/%s', table.name, model.id )
            imageEl.onload = () => {
                model.set( 'tableName', table.name )
                this.templateData[ table.el ].append( this.templates[ table.template ]( model.attributes ) )
                resolve()
            }
        } )     
    },

    loadTableData( table ) {        
        this.collections[ table.name ] = new ( this.Collection.extend( { comparator: table.comparator, url: this.util.format("/%s", table.name ) } ) )()
        this.collections[ table.name ].fetch().then( () => {

            if( table.image ) {
                var promiseChain = new Promise( ( resolve, reject ) => resolve() )
                this.collections[ table.name ].models.forEach( model => promiseChain = promiseChain
                    .then( () => this.loadImageTable( table, model ) ) )
            } else {
                this.collections[ table.name ].models.forEach( model => 
                    this.templateData[ table.el ].append( this.templates[ table.template ]( model.attributes ) )
            ) }

        } )
        .fail( err => new this.Error(err) )       
    },

    postRender() {
        this.collections = { }
        this.tables.forEach( table => this.loadTableData( table ) )
    },

    tables: [ ]

} )

module.exports = CustomContent