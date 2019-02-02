const Model = require('../models/__proto__')

module.exports = Object.assign( {}, require('./__proto__'), {

    SeasonalDeliveryOptions: require('../models/SeasonalDeliveryOptions'),
    MemberSelection: require('../models/MemberSelection'),
    MemberShareOption: Object.create( Model, { resource: { value: 'membershareoption' } } ),
    MemberSeasonalSelection: require('../models/MemberSeasonalSelection'),
    OrderOption: require('../models/OrderOption'),
    SeasonalDropoffs: require('../models/SeasonalDropoffs'),
    ShareOptionOption: require('../models/ShareOptionOption'),


    calculateWeeklyPrice() {
        let optionPrice = this.MemberSelection.data.reduce( ( sum, selection ) => sum + Model.moneyToReal( selection.price ), 0 )
        return optionPrice + Model.moneyToReal( this.model.delivery.data[0].groupdropoff.price || this.model.delivery.data[0].deliveryoption.price )
    },

    calculatePriceAdjustment() {
        return Object.keys( this.editedFields ).reduce( ( acc, key ) => {
            if( ! this.editedFields[ key ].newValue ) return acc

            let oldPrice, newPrice, oldGroup, diff

            if( key === 'deliveryOption' ) {
                if( this.editedFields.deliveryOption.newValue === 'group' ) return acc
                oldGroup = this.SeasonalDropoffs.data.find( option => option.name === this.editedFields.groupOption.oldValue )
                oldPrice = oldGroup ? oldGroup.price : this.SeasonalDeliveryOptions.data.find( option => option.name === this.editedFields[ key ].oldValue ).price
                newPrice = this.SeasonalDeliveryOptions.data.find( option => option.name === this.editedFields[ key ].newValue ).price
            } else if( key === 'groupOption' ) {
                oldGroup = this.SeasonalDropoffs.data.find( option => option.name === this.editedFields[ key ].oldValue )
                oldPrice = oldGroup ? oldGroup.price : this.SeasonalDeliveryOptions.data.find( option => option.name === this.editedFields.deliveryOption.oldValue ).price
                newPrice = this.SeasonalDropoffs.data.find( option => option.name === this.editedFields[ key ].newValue ).price
            } else {
                const shareOptionId = this.OrderOption.data.find( option => option.key === key ).id

                oldPrice = this.ShareOptionOption.data.find(
                    option => option.name === this.editedFields[ key ].oldValue && option.shareoptionid === shareOptionId
                ).price

                newPrice = this.ShareOptionOption.data.find(
                    option => option.name === this.editedFields[ key ].newValue && option.shareoptionid === shareOptionId
                ).price
            }

            diff = Model.moneyToReal( newPrice ) - Model.moneyToReal( oldPrice )

            return acc + diff

        }, 0 )
    },

    checkHomeDelivery() {
        return this.Xhr( {
            method: 'get',
            resource: 'zipcoderoute',
            qs: JSON.stringify( {
                zipcode: this.model.customer.member.data.zipcode,
                routeid: { operation: 'join', value: { table: 'deliveryroute', column: 'id' } }
            } )
        } )
        .then( response =>
            Promise.resolve( this.homeDeliveryAvailable = response.length && response[0][ 'deliveryroute.dayofweek' ] )
        )
    },

    clear() {
        this.els.changes.innerHTML = ''
        this.els.options.innerHTML = ''
        this.els.seasonalItemsList.innerHTML = ''

        this.els.resetBtn.classList.add('fd-hidden')
        this.els.editSummary.classList.add('fd-hidden')

        this.els = {
            editSummary: this.els.editSummary,
            changes: this.els.changes,
            container: this.els.container,
            seasonalItems: this.els.seasonalItems,
            seasonalItemsList: this.els.seasonalItemsList,
            seasonLabel: this.els.seasonLabel,
            options: this.els.options,
            resetBtn: this.els.resetBtn,
            newWeeklyPrice: this.els.newWeeklyPrice,
            originalWeeklyPrice: this.els.originalWeeklyPrice
        }

    },

    events: {
        options: 'change',
        resetBtn: 'click'
    },

    getAdjustmentDescription() {
        const adjustment = Array.from( this.els.options.querySelectorAll('li.edited') ).reduce( (memo, el) => {
            const fieldName = el.getAttribute('data-name'),
                  fieldLabel = el.firstChild.textContent,
                  oldValue = this.editedFields[ fieldName ].oldValue
                    ? this.editedFields[ fieldName ].oldValue.toString()
                    : 'none',
                  newValue = this.editedFields[ fieldName ].newValue.toString()

            memo.textDescription.push(`${fieldLabel}: ${oldValue} to ${newValue}`)
            memo.optionChanges.push({
                label: fieldLabel,
                oldValue,
                newValue
            })

            return memo

        }, { textDescription: [], optionChanges: [] } )

        return {
            textDescription: adjustment.textDescription.join('\n\t'),
            optionChanges: adjustment.optionChanges
        }

    },

    getDeliveryData( ) {
        const patchId = this.model.delivery.data[0].membersharedelivery.id;
        const deliveryValue = this.editedFields.deliveryOption.newValue || this.editedFields.deliveryOption.oldValue;
        const newDeliveryId = this.SeasonalDeliveryOptions.data.find( option => option.name === deliveryValue ).id;
        const dropoffId = this.editedFields.groupOption.newValue
            ? this.SeasonalDropoffs.data.find( option => option.name === this.editedFields.groupOption.newValue ).id
            : null

        return {
            id: patchId,
            deliveryoptionid: newDeliveryId,
            groupdropoffid: dropoffId
        }
    },

    getShareOptionData( key ) {
        const shareOptionId = this.OrderOption.data.find( option => option.key === key ).id,
            memberShareId = this.model.share.membershareid

        const shareOptionOptionId = this.ShareOptionOption.data.find(
            option => option.name === this.editedFields[ key ].newValue && option.shareoptionid === shareOptionId
        ).id

        return {
            id: this.MemberSelection.data.find( memberSelection => shareOptionId == memberSelection.shareoptionid ).membershareoptionid,
            shareoptionoptionid: shareOptionOptionId
        }
    },

    getPatchData() {

        var rv = { membersharedelivery:
            ( this.editedFields.deliveryOption.newValue || this.editedFields.groupOption.newValue )
                ? this.getDeliveryData()
                : { },
            membershareoption: [ ]
        }

        Object.keys( this.editedFields ).forEach( key => {
            if( !this.editedFields[ key ].newValue || key === 'deliveryOption' || key === 'groupOption' ) return

            rv.membershareoption.push( this.getShareOptionData( key ) )
        } )

        return rv
    },

    onOptionsChange( e ) {
        const listItemEl = e.target.closest('li.editable'),
            shareOptionKey = listItemEl.getAttribute('data-name'),
            val = e.target.value

        if( shareOptionKey === 'deliveryOption' && val !== 'group' ) this.emit( 'deliveryChanged', { deliveryOption: val } )
        if( shareOptionKey === 'groupOption' && val !== 'none' ) this.emit( 'deliveryChanged', { deliveryOption: 'group', groupOption: val } )

        if( shareOptionKey === 'deliveryOption' ) {
            if( val !== 'group' ) {
                this.els.groupOption.selectedIndex = 0
                this.els.groupOption.disabled = true
                this.els.groupOption.closest('li').classList.remove('edited')
                this.editedFields.groupOption.newValue = undefined
            } else { this.els.groupOption.disabled = false }
        }

        if( this.editedFields[ shareOptionKey ].oldValue === val ) {
            this.editedFields[ shareOptionKey ].newValue = undefined
            listItemEl.classList.remove('edited')
            return this.showEditSummary()
        }

        this.editedFields[ shareOptionKey ].newValue = val
        listItemEl.classList.add('edited')

        this.els.resetBtn.classList.remove('fd-hidden')
        
        this.showEditSummary()
        
    },

    onResetBtnClick() {
        this.els.resetBtn.classList.add('fd-hidden')
        this.els.editSummary.classList.add('fd-hidden')
        this.update( this.model )
        this.emit( 'reset', this.model )
    },

    renderDeliveryOptions() {
        const option = Object.assign( {}, this.model.delivery.data[0] )

        this.slurpTemplate( { template: this.templates[ this.optionTemplate ]( { name: 'Delivery option', id: 'deliveryOption' } ), insertion: { el: this.els.options } } )
           
        this.slurpTemplate( { template: this.templates[ this.optionTemplate ]( { name: 'Group option', id: 'groupOption' } ), insertion: { el: this.els.options } } )
            
        if( this.optionTemplate === 'editableOption' ) {

            this.SeasonalDeliveryOptions.data.forEach( option =>
                option.name === 'home' && !this.homeDeliveryAvailable
                    ? this.slurpTemplate( { template: this.templates.selectOption( { disabled: true, name: 'none', label: 'Out of Home Delivery Range' } ), insertion: { el: this.els.deliveryOption } } )
                    : this.slurpTemplate( { template: this.templates.selectOption( option ), insertion: { el: this.els.deliveryOption } } )
            )

            this.els.deliveryOption.querySelector(`option[value=${CSS.escape( option.deliveryoption.name )}`).selected = true
            this.editedFields.deliveryOption = { }
            this.editedFields.deliveryOption.oldValue = this.els.deliveryOption.value

            this.SeasonalDropoffs.data.unshift( { name: 'none', label: 'None' } )
            this.SeasonalDropoffs.data.forEach( option =>
                this.slurpTemplate( { template: this.templates.selectOption( option ), insertion: { el: this.els.groupOption } } )
            )

            if( ! option.groupdropoff.id ) {
                this.els.groupOption.selectedIndex = 0
                this.els.groupOption.disabled = true
            } else this.els.groupOption.querySelector(`option[value=${CSS.escape( option.groupdropoff.name )}`).selected = true

            this.editedFields.groupOption = { }
            this.editedFields.groupOption.oldValue = this.els.groupOption.disabled ? undefined : this.els.groupOption.value

        } else {
            this.els.deliveryOption.textContent = option.deliveryoption.label
            this.els.groupOption.textContent = option.groupdropoff.label || 'N/A'
        }

        return this
    },

    renderSeasonalItems() {
        if( !this.MemberSeasonalSelection.data.length ) return this.els.seasonalItems.classList.add('fd-hidden')

        this.MemberSeasonalSelection.data.forEach( selection =>
            this.slurpTemplate( {
                insertion: { el: this.els.seasonalItemsList },
                template: this.templates.seasonalItem( selection )
            } )
        )

        this.els.seasonalItems.classList.remove('fd-hidden')
    },

    renderShareOptions() {
        this.OrderOption.data.forEach( shareOption => {
            this.slurpTemplate( { template: this.templates[ this.optionTemplate ]( shareOption ), insertion: { el: this.els.options } } )
            
            if( this.editable ) {
                this.ShareOptionOption.data.forEach( option => {
                    if( option.shareoptionid === shareOption.id ) this.slurpTemplate( {
                        template: this.templates.selectOption( option ), insertion: { el: this.els[ shareOption.id ] }
                    } )
                } )
            }            
        } )

        this.MemberSelection.data.forEach( selection => {
            if( this.editable ) {
                const key = this.OrderOption.data.find( shareOption => shareOption.id === selection.shareoptionid ).key
                this.els[ selection.shareoptionid ].querySelector(`option[value=${CSS.escape( selection.name )}`).selected = true
                this.editedFields[ key ] = { }
                this.editedFields[ key ].oldValue = this.els[ selection.shareoptionid ].value
            } else { this.els[ selection.shareoptionid ].textContent = selection.label }
        } )

    },

    showEditSummary() {
        const priceAdjustment = this.calculatePriceAdjustment(),
            edits = this.els.options.querySelectorAll('li.edited')

        this.els.changes.innerHTML = ''

        if( edits.length === 0 ) {
            this.emit( 'reset', this.model )
            this.els.resetBtn.classList.add('fd-hidden')
            return this.slideOut( this.els.editSummary, 'right' )
        }
        
        edits.forEach( el => {
            const fieldName = el.getAttribute('data-name'),
                  fieldLabel = el.firstChild.textContent,
                  oldValue = this.editedFields[ fieldName ].oldValue
                    ? this.editedFields[ fieldName ].oldValue.toString()
                    : 'none',
                  newValue = this.editedFields[ fieldName ].newValue.toString()

            this.slurpTemplate( { insertion: { el: this.els.changes }, template: this.templates.fieldEdit( { label: fieldLabel, oldValue, newValue } ) } )
        } )

        this.els.originalWeeklyPrice.textContent = this.Currency.format( this.originalWeeklyPrice )
        this.els.newWeeklyPrice.textContent = this.Currency.format( this.originalWeeklyPrice + priceAdjustment )

        this.emit( 'adjustment', { description: this.getAdjustmentDescription(), originalWeeklyPrice: this.originalWeeklyPrice, priceAdjustment } )
    
        if( !this.isHidden( this.els.editSummary ) && edits.length ) return

        this.slideIn( this.els.editSummary, 'right' )
    },

    templates: {
        fieldEdit: require('./templates/FieldEdit'),
        archivedOption: option => `<li><div class="cell">${option.name}</div><div class="cell" data-js="${option.id}"></div></li>`,
        editableOption: option => `<li data-name="${option.key || option.id}" class="editable"><span>${option.name}</span><select data-js="${option.id}"></select></li>`,
        seasonalItem: selection => `<div><span>${selection.addOn}: </span><span>${selection.addOnOption}</span></div>`,
        selectOption: option => {
            const disabled = option.disabled ? `disabled` : ''
            const price = option.name === 'none'
                ? ''
                : option.name === 'group'
                    ? ' &mdash; Varies'
                    : ` &mdash; ${option.price}/week`

            return `<option ${disabled} value="${option.name}">${option.label}${price}</option>`
        }
    },

    update( { customer, delivery, share, isAdmin } ) {
        this.clear()
        this.editedFields = { }

        this.model = arguments[0]

        this.editable = isAdmin && ( this.Moment() < this.Moment( share.enddate ) )
        this.optionTemplate = this.editable ? 'editableOption' : 'archivedOption'

        this.els.seasonLabel.textContent = share.label

        return ( this.editable ? this.checkHomeDelivery() : Promise.resolve() )
        .then( () => this.OrderOption.get( { query: { shareid: share.id, shareoptionid: { operation: 'join', value: { table: 'shareoption', column: 'id' } } } } ) )
        .then( () => this.ShareOptionOption.get() )
        .then( () => this.MemberSelection.get( { query: { membershareid: share.membershareid, shareoptionoptionid: { operation: 'join', value: { table: 'shareoptionoption', column: 'id' } } } } ) )
        .then( () => this.MemberSeasonalSelection.get( { query: {
            memberShareId: share.membershareid,
            seasonalAddOnId: { operation: 'join', value: { table: 'seasonalAddOn', column: 'id' } },
            seasonalAddOnOptionId: { operation: 'join', value: { table: 'seasonalAddOnOption', column: 'id' } }
        } } ) )
        .then( () => this.renderShareOptions() )
        .then( () => this.SeasonalDeliveryOptions.get( { query: { shareid: share.id, deliveryoptionid: { operation: 'join', value: { table: 'deliveryoption', column: 'id' } } } } ) )
        .then( () => this.SeasonalDropoffs.get( { query: { shareid: share.id, groupdropoffid: { operation: 'join', value: { table: 'groupdropoff', column: 'id' } } } } ) )
        .then( () => {
            this.renderDeliveryOptions()
            this.renderSeasonalItems()
            this.originalWeeklyPrice = this.calculateWeeklyPrice()
            this.show()
            return Promise.resolve()
        } )

    }

} )
