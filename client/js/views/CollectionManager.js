module.exports = Object.assign( { }, require('./__proto__'), {

    model: require('../models/CollectionManager'),

    Collection: require('../models/Collection'),
    DocumentModel: require('../models/Document'),
    JsonPropertyModel: require('../models/JsonProperty'),
    //WebSocket: require('../WebSocket'),

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
                itemTemplate: collection => `<span>${collection.name}</span>`,
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
            return {
                insertion: { el: this.els.mainPanel },
                model: Object.create( this.DocumentModel ).constructor( document, { resource: this.model.git('currentCollection') } ),
                templateOpts: { message: `Delete "${document.label || document.name}" from ${this.model.git('currentCollection')}?` }
            }
        },

        documentList( model ) {
            return {
                model: Object.create( this.Model ).constructor( Object.assign( model, {
                    collection: Object.create( this.DocumentModel ).constructor( [ ], { resource: this.model.git('currentCollection') } ),
                    isDocumentList: true,
                    pageSize: 100,
                    skip: 0,
                    sort: { 'label': 1 },
                    scrollPagination: true
                } ) ),
                events: { list: 'click' },
                insertion: { el: this.els.mainPanel },
                itemTemplate: this.Templates.Document
            }
        },

        documentView( model ) {
            return {
                disallowEnterKeySubmission: true,
                insertion: { el: this.els.mainPanel },
                model,
                templateOpts: { heading: model.git('label') || model.git('name') },
                Views: { }
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
                    this.showProperView( true )
                    .then( () => this.views.collections.hideItems( [ this.model.git('currentCollection') ] ) )
                    .catch( this.Error )
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
                                this.createModel( 'documentView' )
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
                    .then( () => Promise.resolve( this.createView( 'deleter', 'deleteDocument', document ) ) )
                    .catch( this.Error )
                  }
                ]
            ],
            documentView: [
                [ 'deleted', function( model ) { this.model.set( 'currentView', 'documentList' ) } ],
                [ 'put', function( model ) {
                    if( this.views.documentList.fetched ) this.views.documentList.updateItem( this.createModel( 'documentView', model ) )
                    this.clearCurrentView().then( () => Promise.resolve( this.model.set('currentView', 'documentList') ) ).catch(this.Catch)

                } ],
                [ 'posted', function( model ) {
                    if( this.views.documentList.fetched ) this.views.documentList.add( model, true )
                    this.clearCurrentView().then( () => Promise.resolve( this.model.set('currentView', 'documentList') ) ).catch(this.Catch)
                } ]
            ]

        }
    },
    
    clearCurrentView() {
        const currentView = this.model.git('currentView');

        return ( currentView !== 'documentList'
            ? this.views[ currentView ].delete( { silent: true } )
            : this.views[ currentView ].hide()
        )
    },

    createDocumentList( collectionName, fetch=true ) {
        const model = this.createModel( 'documentList' )

        this.createView( 'list', 'documentList', model )
        this.views.documentList.getCount().then( count => this.updateCount(count) ).catch(this.Error)
        return this.views.collections.unhideItems().hideItems( [ this.model.git('currentCollection') ] )
    },

    createModel( type, data={} ) {
        const collection = this.views.collections.collection.store.name[ this.model.git('currentCollection') ]

        if( type === 'documentList' ) return collection.clientData

        const schema = this.model.git('currentCollection') === 'Pages'
                ? collection.documents.find( doc => doc.name === data.label.replace( ' ', '' ) ).schema
                : collection.schema

        return Object.create( this.Model ).constructor(
            data,
            Object.assign( { resource: this.model.git('currentCollection') }, schema )
        )
    },

    createView( type, name, model ) {
        this.views[ name ] = this.factory.create( type, Reflect.apply( this.Views[ name ], this, [ model ] ) )

        if( this.events.views[ name ] ) this.events.views[ name ].forEach( arr => this.views[ name ].on( arr[0], eventData => Reflect.apply( arr[1], this, [ eventData ] ) ) )
        this.model.set( 'currentView', name )
    },

    getDocument( collection, documentName ) {
        return Object.create( this.Model ).constructor( {}, { resource: this.path[0] } ).get( { query: { name: this.path[1] } } )
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
                    ? `/${currentCollection}/${this.views.documentView.model.git('name')}`
                    : currentView === 'documentList'
                        ? `/${currentCollection}`
                        : ``
            
            this.emit( 'navigate', `/admin-plus/collection-manager${path}`, { silent: true } );
            console.log( 'currentViewChanged' )
            console.log( currentView )
            console.log( this.views.documentList.collection.data )
            console.log( currentView === 'documentList' && this.views.documentList.collection.data.length === 0 );
            ( currentView === 'documentList' && this.views.documentList.collection.data.length === 0 ? this.views.documentList.fetch() : Promise.resolve() )
            .then( () => this.views[ currentView ].show() )
            .catch( this.Error )
        } )

        return this
    },

    showDocumentView( document ) {
        this.createView(
            'form',
            'documentView',
            this.createModel( 'documentView', document )
        )
    },

    showProperView() {
        console.log( 'showProperView' )
        console.log( this.path )
        console.log( this.views.documentList )
        console.log( this.model.git('currentCollection') )
        return (this.views.documentList ? Promise.resolve() : this.createDocumentList( this.model.git('currentCollection'), this.path.length === 2 ? false : true ) )
        .then( () =>
            this.path.length === 2
                ? this.getDocument()
                  .then( document =>
                  Array.isArray( document )
                      ? Promise.resolve( this.model.set( 'currentView', 'documentList' ) )
                      : this.clearCurrentView().then( () => Promise.resolve( this.showDocumentView( document, false ) ) ).catch( this.Catch )
                  )
            : Promise.resolve( this.model.set( 'currentView', 'documentList' ) )
        )
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
        this.els.resource.textContent = `${this.model.git('currentCollection')} (${count})`
    }

} )
