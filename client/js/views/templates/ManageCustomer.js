module.exports = p =>
`<div class="manage-customer">
    <div class="form-grouping">
        <label class="form-label">Search Customers</label>  
        <input class="input-std type="text" id="customer">
    </div>
    <hr>
    <div data-view="customerInfo" class="hide hidden"></div>
    <div data-view="seasons" class="hide hidden"></div>
    <div data-view="orderOptions" class="hide hidden"></div>
    <div data-view="weekOptions" class="hide hidden"></div>
    <div data-view="transactions" class="hide hidden"></div>
</div>`
