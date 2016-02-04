var GetData = require('./util/GetData'),
    GetInvolved = function() { return GetData.apply( this, arguments ) }

Object.assign( GetInvolved.prototype, GetData.prototype, {

    dataTables: [
        { name: 'internshipduty', comparator: 'id'},
        { name: 'internshipqualification', comparator: 'id'},
        { name: 'internshipcompensation', comparator: 'id'}
    ],

    requiresLogin: false,

    template: require('../templates/getInvolved')( require('handlebars') ),

    templates: {
        internshipduty: require('../templates/listItem')( require('handlebars') ),
        internshipqualification: require('../templates/listItem')( require('handlebars') ),
        internshipcompensation: require('../templates/listItem')( require('handlebars') )
    }

} )

module.exports = GetInvolved