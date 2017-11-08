module.exports = {

    Attributes: [ {
        label: 'Label',
        name: 'label',
        range: 'String'
    }, {
        label: 'Name',
        name: 'name',
        range: 'String',
        validate: val => ( ! /\s/.test( val ) ) && ( value.match(/^[A-Z]*$/) )
    } ],

    createAttributes( attributes, opts={ concat: false } ) { return opts.concat ? this.Attributes.concat( attributes ) : attributes },

    create() { return { attributes: this.Attributes } }
}
