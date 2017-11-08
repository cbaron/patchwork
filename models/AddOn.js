const Super = require('./__proto__')

module.exports = {

    attributes: Super.createAttributes( [

        {
            name: 'name',
            label: 'Name',
            range: 'String'
        }, {
            name: 'price',
            label: 'Price',
            range: 'String'
        }, {
            name: 'description',
            label: 'Description',
            range: 'Text'
        }

    ] )

}