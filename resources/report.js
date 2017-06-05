var Base = require('./__proto__'),
    Report = function() { return Base.apply( this, arguments ) }

Object.assign( Report.prototype, Base.prototype, {

    GET() {
    }

} )

module.exports = Report
