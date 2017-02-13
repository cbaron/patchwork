module.exports = Object.create( Object.assign( { }, require('./__proto__'), {

    parse: response => response[0]

} ), { resource: { value: 'contactinfo' } } )
