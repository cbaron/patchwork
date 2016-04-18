var Base = require('./__proto__'),
    Carousel = function() { return Base.apply( this, arguments ) }

Object.assign( Carousel.prototype, Base.prototype, {

    context: Object.assign( {}, Base.prototype.context, {
        GET: function() {
            this.columns = this._(this.tables.carousel.columns).reject( column => column.name === "image" )
            return Base.prototype.context.GET.call(this)
        }
    } )
} )

module.exports = Carousel
