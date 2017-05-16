var MyView = require('../MyView'),
    CustomContent = function() { return MyView.apply( this, arguments ) }

Object.assign( CustomContent.prototype, MyView.prototype, {

    loadImageTable( table, model ) {
        return new Promise( ( resolve, reject ) => {
            var imageEl = new Image();
            imageEl.src = `/file/${table.name}/image/${model.id}`
            imageEl.onload = () => {
                model.set( 'tableName', table.name )
                if( table.name === "carousel" && model.get('position') === 1 ) model.set( 'first', true )
                this.templateData[ table.el ].append( this.templates[ table.template ]( model.attributes ) )
                this.emit( `inserted${table.name}Template` )
                resolve()
            }
        } )     
    },

    loadTableData( table ) {
        this.collections[ table.name ] = new ( this.Collection.extend( { comparator: table.comparator, url: `/${table.name}` } ) )()
        this.collections[ table.name ].fetch().then( () => {

            if( table.image ) {
                let promise = Promise.resolve()
                this.collections[ table.name ].forEach( model => promise = promise.then( () => this.loadImageTable( table, model ) ) )
                return promise
            } else {
                this.collections[ table.name ].forEach( model =>
                    this.slurpTemplate( {
                        insertion: { $el: this.templateData[ table.el ] },
                        template: this.templates[ table.template ]( model.attributes )
                    } )
                )
                this.emit( `inserted${table.name}Template` )
            }

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
