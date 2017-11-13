module.exports = {

    Pages: Object.create( require('../../models/__proto__'), { resource: { value: 'Pages' } } ),

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
            }
        } )
        .catch( this.Error )       
    },

    processObject( name, data ) {
        Object.keys( data ).forEach( key => {
            const val = data[ key ]

            if( typeof val === 'object' ) return Array.isArray( val ) ? this.insertArrayData( name, key, val ) : this.processObject( key, val )

            if( this.els[ key ] ) return /image/i.test( key )
                ? this.slurpTemplate( {
                    insertion: { el: this.els[ key ] },
                    template: `<img data-src="${this.Format.ImageSrc( data[ key ] )}" />`
                  } )
                : this.els[ key ].innerHTML = this.Format.ParseTextLinks( data[ key ] )

            if( this.nameToTagName[ key ] ) {
                this.els[ name ].querySelector( this.nameToSelector[ key ] || this.nameToTagName[ key ] ).innerHTML = this.Format.ParseTextLinks( data[ key ] )
            }

        } )
    },

    insertArrayData( sectionName, key, data ) {
        const el = this.els[ key ] || this.els[ sectionName ]

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

    onLinkClick( el ) {
        if( !el.hasAttribute('data-name') ) return
        this.emit( 'navigate', el.getAttribute('data-name') )
    },

    postRender() {
        if( this.tables.length ) {
            this.models = { }
            this.tables.forEach( table => this.loadTableData( table ) )
        }

        this.Pages.get( { query: { name: this.documentName } } )
        .then( () => {
            this.processObject( null, this.Pages.data )
            this.els.container.querySelectorAll('.link').forEach( el => el.addEventListener( 'click', () => this.onLinkClick( el ) ) )
        } )
        .catch( this.Error )

        return this
    },

    tables: [ ]

}