module.exports = Object.assign( {}, require('./__proto__'), {

    DeliveryOptions: Object.create( require('../models/__proto__'), { resource: { value: 'deliveryoption' } } ),
    GroupDropoffs: Object.create( require('../models/__proto__'), { resource: { value: 'groupdropoff' } } ),
    MemberSelection: require('../models/MemberSelection'),
    MemberShareDelivery: Object.create( require('../models/__proto__'), { resource: { value: 'membersharedelivery' } } ),
    MemberShareOption: Object.create( require('../models/__proto__'), { resource: { value: 'membershareoption' } } ),
    OrderOption: require('../models/OrderOption'),
    OrderOptionOptions: Object.create( require('../models/__proto__'), { resource: { value: 'shareoptionoption' } } ),

    calculatePriceAdjustment() {
        const adjustment = Object.keys( this.editedFields ).reduce( ( acc, key ) => {
            if( ! this.editedFields[ key ].newValue || key === 'groupOption' ) return acc

            let oldPrice, newPrice, diff

            if( key === 'deliveryOption' ) {
                oldPrice = this.DeliveryOptions.data.find( option => option.name === this.editedFields[ key ].oldValue ).price
                newPrice = this.DeliveryOptions.data.find( option => option.name === this.editedFields[ key ].newValue ).price
            } else {
                const shareOptionId = this.OrderOption.data.find( option => option.key === key ).id

                oldPrice = this.OrderOptionOptions.data.find(
                    option => option.name === this.editedFields[ key ].oldValue && option.shareoptionid === shareOptionId
                ).price

                newPrice = this.OrderOptionOptions.data.find(
                    option => option.name === this.editedFields[ key ].newValue && option.shareoptionid === shareOptionId
                ).price
            }

            diff = newPrice.slice( newPrice.indexOf('$') + 1 ) - oldPrice.slice( oldPrice.indexOf('$') + 1 )

            return acc + diff

        }, 0 )

        return Promise.resolve( adjustment )
    },

    clear() {
        this.els.options.innerHTML = ''

        this.els = {
            editSummary: this.els.editSummary,
            changes: this.els.changes,
            container: this.els.container,
            seasonLabel: this.els.seasonLabel,
            options: this.els.options,
            resetBtn: this.els.resetBtn
        }
    },

    events: {
        options: 'change',
        resetBtn: 'click'
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

        const shareOptionOptionId = this.OrderOptionOptions.data.find(
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
        const shareOptionKey = e.target.closest('li.editable').getAttribute('data-name'),
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
            e.target.closest('li.editable').classList.remove('edited')
            return this.showEditSummary()
        }

        this.editedFields[ shareOptionKey ].newValue = val
        e.target.closest('li.editable').classList.add('edited')

        this.els.resetBtn.classList.remove('hidden')

        this.showEditSummary()
    },

    onResetBtnClick() {
        this.els.resetBtn.classList.add('hidden')
        this.els.editSummary.classList.add('hidden')
        this.update( this.model )
        this.emit( 'reset', this.model )
    },

    renderDeliveryOptions() {
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

        return this
    },

    renderShareOptions() {
        this.OrderOption.data.forEach( shareOption => {
            this.slurpTemplate( { template: this.templates[ this.optionTemplate ]( shareOption ), insertion: { el: this.els.options } } )
            
            if( this.editable ) {
                this.OrderOptionOptions.data.forEach( option => {
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
        this.els.changes.innerHTML = ''
        
        this.els.options.querySelectorAll('li.edited').forEach( el => {
            const fieldName = el.getAttribute('data-name'),
                  fieldLabel = this.capitalizeFirstLetter( fieldName ),
                  oldValue = this.editedFields[ fieldName ].oldValue
                    ? this.editedFields[ fieldName ].oldValue.toString()
                    : 'none',
                  newValue = this.editedFields[ fieldName ].newValue.toString()

            this.slurpTemplate( { insertion: { el: this.els.changes }, template: this.templates.fieldEdit( { label: fieldLabel, oldValue, newValue } ) } )

        } )

        this.els.editSummary.classList.remove('hidden')
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

        this.OrderOption.get( { query: { shareid: share.id, shareoptionid: { operation: 'join', value: { table: 'shareoption', column: 'id' } } } } )
        .then( () => this.OrderOptionOptions.get() )
        .then( () => this.MemberSelection.get( { query: { membershareid: share.membershareid, shareoptionoptionid: { operation: 'join', value: { table: 'shareoptionoption', column: 'id' } } } } ) )
        .then( () => this.renderShareOptions() )
        .then( () => this.DeliveryOptions.get() )
        .then( () => this.GroupDropoffs.get() )
        .then( () => this.renderDeliveryOptions().show() )
        .catch( this.Error )

    }

} )
