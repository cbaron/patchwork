module.exports = { ...require('./__proto__'),

    ContactInfo: require('./ContactInfo'),
    CurrentGroups: require('./CurrentGroups'),
    DayOfWeekMap: require('./DayOfWeek'),
    DeliveryRoute: Object.create( require('./__proto__'), { resource: { value: 'deliveryroute' } } ),
    SkipWeeks: Object.create( require('./__proto__'), { resource: { value: 'membershareskipweek' } } ),

    attachments: [ ],

    async getSkipWeekStatus( customer ) {
        customer.isSkipping = false
        const skipWeeks = await this.SkipWeeks.get( { query: { membershareid: customer.memberShareId } } )

        const startOfWeek = this.Moment().startOf('isoWeek')
        const endOfWeek = this.Moment().endOf('isoWeek')

        skipWeeks.forEach( sw => {
            const skipDate = this.Moment( sw.date )
            if( skipDate.isBetween( startOfWeek, endOfWeek ) || skipDate.isSame( startOfWeek ) || skipDate.isSame( endOfWeek ) ) customer.isSkipping = true
        } )

    },

    getDayOptions() {
        return Object.entries( this.DayOfWeekMap ).map( ( [ k, v ] ) => `<option value="${k}">${v}</option>` ).join('')
    },

    getGroupNameOptions() {
        return this.CurrentGroups.data.map( datum => `<option value="${datum.name}">${datum.name}</option>` ).join('')
    },

    metadata: {
        columns: [
            { name: 'name', label: 'Name' },
            { name: 'email', label: 'Email' },
            { name: 'secondaryEmail', label: 'Secondary Email' },
            { name: 'deliveryLabel', label: 'Delivery Type' },
            { name: 'dayofweek', label: 'Delivery Day' }
        ]
    },

    parse( response ) {
        const contactInfo = this.ContactInfo.data
        const farmPickupInfo = this.DeliveryRoute.data[0]

        return response.map( row => {

            if( row.deliveryName === 'farm' ) {
                row = { ...row, pickupAddress: contactInfo.farmpickup, dayofweek: farmPickupInfo.dayofweek, starttime: farmPickupInfo.starttime, endtime: farmPickupInfo.endtime }
            }

            return { ...row,
                dayofweek: this.DayOfWeekMap[ row.dayofweek ],
                starttime: row.starttime ? this.Moment( `${this.Moment().format('YYYY-MM-DD')} ${row.starttime}` ).format('h:mmA') : null,
                endtime: row.endtime ? this.Moment( `${this.Moment().format('YYYY-MM-DD')} ${row.endtime}` ).format('h:mmA') : null
            }
        } )
    },

    sortIntoEmails( list ) {
        const hasAttachment = Boolean( this.attachments.length )
        const isNewsletter = this.selectedCategory === 'newsletter'
        let customLinesArray, customLinesMarkup

        if( this.emailIsCustom ) {
            customLinesArray = this.customTextValue.split('\n')
            customLinesMarkup = customLinesArray.reduce( ( memo, line ) => {
                if( !line.length ) return memo
                return `${memo}<p>${line}</p>`
            }, `` )
        }

        return list.reduce( ( memo, customer ) => {
            const key = isNewsletter ? 'newsletter' : customer.dropoffName || customer.deliveryName;
            const email = customer.email.trim().toLowerCase();
            const secondaryEmail = customer.secondaryEmail && customer.secondaryEmail.trim().toLowerCase();
            const type = this.emailIsCustom && this.replaceDefaultTemplate
                ? 'custom'
                : isNewsletter
                    ? 'newsletter'
                    : customer.dropoffName ? 'group' : customer.deliveryName

            if( !memo[ key ] ) {
                memo[ key ] = { }
                memo[ key ].recipients = [ ]
                memo[ key ].subject = this.subjectLine
                memo[ key ].type = type
                memo[ key ].templateOpts = {
                    ...this.omit( customer, ['name', 'email', 'secondaryEmail', 'memberShareId', 'deliveryName', 'deliveryLabel', 'isSkipping'] ),
                    customText: customLinesMarkup,
                    hasAttachment
                }
            }

            if (!memo[key].recipients.includes(email) && email !== 'eat@patchworkgardens.net') {
                memo[key].recipients.push(email);
            };
            
            if (secondaryEmail && !memo[key].recipients.includes(secondaryEmail) && email !== 'eat@patchworkgardens.net') {
                memo[key].recipients.push(secondaryEmail);
            };

            return memo;

        }, {} )
    },

    resource: 'weekly-reminder'

}