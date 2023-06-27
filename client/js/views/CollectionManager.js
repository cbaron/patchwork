module.exports = Object.assign( { }, require('./__proto__'), {

    model: require('../models/CollectionManager'),

    Collection: require('../models/Collection'),
    DocumentModel: require('../models/Document'),

    Templates: {
        Document: require('./templates/Document')
    },

    Views: {

        collections() {
            return {
                events: {
                    list: 'click'
                },
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.Collection ),
                    delete: false,
                    fetch: true
                } ),
                itemTemplate: collection => `<span>${collection.label || collection.name}</span>`,
                templateOpts: { heading: 'Collections', name: 'Collections', toggle: true }
            }
        },

        /*createCollection() {
            return {
                insertion: { el: this.els.mainPanel },
                model: Object.create( this.Collection ).constructor(),
                templateOpts: { heading: 'Create Collection' }
            }
        },

        deleteCollection( model ) {
            return {
                insertion: { el: this.els.mainPanel },
                model: Object.create( this.Collection ).constructor( model ),
                templateOpts: { message: `Delete "${model.name}" Collection?` }
            }
        },*/

        deleteDocument( document ) {
            const collectionName = this.model.git('currentCollection'),
                collection = this.views.collections.collection.store.name[ collectionName ],
                meta = this.model.meta[ collectionName ] || { },
                schema = collection.schema

            return {
                insertion: { el: this.els.mainPanel },
                model: Object.create( this.DocumentModel ).constructor( document, {
                    meta: { key: collection.key },
                    resource: collectionName
                } ),
                templateOpts: { message: `<div><span>Delete </span>${this.getDisplayValue( meta, document, schema )}<span> from ${collectionName}?</span></div>` },
                toastSuccess: 'Item deleted.'
            }
        },

        documentList() {
            const collectionName = this.model.git('currentCollection'),
                collection = this.views.collections.collection.store.name[ collectionName ],
                meta = this.model.meta[ collectionName ] || { },
                schema = collection.schema

            return {
                model: Object.create( this.Model ).constructor( Object.assign ( {
                    add: true,
                    collection: Object.create( this.DocumentModel ).constructor( [ ], {
                        meta: { key: collection.key },
                        resource: collectionName
                    } ),
                    delete: true,
                    pageSize: 500,
                    skip: 0,
                    sort: { 'label': 1 },
                    scrollPagination: true
                }, meta ) ),
                events: { list: 'click' },
                insertion: { el: this.els.mainPanel },
                itemTemplate: datum => this.getDisplayValue( meta, datum, schema )
            }
        },

        documentView( model ) {
            return {
                disallowEnterKeySubmission: true,
                insertion: { el: this.els.mainPanel },
                model,
                templateOpts() {
                    return Object.assign( { heading: model.heading }, model.meta.templateOptions )
                },
                Views: {
                    typeAhead: {
                        Type: 'Document',
                        templateOpts: { hideSearch: true }
                    }
                }
            }
        }

    },

    events: {
        createCollectionBtn: 'click',
        backBtn: 'click',
        resource: 'click',

        views: {
            collections: [
                [ 'deleteClicked',
                  function( collection ) {
                      this.clearCurrentView()
                      .then( () => Promise.resolve( this.createView( 'deleter', 'deleteCollection', collection ) ) )
                      .catch( this.Error )
                  }
                ],
                [ 'fetched', function() {
                    this.views.collections.hideItems( [ this.model.git('currentCollection') ] )
                } ],
                [ 'itemClicked', function( model ) {
                    this.clearCurrentView()
                    .then( () => Promise.resolve( this.model.set( 'currentCollection', model.name ) ) )
                    .catch( this.Error )
                } ],
                [ 'successfulDrop', function( data ) {
                    this.swapDocument( { document: data.dropped, to: data.droppedOn.name, from: this.model.git('currentCollection' ) } )
                    .catch( this.toastError.bind(this) )
                } ]
            ],
            /*createCollection: [
                [ 'deleted', function() { this.model.set( 'currentView', 'documentList' ) } ],
                [ 'posted', function( collection ) { this.views.collections.add( collection ) } ]
            ],
            deleteCollection: [
                [ 'deleted', function() { this.model.set('currentView', 'documentList' ) } ],
                [ 'modelDeleted', function( model ) { this.views.collections.remove( model ) } ]
            ],*/
            deleteDocument: [
                [ 'deleted', function() { this.model.set('currentView', 'documentList' ) } ],
                [ 'modelDeleted', function( model ) {
                    this.views.documentList.remove( model )
                    this.views.documentList.getCount().then( count => this.updateCount(count) ).catch(this.Error)
                } ]
            ],
            documentList: [
                [ 'addClicked', function() {
                    this.clearCurrentView()
                    .then( () =>
                        Promise.resolve(
                            this.createView(
                                'form',
                                'documentView',
                                this.createDocumentModel()
                            )
                        )
                    )
                    .catch( this.Error )
                  }
                ],
                [ 'itemClicked', function( document ) { this.onDocumentSelected( document ) } ],
                //[ 'dragStart', function( type ) { this.views.collections.showDroppable( type ) } ],
                //[ 'dropped', function( data ) { this.views.collections.hideDroppable(); this.views.collections.checkDrop( data ) } ],
                [ 'deleteClicked',
                  function( document ) { 
                    this.clearCurrentView()
                    .then( () => {
                        this.createView( 'deleter', 'deleteDocument', document )
                        return Promise.resolve( window.scrollTo( 0, 0 ) )
                    } )
                    .catch( this.Error )
                  }
                ]
            ],
            documentView: [
                [ 'deleted', function( model ) { this.model.set( 'currentView', 'documentList' ) } ],
                [ 'put', function( model ) {
                    if( this.views.documentList.fetched ) this.views.documentList.updateItem( this.createDocumentModel( model ) )
                    this.clearCurrentView().then( () => Promise.resolve( this.model.set('currentView', 'documentList') ) ).catch(this.Catch)

                } ],
                [ 'posted', function( model ) {
                    if( this.views.documentList.fetched ) this.views.documentList.add( model, true )
                    this.clearCurrentView().then( () => Promise.resolve( this.model.set('currentView', 'documentList') ) ).catch(this.Catch)
                } ]
            ]

        }
    },

    cachedTables: [ 'deliveryoption', 'deliveryroute', 'groupdropoff', 'producefamily', 'seasonalAddOn', 'share', 'shareoption' ],
    
    clearCurrentView() {
        const currentView = this.model.git('currentView');

        return ( currentView !== 'documentList'
            ? this.views[ currentView ].delete( { silent: true } )
            : this.views[ currentView ].hide()
        )
    },

    createDocumentList( collectionName, fetch=true ) {
        this.createView( 'list', 'documentList' )
        this.views.documentList.getCount().then( count => this.updateCount(count) ).catch(this.Error)
        return this.views.collections.unhideItems().hideItems( [ this.model.git('currentCollection') ] )
    },

    createDocumentModel( data={} ) {
        const collectionName = this.model.git('currentCollection'),
            collection = this.views.collections.collection.store.name[ collectionName ],
            meta = Object.assign( this.model.meta[ collectionName ] || { }, { noPlaceholder: true, key: collection.key } )

        let schema = this.model.git('currentCollection') === 'Pages'
            ? collection[ data.name ]
            : collection.schema

        schema.attributes.forEach( attr => {
            if( attr.range === 'Geography' && data[ attr.name ] && !Array.isArray( data[ attr.name ] ) ) data[ attr.name ] = JSON.parse( data[ attr.name ] ).coordinates
            if( attr.fk ) {
                if( !meta.validate ) meta.validate = { }
                meta.validate[ attr.columnName ] = val => val !== undefined
                attr.error = `${attr.fk} is a required field.`
            }
            if( meta.validate && meta.validate[ attr.name || attr.columnName ] ) attr.validate = meta.validate[ attr.name || attr.columnName ]
        } )

        return Object.create( this.Model ).constructor(
            data,
            Object.assign( {
                meta,
                resource: collectionName,
                heading: this.getDisplayValue( meta, data, schema )
            },
                schema
            )
        )
    },

    createView( type, name, model ) {
        this.views[ name ] = this.factory.create( type, Reflect.apply( this.Views[ name ], this, [ model ] ) )

        if( this.events.views[ name ] ) this.events.views[ name ].forEach(
            arr => this.views[ name ].on( arr[0], eventData =>
                Reflect.apply( arr[1], this, [ eventData ] )
            )
        )

        this.model.set( 'currentView', name )
    },

    getDisplayValue( meta, datum, schema ) {
        if( !Object.keys( datum ).length ) return `<div>New ${this.model.git('currentCollection')}</div>`
        if( this.Templates[ meta.displayAttr ] ) return this.Templates[ meta.displayAttr ]( datum )

        let value

        if( meta.displayAttr ) {
            value = meta.displayAttr.map( attr => {
                const fkColumn = schema.attributes.find( schemaAttr => schemaAttr.fk === attr )

                if( fkColumn ) {
                    if( !this[ attr ].store.id[ datum[ fkColumn.columnName ] ] ) return `No ${fkColumn.fk} value chosen`
                    return this[ attr ].store.id[ datum[ fkColumn.columnName ] ].label || this[ attr ].store.id[ datum[ fkColumn.columnName ] ].name
                }

                return attr === 'createdAt'
                    ? this.Format.Moment.utc( datum[ meta.displayAttr ] ).format('YYYY-MM-DD hh:mm:ss')
                    : datum[ attr ]

            } ).join(' -- ')
        } else {
            value = datum.label || datum.name
        }

        return `<div><span>${value}</span></div>`
    },

    getDocument( collection, value ) {
        const query = Number.isNaN( +value ) ? { name: value } : { id: value }

        return Object.create( this.Model ).constructor( {}, { resource: collection } ).get( { query } )
        .then( document => Promise.resolve( document.length === 1 ? document[0] : document ) )
    },

    onBackBtnClick() { this.emit( 'navigate', '/admin-plus' ) },

    onCreateCollectionBtnClick() {
        this.clearCurrentView()
        .then( () => Promise.resolve( this.createView( 'form', 'createCollection' ) ) )
        .catch( this.Error )
    },

    onDocumentSelected( document ) {
        return this.clearCurrentView()
        .then( () => Promise.resolve( this.showDocumentView( document ) ) )
        .catch( this.Error )
    },

    onNavigation( path ) {

        this.path = path;

        ( this.isHidden() ? this.show() : Promise.resolve() )
        .then( () => this.clearCurrentView() )
        .then( () => this.showProperView( false ) )
        .catch( this.Error ) 
    },

    onResourceClick() {
        if( this.model.git('currentView') === 'documentList' ) return

        this.clearCurrentView()
        .then( () => Promise.resolve( this.model.set('currentView', 'documentList') ) )
        .catch( this.Error )
    },

    postRender() {
        if( this.path.length > 0 ) this.model.set( 'currentCollection', this.path[0] )

        this.model.on( 'currentCollectionChanged', () =>
            this.views.documentList.delete( { silent: true } )
            .then( () => this.createDocumentList( this.model.git( 'currentCollection') ) )
            .catch( this.Error )
        )

        this.model.on( 'currentViewChanged', () => {
            const currentView = this.model.git('currentView'),
                currentCollection = this.model.git('currentCollection'),
                path = currentView === 'documentView'
                    ? `/${currentCollection}/${this.views.documentView.model.git('name') || this.views.documentView.model.git('id') || 'new-item'}`
                    : currentView === 'documentList'
                        ? `/${currentCollection}`
                        : ``
            
            this.emit( 'navigate', `/admin-plus/collection-manager${path}`, { silent: true } );

            ( currentView === 'documentList' && this.views.documentList.collection.data.length === 0 ? this.views.documentList.fetch() : Promise.resolve() )
            .then( () => this.views[ currentView ].show() )
            .catch( this.Error )
        } )

        Promise.all( this.cachedTables.map( name => {
            this[ name ] = Object.create( this.Model ).constructor( { }, { resource: name } )
            return this[ name ].get( { storeBy: ['id'] } )
        } ) )
        .then( () => this.showProperView( true ) )
        .catch( this.Error )

        return this
    },

    showDocumentView( document ) {
        this.createView(
            'form',
            'documentView',
            this.createDocumentModel( document )
        )
    },

    showProperView() {
        const path = this.path

        if( path.length && path[0] !== this.model.git('currentCollection') ) return Promise.resolve( this.model.set( 'currentCollection', path[0] ) )

        return ( this.views.documentList ? Promise.resolve() : this.createDocumentList( this.model.git('currentCollection'), this.path.length === 2 ? false : true ) )
        .then( () =>
            path.length === 2 && path[1] !== 'new-item'
                ? this.getDocument( path[0], path[1] )
                  .then( document =>
                    Array.isArray( document )
                      ? Promise.resolve( this.model.set( 'currentView', 'documentList' ) )
                      : this.clearCurrentView().then( () => Promise.resolve( this.showDocumentView( document, false ) ) ).catch( this.Error )
                   )
                : Promise.resolve( this.model.git('currentView') === 'documentList' ? `` : this.model.set( 'currentView', 'documentList' ) )
        )
        .catch( this.Error )
    },

    swapDocument( { document, to, from } ) {
        return this.Xhr( { method: 'PATCH', resource: 'Document', id: document._id, data: JSON.stringify( { to, from } ) } )
        .then( () => Promise.resolve( this.views.documentList.remove( document ) ) )
    },

    toastError(e) {
        this.Error(e);
        this.Toast.showMessage( 'error', `Something went wrong. Please try again or contact Chris.` )
    },

    updateCount( count ) {
        const collection = this.views.collections.collection.store.name[ this.model.git('currentCollection') ]
        this.els.resource.textContent = `${collection.label || collection.name} (${count})`
    }

} )
