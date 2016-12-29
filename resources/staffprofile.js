var Base = require('./__proto__'),
    StaffProfile = function() { return Base.apply( this, arguments ) }

Object.assign( StaffProfile.prototype, Base.prototype, {

    context: Object.assign( {}, Base.prototype.context, {
        GET: function() {
            this.columns = this._(this.tables.staffprofile.columns).reject( column => column.name === "image" )
            return Base.prototype.context.GET.call(this)
        }
    } )
} )

module.exports = StaffProfile
