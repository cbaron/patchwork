module.exports = {
    attributes: [
        {
            name: 'employment',
            label: 'Employment',
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
                    name: 'openPositions',
                    label: 'Open Positions',
                    range: 'List',
                    itemRange: 'String'
                }
            ]
        }, {
            name: 'internships',
            label: 'Internships',
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
                    name: 'application',
                    label: 'Application',
                    range: 'Text'
                }
            ]
        }, {
            name: 'internDuties',
            label: 'Intern Duties',
            range: [
                {
                    name: 'heading',
                    label: 'Heading',
                    range: 'String'
                }, {
                    name: 'dutyList',
                    label: 'List',
                    range: 'List',
                    itemRange: 'String'
                }
            ]
        }, {
            name: 'internQualifications',
            label: 'Intern Qualifications',
            range: [
                {
                    name: 'heading',
                    label: 'Heading',
                    range: 'String'
                }, {
                    name: 'qualificationList',
                    label: 'List',
                    range: 'List',
                    itemRange: 'String'
                }
            ]
        }, {
            name: 'internCompensation',
            label: 'Intern Compensation',
            range: [
                {
                    name: 'heading',
                    label: 'Heading',
                    range: 'String'
                }, {
                    name: 'compensationList',
                    label: 'List',
                    range: 'List',
                    itemRange: 'String'
                }
            ]
        }, {
            name: 'volunteer',
            label: 'Volunteer',
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
        }
    ]
}