module.exports = {

    loadImageTable( table, model ) {
        return new Promise( ( resolve, reject ) => {
            const imageEl = new Image()
            imageEl.src = this.Format.ImageSrc( `${table.name}-${model.id}` )
            imageEl.onload = () => {
                model.tableName = table.name

                this.slurpTemplate( {
                    insertion: { el: this.els[ table.el ] },
                    template: this.templates[ table.template ]( model )
                } )

                this.emit( `inserted${table.name}Template` )

                resolve()
            }
        } )     
    },

    loadTableData( table ) {
        this.models[ table.name ] = Object.create( require('../../models/__proto__'), { resource: { value: table.name } } )
        
        this.models[ table.name ].get().then( () => {
            if( table.image ) {
                let promise = Promise.resolve()
                this.models[ table.name ].data.forEach( model => promise = promise.then( () => this.loadImageTable( table, model ) ) )
                return promise
            } else {
                this.models[ table.name ].data.forEach( model =>
                    this.slurpTemplate( {
                        insertion: { el: this.els[ table.el ] },
                        template: this.templates[ table.template ]( model )
                    } )
                )

                this.emit( `inserted${table.name}Template` )
            }

        } )
        .catch( this.Error )       
    },

    postRender() {
        this.models = { }
        this.tables.forEach( table => this.loadTableData( table ) )

        return this
    },

    tables: [ ]

}