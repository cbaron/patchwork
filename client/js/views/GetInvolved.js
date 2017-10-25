module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    tables: [
        { name: 'internshipduty', el: 'duties', template: 'listItem' },
        { name: 'internshipqualification', el: 'qualifications', template: 'listItem' },
        { name: 'internshipcompensation', el: 'compensation', template: 'listItem' }
    ],

    templates: {
        listItem: require('./templates/ListItem')
    }

} )
