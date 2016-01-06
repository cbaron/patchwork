var List = require('./List'),
    Table = function() { return List.apply( this, arguments ) }

Object.assign( Table.prototype, List.prototype, {

    events: {
        'header': { event: 'click', selector: 'th', method: 'sortByHeader' }
    },

    getItemViewOptions() {
        return { container: this.templateData.body, fields: this.fields.map( field => field.name ) }
    },

    getTemplateOptions() { return { fields: this.fields } },

    sortByHeader: function( e ) {

        var comparator = this.$(e.currentTarget).attr( 'data-sort' )

        this.reverseSort = ( ( comparator === this.items.comparator ) && ( this.reverseSort === false ) ) ? true : false

        this.items.comparator = comparator

        this.items.sort()        
    }

} )

module.exports = Table
