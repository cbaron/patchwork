var ListView = require('./ListView'),
    TableView = function() { return ListView.apply( this, arguments ) }

Object.assign( TableView.prototype, ListView.prototype, {

    collections: false,

    events: {
        'selectAllBtn': { event: 'click', method: 'selectAll' },
        'clearBtn': { event: 'click', method: 'clearSelection' },
        'header': { event: 'click', selector: 'th', method: 'sortByHeader' }
    },

    fields: [
        { name: 'name', label: 'Name' },
        { name: 'condition', label: 'Condition' },
        { name: 'gender', label: 'Gender' },
        { name: 'humanElapsed', label: 'Elapsed' },
        { class: 'status', name: 'unreadMessages', label: 'Status' }
    ],

    getItemViewOptions: function() {
        return { container: this.templateData.body, fields: this.fields }
    },

    getTemplateOptions: function() { return { fields: this.fields } },

    inMessage: function( memberid ) {
        
        var member = this.items.get( memberid )

        member.set( { unreadMessages: ( member.get('unreadMessages') || 0 ) + 1 } )
    },

    ItemView: require('./MemberRow'),

    model: require('../models/Member'),

    postRender: function() {
        ListView.prototype.postRender.call(this)

        this.items.on( 'change:status', this.statusUpdate, this )
    },

    selection: 'multi',

    selectAll: function() {
        this.items.forEach( item => {
            if( !this.itemViews[ item.id ].templateData.container.hasClass('selected') ) {
                this.itemViews[ item.id ].templateData.container.addClass('selected')
                this.selectedItems[ item.id ] = item
                this.emit( 'itemSelected', item )
            }
        } )
    },

    sortByHeader: function( e ) {

        var attr = this._.find( this.fields, function( field ) { return field.label === this.$(e.currentTarget).text() }, this ).name,
            comparator = ( attr === 'humanElapsed' )
                ? 'elapsed'
                : ( attr === 'unreadMessages' )
                    ? this.model.prototype.getStatusSort
                    : attr

        this.reverseSort = ( comparator === this.items.comparator && this.reverseSort === false ) ? true : false

        this.items.comparator = comparator

        this.items.sort()        
    },

    statusUpdate( model ) {
        var previousStatus = model.previousAttributes().status,
            currentStatus = model.get('status'),
            tableCell = this.itemViews[ model.id ].templateData.container.find( this.util.format( '.%s', previousStatus ) )
    
        tableCell.removeClass( previousStatus ).addClass( currentStatus )

        if( this.items.comparator === this.model.prototype.getStatusSort ) this.items.sort()
    },

    size: function() {
        var tableHeight = this.templateData.container.outerHeight( true ) - this.templateData.menu.outerHeight( true )

        this.templateData.table.height( tableHeight )
        
        this.templateData.body.height( tableHeight - this.templateData.header.outerHeight( true ) )

        return this;
    },

    template: require('../../templates/chat/memberTable')( require('handlebars') )
} )

return TableView
