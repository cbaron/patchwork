const Super = require('./__proto__')

module.exports = Object.assign( { }, Super, {

    add( datum={} ) {
        this.createItemViews( [ datum ] )
        this.itemViews[ this.itemViews.length - 1 ].els.container.scrollIntoView( { behavior: 'smooth' } )
        this.updateStyle()
    },

    clearItemViews() {
        this.els.list.innerHTML = '';
        this.itemViews = [];
    },

    createItemViews( data ) {
        const fragment =
            data.reduce(
                ( fragment, datum ) => {
                    const opts = {
                        model: Object.create( this.Model ).constructor( datum, {
                            attributes: this.model.git('range'),
                            meta: this.collection.meta
                        } ),
                        templateOpts: { delete: true, hideButtonRow: true }
                    }

                    const view = this.factory.create( this.viewName, Object.assign( opts, { storeFragment: true } ) )
                        .on( 'deleted', () => this.onItemViewDeleted( view ) )

                    this.itemViews.push( view )
                    this.emit( 'itemAdded', view )

                    while( view.fragment.firstChild ) fragment.appendChild( view.fragment.firstChild )
                    return fragment
                },
                document.createDocumentFragment()
            )

        this.els.list.appendChild( fragment )
    },

    events: {
        addBtn: 'click'
    },

    async fetch() {
        this.fetching = true

        const query = this.model.git('sort') ? { sort: this.model.git('sort') } : {};
        const newData = await this.collection.get({ query });
        this.populateList(newData)
        this.fetched = true
        this.fetching = false
        this.emit('fetched')
    },

    onAddBtnClick( e ) { this.add() },

    onItemViewDeleted( view ) {
        const viewIndex = this.itemViews.indexOf( view )
        this.itemViews.splice( viewIndex, 1 )
        this.els.container.scrollIntoView( { behavior: 'smooth' } )
        this.updateStyle()

        this.emit( 'itemDeleted', view )
    },

    populateList(data) {
        data = data || this.collection.data

        if( !Array.isArray( data ) ) data = [ data ]
        if( !data.length ) return

        this.createItemViews( data )
    },

    postRender() {
        this.viewName = this.model.git('view')
        this.itemViews = [ ]
        this.collection = this.model.git('collection') || Object.create( this.Model )

        if( this.model.git('fetch') ) this.fetch().catch(this.Error)

        if( this.collection.data.length ) this.populateList()
        this.updateStyle()

        return this
    },

    reduceToOne() {
        return this.itemViews.length > 1
            ? Promise.all( this.itemViews.slice(1).map( itemView => itemView.delete() ) ).catch( this.Error )
            : Promise.resolve()
    },

    updateStyle() {
        if( !this.model.git('delete') ) return

        this.els.container.classList.toggle( 'can-delete', this.itemViews.length > 1 )

        this.itemViews.forEach( view =>
            view.els.deleteBtn.classList.toggle( 'fd-hidden', this.itemViews.length === 1 )
        )
    }

} )