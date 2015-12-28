var _ = require('underscore'),
    TabView = function() { return this }

_.extend( TabView.prototype, {

    render: function() {

        require('../MyView').prototype.render.call(this)

        this.currentTab = this.tabs[0]
        this.$( this.templateData.tab[0] ).addClass('selected');
        this.$( this.templateData.tabContent[0] ).removeClass('hide');

        this.tabViews = {
            [ this.currentTab.id ]: new ( this.currentTab.view )( {
                container: this.$( this.templateData.tabContent.filter( this.util.format( '[data-tab="%s"]', this.currentTab.id ) )[0] ),
                user: this.user
            } )
        }

    },

} );

module.exports = TabView
