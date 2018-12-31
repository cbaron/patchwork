module.exports = { ...require('./__proto__'),

    events: {
        customizeBtn: 'click',
        listSelect: 'change',
        viewBtn: 'click',
        rows: 'click',
        sendEmailBtn: 'click',
        upload: 'change'
    },

    model: require('../models/WeeklyReminder'),

    Spinner: require('../plugins/spinner.js'),

    clearTable() {
        this.removeChildren( this.els.columns )
        this.removeChildren( this.els.rows )
    },

    handleColumns( rows ) {
        this.model.metadata.columns.forEach( column => this.slurpTemplate( {
            template: `<li>${column.label}</li>`,
            insertion: { el: this.els.columns }
        } ) )
    },

    handleRows( rows ) {
        const template = rows.map( row => {
            const className = row.isSkipping ? 'isSkipping' : ''
            const columns = this.model.metadata.columns.map( column => `<li>${row[column.name] || ''}</li>` ).join('')
            return `<ol data-id="${row.memberShareId}" class="${className}">${this.Format.GetIcon('minus')}${this.Format.GetIcon('plus')}${columns}</ol>`
        } ).join('')

        this.slurpTemplate( { template, insertion: { el: this.els.rows } } )
    },

    noResults() {
        this.els.empty.classList.remove('fd-hidden')
    },

    onCustomizeBtnClick() {
        this.els.customArea.classList.toggle('fd-hidden')
    },

    onListSelectChange( e ) {
        this.model.selectedCategory = e.target.value
        if( this.selectedCategoryEl ) this.selectedCategoryEl.parentNode.classList.add('fd-hidden')
        this.selectedCategoryEl = this.model.selectedCategory === 'newsletter' ? undefined : this.els[ `${e.target.value}Select` ]
        this.els.subjectLine.value = `Weekly ${this.model.selectedCategory === 'newsletter' ? 'Newsletter' : 'Reminder'} from Patchwork Gardens`
        if( this.selectedCategoryEl ) this.selectedCategoryEl.parentNode.classList.remove('fd-hidden')
    },

    onRowsClick( e ) {
        const svgEl = e.target.closest('SVG')
        if( !svgEl || this.model.selectedCategory === 'newsletter' ) return

        const row = e.target.closest('OL')
        const datum = this.model.data.find( datum => datum.memberShareId == row.getAttribute('data-id') )

        row.classList.toggle('isSkipping')
        datum.isSkipping = row.classList.contains('isSkipping')
    },

    async onSendEmailBtnClick() {
        if( this.isSubmitting ) return
        this.isSubmitting = true

        this.spinner.spin()
        this.els.sendEmailBtn.appendChild( this.spinner.el )
        this.els.sendEmailBtn.classList.add('has-spinner')

        const emailList = this.model.data.filter( datum => !datum.isSkipping )

        this.model.emailIsCustom = this.els.customizeBtn.checked
        this.model.customTextValue = this.els.customText.value
        this.model.replaceDefaultTemplate = this.els.replaceDefaultBtn.checked
        this.model.subjectLine = this.els.subjectLine.value

        const emails = this.model.sortIntoEmails( emailList )

        const response = await this.Xhr( {
            method: 'post',
            resource: 'weekly-reminder',
            data: JSON.stringify( { emails, attachments: this.model.attachments } )
        } )

        this.isSubmitting = false
        this.spinner.stop()
        this.els.sendEmailBtn.classList.remove('has-spinner')
        return response.error ? this.Toast.showMessage( 'error', response.error ) : this.Toast.showMessage( 'success', 'Emails sent!' )
    },

    onUploadChange() {
        const files = Array.from( this.els.upload.files )

        if( !files.length ) {
            this.model.attachments = [ ]
            return
        }

        files.forEach( file => {
            const reader = new FileReader()

            reader.addEventListener( 'load', e => {
                const base64String = reader.result.slice( reader.result.indexOf('base64') + 7 )

                this.model.attachments.push( {
                    content: base64String,
                    filename: file.name,
                    type: file.type,
                    disposition: 'attachment'
                } )
            } )

            reader.readAsDataURL( file )
        } )
    },

    async onViewBtnClick() {
        const selection = this.selectedCategoryEl ? this.selectedCategoryEl.value : undefined
        await this.model.get( { query: { category: this.model.selectedCategory, selection } } )

        this.clearTable()

        if( this.model.data.length == 0 ) return this.noResults()
    
        this.els.empty.classList.add('fd-hidden')

        if( this.model.selectedCategory !== 'newsletter' ) await Promise.all( this.model.data.map( customer => this.model.getSkipWeekStatus( customer ) ) )

        this.handleColumns( this.model.data )
        this.handleRows( this.model.data )

        this.els.sendEmailBtn.parentNode.classList.remove('fd-hidden')
        this.slideIn( this.els.sendEmailBtn.parentNode, 'right' )
        this.slideIn( this.els.results, 'right' )
    },

    postRender() {
        Promise.all( [ this.model.ContactInfo.get(), this.model.CurrentGroups.get(), this.model.DeliveryRoute.get( { query: { label: 'farm' } } ) ] )
        .then( () => {
            this.slurpTemplate( {
                insertion: { el: this.els.daySelect },
                template: this.model.getDayOptions()
            } )

            this.slurpTemplate( {
                insertion: { el: this.els.singleGroupSelect },
                template: this.model.getGroupNameOptions()
            } )

            this.model.selectedCategory = 'day'
            this.selectedCategoryEl = this.els.daySelect

            this.spinner = new this.Spinner( {
                color: '#000',
                lines: 7,
                length: 4,
                radius: 16,
                scale: 0.6
            } )
        } )
        .catch( this.Error )

        return this
    }

}