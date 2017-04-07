const Model = require('../models/__proto__')

module.exports = Object.assign( {}, require('./__proto__'), {

    DeliveryOptions: Object.create( Model, { resource: { value: 'deliveryoption' } } ),
    GroupDropoffs: Object.create( Model, { resource: { value: 'groupdropoff' } } ),
    MemberSelection: require('../models/MemberSelection'),
    MemberShareDelivery: Object.create( Model, { resource: { value: 'membersharedelivery' } } ),
    MemberShareOption: Object.create( Model, { resource: { value: 'membershareoption' } } ),
    OrderOption: require('../models/OrderOption'),
    ShareOptionOption: require('../models/ShareOptionOption'),

    calculateWeeklyPrice() {
        let optionPrice = this.MemberSelection.data.reduce( ( sum, selection ) => sum + Model.moneyToReal( selection.price ), 0 )
        console.log( optionPrice )
        console.log( this.model.delivery.data[0].deliveryoption.price )
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
        this.els.options.innerHTML = ''

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
        } ).join(', ')
    },

    getDeliveryData( key ) {
        if( this.editedFields[ key ].newValue === 'group' && ! this.editedFields.groupOption.newValue ) return

        const oldDeliveryId = this.DeliveryOptions.data.find( option => option.name === this.editedFields[ key ].oldValue ).id,
              newDeliveryId = this.DeliveryOptions.data.find( option => option.name === this.editedFields[ key ].newValue ).id,
              dropoffId = ( this.editedFields[ key ].newValue === 'group' )
                ? this.GroupDropoffs.data.find( option => option.name === this.editedFields.groupOption.newValue ).id
                : null

        return this.MemberShareDelivery.get( { query: { deliveryoptionid: oldDeliveryId, membershareid: this.memberShareId } } )
        .then( () => {
            let patchId
            if( this.MemberShareDelivery.data.length ) patchId = this.MemberShareDelivery.data[0].id

            this.deliveryData.push( {
                id: patchId,
                data: {
                    deliveryoptionid: newDeliveryId,
                    groupdropoffid: dropoffId,
                }
            } )

            return Promise.resolve()
        } )
    },

    getGroupData( key ) {
        if( this.editedFields.deliveryOption.newValue ) return

        const deliveryId = this.DeliveryOptions.data.find( option => option.name === this.els.deliveryOption.value ).id,
              dropoffId = this.GroupDropoffs.data.find( option => option.name === this.editedFields.groupOption.newValue ).id

        return this.MemberShareDelivery.get( { query: { deliveryoptionid: deliveryId, membershareid: this.memberShareId } } )
        .then( () => {
            let patchId
            if( this.MemberShareDelivery.data.length ) patchId = this.MemberShareDelivery.data[0].id

            this.deliveryData.push( {
                id: patchId,
                data: {
                    groupdropoffid: dropoffId
                }
            } )

            return Promise.resolve()
        } )
    },

    getShareOptionData( key ) {
        const shareOptionId = this.OrderOption.data.find( option => option.key === key ).id

        const shareOptionOptionId = this.ShareOptionOption.data.find(
            option => option.name === this.editedFields[ key ].newValue && option.shareoptionid === shareOptionId
        ).id

        return this.MemberShareOption.get( { query: { shareoptionid: shareOptionId, membershareid: this.memberShareId } } )
        .then( () => {
            let patchId
            if( this.MemberShareOption.data.length ) patchId = this.MemberShareOption.data[0].id

            this.shareOptionData.push( {
                id: patchId,
                data: {
                    shareoptionoptionid: shareOptionOptionId
                }
            } )

            return Promise.resolve()
        } )
    },

    getPatchData() {
        this.deliveryData = [ ],
        this.shareOptionData = [ ],
        this.memberShareId = this.model.share.membershareid

        return Promise.all( Object.keys( this.editedFields ).map( key => {
            if( ! this.editedFields[ key ].newValue ) return Promise.resolve()

            return ( key === 'deliveryOption' )
                ? this.getDeliveryData( key )
                : ( key === 'groupOption' )
                    ? this.getGroupData( key )
                    : this.getShareOptionData( key )            
        } ) )
        .then( () => {
            this.data = Object.assign( { }, { delivery: this.deliveryData, shareOptions: this.shareOptionData } )
            return Promise.resolve( this.data )
        } )
        .catch( this.Error )

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
        console.log('adasd')
        const option = this.model.delivery.data[0]

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

        console.log('adasd')
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
        const originalWeeklyPrice = this.calculateWeeklyPrice(),
            priceAdjustment = this.calculatePriceAdjustment(),
            edits = this.els.options.querySelectorAll('li.edited')

        this.els.changes.innerHTML = ''

        if( edits.length === 0 ) {
            this.emit( 'reset' )
            this.els.resetBtn.classList.add('fd-hidden')
            return this.els.editSummary.classList.add('fd-hidden')
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

        this.els.originalWeeklyPrice.textContent = this.Currency.format( originalWeeklyPrice )
        this.els.newWeeklyPrice.textContent = this.Currency.format( originalWeeklyPrice + priceAdjustment )

        this.els.editSummary.classList.remove('fd-hidden')

        this.emit( 'adjustment', { description: this.getAdjustmentDescription(), originalWeeklyPrice, priceAdjustment } )
    },

    templates: {
        fieldEdit: require('./templates/FieldEdit'),
        archivedOption: option => `<li><div class="cell">${option.name}</div><div class="cell" data-js="${option.id}"></div></li>`,
        editableOption: option => `<li data-name="${option.key || option.id}" class="editable"><span>${option.name}</span><select data-js="${option.id}"></select></li>`,
        selectOption: option => `<option value="${option.name}">${option.label}</option>`
    },

    update( { customer, delivery, share } ) {
        this.clear()
        this.editedFields = { }

        this.model = arguments[0]

        this.editable = ( this.Moment() < this.Moment( share.enddate ) )
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
            this.show()
            return Promise.resolve()
        } )

    }

} )
