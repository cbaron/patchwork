module.exports = {

    Pages: Object.create( require('../../models/__proto__'), { resource: { value: 'Pages' } } ),

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
        console.log( 'loadTableData' )
        console.log( table )
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

    processObject( name, data ) {
        console.log( 'processObject' )
        console.log( name )
        console.log( data )
        Object.keys( data ).forEach( key => {
            const val = data[ key ]
            console.log( key )
            console.log( val )
            console.log( typeof val )
            if( typeof val === 'object' ) return Array.isArray( val ) ? this.insertArrayData( name, key, val ) : this.processObject( key, val )

            if( this.els[ key ] ) return /image/i.test( key )
                ? this.slurpTemplate( {
                    insertion: { el: this.els[ key ] },
                    template: `<img data-src="${this.Format.ImageSrc( data[ key ] )}" />`
                  } )
                : this.els[ key ].innerHTML = this.Format.ParseTextLinks( data[ key ] )

            if( this.nameToTagName[ key ] ) {
                console.log( 'isHeading' )
                console.log( this.els[ name ].querySelector( this.nameToSelector[key] || this.nameToTagName[ key ] ) )
                this.els[ name ].querySelector( this.nameToSelector[ key ] || this.nameToTagName[ key ] ).innerHTML = this.Format.ParseTextLinks( data[ key ] )
            }


        } )
    },

    insertArrayData( sectionName, key, data ) {
        console.log( 'insertArrayData' )
        console.log( sectionName )
        console.log( key )
        console.log( data )
        const el = this.els[ key ] || this.els[ sectionName ]
        console.log( el )
        data.forEach( datum =>
            this.slurpTemplate( {
                insertion: { el },
                template: `<${this.nameToTagName[ key ] || 'li'}>${this.Format.ParseTextLinks( datum )}</${this.nameToTagName[ key ] || 'li'}>`
            } )
        )
    },

    nameToSelector: {
        heading: 'h2, h3, h4'
    },

    nameToTagName: {
        heading: 'h2',
        description: 'p'
    },

    postRender() {
        console.log( 'custom content postRender' )
        console.log( this.name )
        console.log( this.documentName )
        if( this.tables.length ) {
            this.models = { }
            this.tables.forEach( table => this.loadTableData( table ) )
        }

        this.Pages.get( { query: { name: this.documentName } } )
        .then( () => {
            console.log( this.Pages.data )
            this.processObject( null, this.Pages.data )
        } )
        .catch( this.Error )

        return this
    },

    tables: [ ]

}