var MyView = require('../MyView'),
    ListView = function() { return MyView.apply( this, arguments ) };

Object.assign( ListView.prototype, MyView.prototype, {

    addItem: function( model ) {
        this.itemViews[ model.id ] =
            new this.ItemView(
                Object.assign( { container: this.templateData.container, model: model, selection: this.selection }, this.getItemViewOptions() ) )
            .on( 'removed', () => delete this.itemViews[ model.id ] )

        if( this.selection ) this.itemViews[ model.id ].on( 'clicked', model => this.onItemClick( model ) )
        this.emit( 'itemAdded', model )
    },

    getClosestClickedIndex: function( model ) {
        var clickedIndex = this.items.indexOf( model ),
            closest = undefined,
            maxDistance = 0,
            selectedIndexes = Object.keys( this.selectedItems ).map( memberId => this.items.indexOf( this.items.get(memberId) ) ).sort()

        selectedIndexes.forEach( index => {
            var distance = Math.abs( index - clickedIndex )
            if( distance > maxDistance ) { maxDistance = distance; closest = index; }
        } )

        return closest
    },

    getItemViewOptions: function() { return {} },

    handleKeydown: function( e ) {

        this.pressedKey = ( e.which === 16 )
            ? 'shift'
            : ( e.which === 17 || e.which === 91 )
                ? 'ctrl'
                : undefined
    },
    
    handleKeyup: function( e ) {

        this.pressedKey = ( e.which === 16 && this.pressedKey === 'shift' )
            ? undefined
            : ( ( e.which === 17 || e.which === 91 ) && this.pressedKey === 'ctrl' )
                ? undefined
                : this.pressedKey
    },

    noItemCheck: function() {
        var container = this.getItemViewOptions().container || this.templateData.container
        if( this.items.length === 0 ) container.addClass('no-items')
        else container.removeClass('no-items')
    },

    onItemClick: function( model ) {
        var method = this.util.format( '%sselectItem',
                ( this.itemViews[ model.id ].templateData.container.hasClass('selected') && Object.keys( this.selectedItems ).length === 1 ) ? 'un' : '' )

        this[ method ]( model )
    },

    postRender() {

        var extension = { }

        if( this.selection === 'multi' ) {

            this.$(document)
                .on( 'keydown', this.handleKeydown.bind(this) )
                .on( 'keyup', this.handleKeyup.bind(this) )

            window.addEventListener( "blur", e => this.pressedKey = undefined )
            window.addEventListener( "focus", e => this.pressedKey = undefined )
        } 

        this.itemViews = []
        this.selectedItems = { }
        
        this.items =
            new ( this.Collection.extend( this.collection || {} ) )()
            .on( 'reset', () => {
                var listContainer = this.getItemViewOptions().container || this.templateData.container 
                listContainer.empty()
                this.itemViews = []
                this.items.forEach( item => this.addItem( item ) )
                this.noItemCheck()
            } )

            .on( 'add', item => this.addItem( item ) )

            .on( 'remove', item => {
                if( this.itemViews[ item.id ].templateData.container.hasClass('selected') ) this.unselectItem( item )
                this.itemViews[ item.id ].templateData.container.remove()
            })

            .on( 'update', () => this.noItemCheck() )
            .on( 'sort', () => this.reOrderDOM() )

        if( this.fetch ) {
            this.Q( this.items.fetch( { headers: this.fetch.headers } ) )
            .fail( err => console.log( 'Error fetching collection : ' + this.url + " -- " + err.stack ||err ) )
            .done()
        }
    },

    removeItem: function( model ) {
        this.itemViews[ model.id ].delete()
        this.emit( 'itemRemoved', model )
    },

    reOrderDOM: function() {
        var container = this.getItemViewOptions().container || this.templateData.container
        this.items.map( item ) => 
            container[ ( this.reverseSort ) ? 'prepend' : 'append' ]( this.itemViews[item.id].templateData.container )
        )
    },

    scrollToBottom: function() {
        var height

        var intervalId = setInterval( function() {
            var newHeight = this.templateData.container.outerHeight( true );
            if( height === newHeight ){    
                clearInterval( intervalId );
                this.container.scrollTop( this.container.prop('scrollHeight') )
            } else {
                height = this.templateData.container.outerHeight( true );
            }
        }.bind(this), 100);

    },

    selectItem: function( model ) {
        var selectedIds = Object.keys( this.selectedItems )

        if( this.pressedKey === undefined ) selectedIds.forEach( memberId => this.unselectItem( this.selectedItems[ memberId ] ) ) 
       
        if( this.pressedKey === 'shift' && selectedIds.length ) { 
            let end = this.getClosestClickedIndex( model ),
                start = this.items.indexOf( model )

            this._.range( start, end, ( start < end ) ? 1 : -1 ).forEach( index => {
                var itemToSelect = this.items.at( index )
                this.itemViews[ itemToSelect.id ].templateData.container.addClass('selected')
                this.selectedItems[ itemToSelect.id ] = itemToSelect
                this.emit( 'itemSelected', itemToSelect )
            } )

        } else {
            this.itemViews[ model.id ].templateData.container.addClass('selected')
            this.selectedItems[ model.id ] = model
            this.emit( 'itemSelected', model )
        }
    },

    unselectItem: function( model ) {

        this.itemViews[ model.id ].templateData.container.removeClass('selected')

        delete this.selectedItems[ model.id ]
        
        this.emit( 'itemUnselected', model )
    }

} );

module.exports = ListView
