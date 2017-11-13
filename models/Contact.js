const Super = require('./__proto__')

module.exports = {

    schema: {
        attributes: Super.createAttributes( [
            {
                name: 'intro',
                label: 'Intro',
                range: 'List',
                itemRange: 'String'
            }
        ] )
    }

}