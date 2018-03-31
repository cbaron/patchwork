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
        /*DeviceLog: {
            add: false,
            displayAttr: 'createdAt',
            sort: { createdAt: -1 },
            templateOptions: { hideButtonRow: true }
        },
        Disc: {
            displayAttr: 'DiscDocument',
            validate: {
                DiscType: val => val !== undefined,
                cost: val => val !== '',
                price: val => val !== ''
            }
        },
        GiftCardTransaction: {
            add: false,
            payment: { hide: true }
        },
        StoreTransaction: {
            add: false,
            payment: { hide: true }
        }*/
    }

} ) )
