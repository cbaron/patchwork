module.exports = { ...require('./__proto__'),

    events: {
        listSelect: 'change',
        viewBtn: 'click',
        rows: 'click'
    },

    model: require('../models/WeeklyReminder'),

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
            return `<ol class="${className}">${this.Format.GetIcon('minus')}${this.Format.GetIcon('plus')}${columns}</ol>`
        } ).join('')

        this.slurpTemplate( { template, insertion: { el: this.els.rows } } )
    },

    noResults() {
        this.els.empty.classList.remove('fd-hidden')
    },

    onListSelectChange( e ) {
        this.selectedCategory = e.target.value
        this.selectedCategoryEl.parentNode.classList.add('fd-hidden')
        this.selectedCategoryEl = this.els[ `${e.target.value}Select` ]
        this.selectedCategoryEl.parentNode.classList.remove('fd-hidden')
    },

    onRowsClick( e ) {
        const svgEl = e.target.closest('SVG')
        if( !svgEl ) return
        e.target.closest('OL').classList.toggle('isSkipping')
    },

    async onViewBtnClick() {
        const emailList = await this.model.get( { query: { category: this.selectedCategory, selection: this.selectedCategoryEl.value } } )

        this.clearTable()

        if( emailList.length == 0 ) return this.noResults()
    
        this.els.empty.classList.add('fd-hidden')

        await Promise.all( emailList.map( customer => this.model.getSkipWeekStatus( customer ) ) )

        this.handleColumns( emailList )
        this.handleRows( emailList )
        this.els.sendEmailBtn.parentNode.classList.remove('fd-hidden')
    },

    postRender() {
        this.model.CurrentGroups.get()
        .then( () => {
            this.slurpTemplate( {
                insertion: { el: this.els.daySelect },
                template: this.model.getDayOptions()
            } )

            this.slurpTemplate( {
                insertion: { el: this.els.singleGroupSelect },
                template: this.model.getGroupNameOptions()
            } )

            //this.slurpTemplate( {
              //  insertion: { el: this.els.locationSelect },
                //template: this.model.getLocationOptions()
            //} )

            this.selectedCategory = 'day'
            this.selectedCategoryEl = this.els.daySelect
        } )
        .catch( this.Error )

        return this
    }

}