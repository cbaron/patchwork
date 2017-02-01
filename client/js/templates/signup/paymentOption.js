module.exports = p =>
`<li data-js="container" class="payment-option">
    <div>${p.label}</div>
    <div>${p.note}</div>
    <div class="method-total"></div>    
</li>`
