var CustomContent = require('./util/CustomContent'),
    GetInvolved = function() { return CustomContent.apply( this, arguments ) }

Object.assign( GetInvolved.prototype, CustomContent.prototype, {

    postRender() {
        CustomContent.prototype.postRender.call(this)

        this.on( 'insertedemploymentTemplate', () => {
            if( this.templateData.employmentTable.children().length === 1 ) {
                this.templateData.employmentTable.remove()
                this.templateData.openPositions.text( 'We currently have no positions open. Stay Tuned!' )
            }
        } )
        
    },

    requiresLogin: false,

    tables: [
        { name: 'employment', el: 'employmentTable', template: 'employmentRow' },
        { name: 'internshipduty', comparator: 'position', el: 'dutyList', template: 'listItem' },
        { name: 'internshipqualification', comparator: 'position', el: 'qualificationList', template: 'listItem' },
        { name: 'internshipcompensation', comparator: 'position', el: 'compensationList', template: 'listItem' }
    ],

    template: () => require('../templates/getInvolved'),

    templates: {
        employmentRow: require('../templates/employmentRow'),
        listItem: require('../templates/listItem')( require('handlebars') )
    }

} )

module.exports = GetInvolved