const Super = require('./__proto__')

module.exports = {

    schema: {
        attributes: Super.createAttributes( [
            {
                name: 'sectionOne',
                label: 'Section 1',
                range: [
                    {
                        name: 'heading',
                        label: 'Heading',
                        range: 'String'
                    }, {
                        name: 'description',
                        label: 'Description',
                        range: 'List',
                        itemRange: 'Text'
                    }
                ]
            }, {
                name: 'sectionTwo',
                label: 'Section 2',
                range: [
                    {
                        name: 'heading',
                        label: 'Heading',
                        range: 'String'
                    }, {
                        name: 'description',
                        label: 'Description',
                        range: 'List',
                        itemRange: 'Text'
                    }
                ]
            }, {
                name: 'sectionThree',
                label: 'Section 3',
                range: [
                    {
                        name: 'heading',
                        label: 'Heading',
                        range: 'String'
                    }, {
                        name: 'description',
                        label: 'Description',
                        range: 'List',
                        itemRange: 'Text'
                    }
                ]
            }, {
                name: 'sectionFour',
                label: 'Section 4',
                range: [
                    {
                        name: 'heading',
                        label: 'Heading',
                        range: 'String'
                    }
                ]
            }

        ] )
    }

}