module.exports = Object.create( Object.assign( { }, require('./__proto__'), {

    data: {
        currentCollection: 'Pages',
        currentView: ''
    },

    meta: {
        CsaPageShare: {
            add: false,
            delete: false
        },
        OpenPositions: {
            add: true,
            delete: true
        },
        Pages: {
            add: false,
            delete: false
        },
        seasonalAddOnOption: {
            displayAttr: [ 'seasonalAddOn', 'name' ]
        },
        sharedeliveryoption: {
            displayAttr: [ 'share', 'deliveryoption' ]
        },
        sharegroupdropoff: {
            displayAttr: [ 'share', 'groupdropoff' ]
        },
        shareoption: {
            displayAttr: [ 'name' ]
        },
        shareoptionoption: {
            displayAttr: [ 'shareoption', 'label' ]
        },
        shareoptionshare: {
            displayAttr: [ 'shareoption', 'share' ]
        },
        Staff: {
            add: true,
            delete: true
        },
        zipcoderoute: {
            displayAttr: [ 'zipcode', 'deliveryroute' ]
        }
    }

} ) )
