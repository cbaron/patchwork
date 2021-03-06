module.exports = {
    attributes: [
        {
            name: 'shareDescription',
            label: 'Share Description',
            range: [
                {
                    name: 'heading',
                    label: 'Heading',
                    range: 'String'
                }, {
                    name: 'description',
                    label: 'Description',
                    range: 'Text'
                }
            ]
        }, {
            name: 'shareExample',
            label: 'Share Example',
            range: [
                {
                    name: 'heading',
                    label: 'Heading',
                    range: 'String'
                }, {
                    name: 'image',
                    label: 'Image',
                    range: 'ImageUrl'
                }, {
                    name: 'listHeading',
                    label: 'List Heading',
                    range: 'String'
                }, {
                    name: 'sampleList',
                    label: 'Sample List',
                    range: 'List',
                    itemRange: 'String'
                }
            ]
        }

    ]
}