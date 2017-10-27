module.exports = {

    Views: require('../../models/Views'),

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

    loadViewData() {
        this.Views.get( { query: { label: this.name } } )
        .then( () => {
            console.log( this.Views.data )
            this.processDataLayer( null, this.Views.data )



        } )
        .catch( this.Error )
    },

    processDataLayer( name, data ) {
        console.log( 'processDataLayer' )
        console.log( data )
        Object.keys( data ).forEach( key => {
            const val = data[ key ]
            console.log( key )
            console.log( val )
            console.log( typeof val )
            if( typeof val === 'object' ) return Array.isArray( val ) ? this.insertArrayData( name, key, val ) : this.processDataLayer( key, val )
            if( this.els[ key ] ) return this.els[ key ].textContent = data[ key ]
            //if( this.templates[ key ] ) return this.slurpTempl
            if( this.nameToTagName[ key ] ) {
                console.log( 'isHeading' )
                console.log( this.els[ name ].querySelector( this.nameToTagName[ key ] ) )
                this.els[ name ].querySelector( this.nameToTagName[ key ] ).textContent = data[ key ]
            }


        } )
    },

    insertArrayData( insertionName, key, data ) {
        console.log( 'insertArrayData' )
        console.log( insertionName )
        console.log( key )
        console.log( data )
        data.forEach( datum =>
            this.slurpTemplate( {
                insertion: { el: this.els[ insertionName ] },
                template: `<${this.nameToTagName[ key ]}>${this.parseText( datum )}</${this.nameToTagName[ key ]}>`
            } )
        )
    },

    nameToTagName: {
        heading: 'h2',
        description: 'p',
        paragraphs: 'p'
    },

    parseText( text ) {
        let start = text.indexOf('{{'),
            end, rest, target, key, value, replacement

        if( start === -1 ) return text

        rest = text.slice( start )
        target = rest.slice( 0, rest.indexOf('}') + 2 )
        key = target.slice( 2, target.indexOf(':') )
        value = target.slice( target.indexOf(':') + 1, target.indexOf('}') )

        replacement = /email/i.test( target )
            ? `<a href="mailto:${value}" class="link">${key}</a>`
            : /http/.test( value )
                ? `<a href="${value}" class="link">${key}</a>`
                : `<span data-js="link" data-name="${value}" class="link">${key}</span>`

        return this.parseText( text.replace( target, replacement ) )
    },

    postRender() {
        if( this.tables.length ) {
            this.models = { }
            this.tables.forEach( table => this.loadTableData( table ) )
        }

        this.loadViewData()

        return this
    },

    tables: [ ]

}