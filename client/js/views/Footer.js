module.exports = Object.assign( {}, require('./__proto__'), {

    size() {
        const body = document.body,
            container = this.els.container
            
        let difference

        if( container.style.display === 'none' ) return
        if( container.style.height ) this.els.templateData.container.attr('style','')

        difference = body.clientHeight - body.offsetTop + this.els.clientHeight

        if( difference > 0 ) container.style.height = `${( container.height() + difference )}px`

        return this
    }

} )
