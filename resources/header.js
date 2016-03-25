var Base = require('./__proto__'),
    Header = function() { return Base.apply( this, arguments ) }

Object.assign( Header.prototype, Base.prototype, {

    context: Object.assign( {}, Base.prototype.context, {
        GET: function() {
            this.columns = this._(this.tables.header.columns).reject( column => column.name === "image" || column.name === "mobileimage" )
            return Base.prototype.context.GET.call(this)
        }
    } )
} )

module.exports = Header