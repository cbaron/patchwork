var GetData = require('./util/GetData'),
    CSA = function() { return GetData.apply( this, arguments ) }

Object.assign( CSA.prototype, GetData.prototype, {

    dataTables: [
        { name: 'csapageimage', comparator: 'id'},
        { name: 'csastatements', comparator: 'id'},
        { name: 'largeshareexamplecolumnone', comparator: 'id'},
        { name: 'largeshareexamplecolumntwo', comparator: 'id'}
    ],

    requiresLogin: false,

    template: require('../templates/csa')( require('handlebars') ),

    templates: {
        csapageimage: require('../templates/imageInstance')( require('handlebars') ),
        csastatements: require('../templates/listItem')( require('handlebars') ),
        largeshareexamplecolumnone: require('../templates/listItem')( require('handlebars') ),
        largeshareexamplecolumntwo: require('../templates/listItem')( require('handlebars') )
    }

} )

module.exports = CSA