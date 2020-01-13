module.exports = p => {
  return `` +
  `<div>
    <h1>Shopping</h1>
    <p data-js="shoppingIntroText"></p>
    <div class="content">
      <div class="categories-sidebar">
        <h4>Categories</h5>
        <ul data-js="categories" class="categories-list">
          <li data-name="all">All (<span data-js="allItemsCount"></span>)</li>
        </ul>
      </div>
      <div data-view="viewList" data-name="shoppingItems"></div>
    </div>
  </div>`
}