const Model = require('../models/__proto__')

module.exports = Object.assign( {}, require('./__proto__'), {

    DeliveryOptions: Object.create( Model, { resource: { value: 'deliveryoption' } } ),
    GroupDropoffs: Object.create( Model, { resource: { value: 'groupdropoff' } } ),
    MemberSelection: require('../models/MemberSelection'),
    MemberShareOption: Object.create( Model, { resource: { value: 'membershareoption' } } ),
    OrderOption: require('../models/OrderOption'),
    ShareOptionOption: require('../models/ShareOptionOption'),

    calculateWeeklyPrice() {
        let optionPrice = this.MemberSelection.data.reduce( ( sum, selection ) => sum + Model.moneyToReal( selection.price ), 0 )
        return optionPrice + Model.moneyToReal( this.model.delivery.data[0].deliveryoption.price )
    },

    calculatePriceAdjustment() {
        return Object.keys( this.editedFields ).reduce( ( acc, key ) => {
            if( ! this.editedFields[ key ].newValue || key === 'groupOption' ) return acc

            let oldPrice, newPrice, diff

            if( key === 'deliveryOption' ) {
                oldPrice = this.DeliveryOptions.data.find( option => option.name === this.editedFields[ key ].oldValue ).price
                newPrice = this.DeliveryOptions.data.find( option => option.name === this.editedFields[ key ].newValue ).price
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

    clear() {
        this.els.changes.innerHTML = ''
        this.els.options.innerHTML = ''

        this.els.resetBtn.classList.add('fd-hidden')
        this.els.editSummary.classList.add('fd-hidden')

        this.els = {
            editSummary: this.els.editSummary,
            changes: this.els.changes,
            container: this.els.container,
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
        return Array.from( this.els.options.querySelectorAll('li.edited') ).map( el => {
            const fieldName = el.getAttribute('data-name'),
                  fieldLabel = this.capitalizeFirstLetter( fieldName ),
                  oldValue = this.editedFields[ fieldName ].oldValue
                    ? this.editedFields[ fieldName ].oldValue.toString()
                    : 'none',
                  newValue = this.editedFields[ fieldName ].newValue.toString()

            return `${fieldLabel}: ${oldValue} to ${newValue}`
        } ).join('\n\t')
    },

    getDeliveryData( ) {

        const patchId = this.model.delivery.data[0].membersharedelivery.id,
              newDeliveryId = this.DeliveryOptions.data.find( option => option.name === this.editedFields.deliveryOption.newValue ).id,
              dropoffId = ( this.editedFields.deliveryOption.newValue === 'group' )
                ? this.GroupDropoffs.data.find( option => option.name === this.editedFields.groupOption.newValue ).id
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

        this.slurpTemplate( { template: this.templates[ this.optionTemplate ]( { name: 'Delivery Option', id: 'deliveryOption' } ), insertion: { el: this.els.options } } )
           
        this.slurpTemplate( { template: this.templates[ this.optionTemplate ]( { name: 'Group Option', id: 'groupOption' } ), insertion: { el: this.els.options } } )
            
        if( this.optionTemplate === 'editableOption' ) {

            this.DeliveryOptions.data.forEach( option =>
                this.slurpTemplate( { template: this.templates.selectOption( option ), insertion: { el: this.els.deliveryOption } } )
            )

            this.els.deliveryOption.querySelector(`option[value=${CSS.escape( option.deliveryoption.name )}`).selected = true
            this.editedFields.deliveryOption = { }
            this.editedFields.deliveryOption.oldValue = this.els.deliveryOption.value

            this.GroupDropoffs.data.unshift( { name: 'none', label: 'None' } )
            this.GroupDropoffs.data.forEach( option =>
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
                  fieldLabel = this.capitalizeFirstLetter( fieldName ),
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
        selectOption: option => {
            const price = ``//option.price ? ` &mdash; ${option.price}/week` : ``
            return `<option value="${option.name}">${option.label}${price}</option>`
        }
    },

    update( { customer, delivery, share, isAdmin } ) {
        this.clear()
        this.editedFields = { }

        this.model = arguments[0]

        this.editable = isAdmin && ( this.Moment() < this.Moment( share.enddate ) )
        this.optionTemplate = this.editable ? 'editableOption' : 'archivedOption'

        this.els.seasonLabel.textContent = share.label

        return this.OrderOption.get( { query: { shareid: share.id, shareoptionid: { operation: 'join', value: { table: 'shareoption', column: 'id' } } } } )
        .then( () => this.ShareOptionOption.get() )
        .then( () => this.MemberSelection.get( { query: { membershareid: share.membershareid, shareoptionoptionid: { operation: 'join', value: { table: 'shareoptionoption', column: 'id' } } } } ) )
        .then( () => this.renderShareOptions() )
        .then( () => this.DeliveryOptions.get() )
        .then( () => this.GroupDropoffs.get() )
        .then( () => {
            this.renderDeliveryOptions() 
            this.originalWeeklyPrice = this.calculateWeeklyPrice()
            this.show()
            return Promise.resolve()
        } )

    }

} )
