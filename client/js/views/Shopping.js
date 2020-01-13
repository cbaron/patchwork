const CustomContent = require('./util/CustomContent')

module.exports = { ...require('./__proto__'), ...CustomContent,

  ShoppingModel: require('../models/Shopping'),

  Views: {
    shoppingItems() {
      return {
        model: Object.create(this.Model).constructor({
          collection: Object.create(this.ShoppingModel),
          view: 'ShoppingItem',
          delete: false,
          fetch: true
        })
      }
    }
  },

  events: {
    'categories': 'click'
  },

  filterItems(category) {
    const newDisplayedItems = category === 'all'
      ? this.views.shoppingItems.collection.data
      : this.views.shoppingItems.collection.data.filter(item => item.category === category);

    this.views.shoppingItems.clearItemViews();
    this.views.shoppingItems.createItemViews(newDisplayedItems);
  },

  insertCategories() {
    const categories = this.views.shoppingItems.collection.data.reduce((memo, item) => {
      if (!memo.find(
        category => category.name === item.category
      )) {
        if (item.category) {
          memo.push({
            name: item.category,
            count: 0
          })
        }
      };

      const categoryDatum = memo.find(category => category.name === item.category);
      if (categoryDatum) categoryDatum.count += 1;
      return memo;
    }, []);

    const sortedCategories = categories.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );

    sortedCategories.forEach(category => {
      this.slurpTemplate({
        insertion: { el: this.els.categories },
        template: `<li data-name="${category.name}">${category.name} (${category.count})</li>`
      })
    })
  },

  onCategoriesClick(e) {
    const categoryName = e.target.getAttribute('data-name');
    if (!categoryName) return;
    this.filterItems(categoryName);
  },

  async onNavigation() {
    try {
      this.views.shoppingItems.clearItemViews();
      await this.show();
      await this.views.shoppingItems.fetch();
    } catch(err) { this.Error(err) }
  },

  postRender() {
    this.views.shoppingItems.on('fetched', () => {
      if (!this.views.shoppingItems.itemViews.length) {
        this.els.shoppingIntroText.textContent = 'We currently have no items for sale. Please check back again soon!';
      } else {
        CustomContent.postRender.call(this);
        this.els.allItemsCount.textContent = this.views.shoppingItems.collection.data.length;
        this.insertCategories();
      }
    });

    return this;
  },

  requiresLogin: true

}