const Super = require('./__proto__')

module.exports = {

    attributes: Super.createAttributes( [
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
    ] )

}





/*db.Views.insert( {
    name: "get-involved",
    label: "Get Involved",
    employment: {
        heading: "Employment Opportunities",
        description: "We are currently hiring for the following positions:",
        openPositions: [
            "Seed-Starting and Transplant House Operator",
            "CSA Produce Packer & Delivery Driver"
        ]
    },
    internships: {
        heading: "Internships",
        description: "Patchwork Gardens is happy to offer internship opportunities for those interested in immersing themselves in the work and lifestyle of chemical-free farming. We prefer candidates who are able to work full-time (40-60 hours/week) and willing to stay with us for the length of the entire growing season (mid-April &ndash; November). There's also work to be done in winter, so we gladly welcome applicants any time of year. The right person could have the opportunity to become a long-term partner in the farm. We are a young, energetic group, learning fast and making progress in our first seven years of growing. We are quickly expanding in the Dayton area and seek applicants whose energy will help us grow our business.",
        duties: [

        ],
        qualifications: [

        ],
        compensation: [

        ],
        application: "To apply, please fill out the {{Patchwork Gardens Internship Application:https://docs.google.com/forms/d/1YAW7JYS4KuvWZJJf7K8Qn4RNvmjP-WtauUd3AclN09s/viewform}}. We’ll get in touch with you once we’ve received your information."
    },
    volunteer: {
        heading: "Volunteer",
        description: "Want to help out at Patchwork Gardens? Throughout the growing season, there are a variety of opportunities for those who would like to lend a helping hand. To share your interest, please fill out the {{Patchwork Gardens Volunteer Form:https://docs.google.com/forms/d/1GuFrGKvpzJaFY5Dhz3kBsIy_AaY6xZ3NzuqTzvOFmrw/viewform}}."
    }
} )*/