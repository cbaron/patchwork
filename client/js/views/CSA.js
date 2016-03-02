var GetData = require('./util/GetData'),
    CSA = function() { return GetData.apply( this, arguments ) }

Object.assign( CSA.prototype, GetData.prototype, {

    dataTables: [
        { name: 'csapageimage', comparator: 'id'},
        { name: 'csastatements', comparator: 'id'},
        { name: 'largeshareexamplecolumnone', comparator: 'id'},
        { name: 'largeshareexamplecolumntwo', comparator: 'id'}
    ],

    hashToElement: {
        'how-do-i-know': 'howDoIKnow'
    },

    requiresLogin: false,

    template: require('../templates/csa')( require('handlebars') ),

    templates: {
        csapageimage: require('../templates/imageInstance')( require('handlebars') ),
        csastatements: require('../templates/listItem')( require('handlebars') ),
        largeshareexamplecolumnone: require('../templates/listItem')( require('handlebars') ),
        largeshareexamplecolumntwo: require('../templates/listItem')( require('handlebars') )
    },
    
    postRender() {
        if( window.location.hash ) {
            this.$('body').animate( {
                scrollTop: this.templateData[ this.hashToElement[ window.location.hash.slice(1) ] ].position().top + this.$(window).height() }, 1000 )
        }
    }

} )

module.exports = CSA
