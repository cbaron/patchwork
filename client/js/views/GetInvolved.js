module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    events: {
        pdf: 'click'
    },

    onPdfClick( e ) {
        window.open( `/file/employment/jobdescription/${ e.target.getAttribute('data-id') }` )
    },

    postRender() {
        require('./util/CustomContent').postRender.call(this)

        this.on( 'insertedemploymentTemplate', () => {
            if( this.els.employmentTable.children.length === 1 ) {
                this.els.employmentTable.remove()
                this.els.openPositions.textContent = 'We currently have no positions open. Stay Tuned!'
            }
        } )

        return this        
    },

    tables: [
        { name: 'employment', el: 'employmentTable', template: 'employmentRow' },
        { name: 'internshipduty', comparator: 'position', el: 'dutyList', template: 'listItem' },
        { name: 'internshipqualification', comparator: 'position', el: 'qualificationList', template: 'listItem' },
        { name: 'internshipcompensation', comparator: 'position', el: 'compensationList', template: 'listItem' }
    ],

    templates: {
        employmentRow: require('../templates/employmentRow'),
        listItem: require('./templates/ListItem')
    }

} )
