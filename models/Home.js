const Super = require('./__proto__')

module.exports = {

    schema: {
        attributes: Super.createAttributes( [
            {
                name: 'slogan',
                label: 'Slogan',
                range: 'String'
            }
        ] )
    }

}