module.exports = {
    attributes: [
        {
            name: 'aboutCSA',
            label: 'About CSA',
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
            name: 'dividerImagesOne',
            label: 'Divider Images One',
            range: 'List',
            itemRange: 'ImageUrl'
        }, {
            name: 'csaFit',
            label: 'CSA Fit',
            range: [
                {
                    name: 'heading',
                    label: 'Heading',
                    range: 'String'
                }, {
                    name: 'description',
                    label: 'Description',
                    range: 'String'
                }, {
                    name: 'csaFitStatements',
                    label: 'CSA Fit Statements',
                    range: 'List',
                    itemRange: 'String'
                }
            ]
        }, {
            name: 'csaContents',
            label: 'CSA Contents',
            range: [
                {
                    name: 'heading',
                    label: 'Heading',
                    range: 'String'
                }, {
                    name: 'description',
                    label: 'Description',
                    range: 'Text'
                }, {
                    name: 'sharePriority',
                    label: 'Share Priority',
                    range: 'Text'
                }
            ]
        }, {
            name: 'dividerImagesTwo',
            label: 'Divider Images Two',
            range: 'List',
            itemRange: 'ImageUrl'
        }, {
            name: 'csaCustomization',
            label: 'CSA Customization',
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
            name: 'addOns',
            label: 'Add-Ons',
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
            name: 'payment',
            label: 'Payment',
            range: [
                {
                    name: 'heading',
                    label: 'Heading',
                    range: 'String'
                }, {
                    name: 'description',
                    label: 'Description',
                    range: 'Text'
                }, {
                    name: 'payableTo',
                    label: 'Payable To',
                    range: 'Text'
                }, {
                    name: 'emailUs',
                    label: 'Email Us',
                    range: 'Text'
                }
            ]
        }

    ]
}