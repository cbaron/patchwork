module.exports = p =>
`<li data-js="container" class="share" data-id="${p.id}">
    <div>
        <div data-js="shareBox"></div>
        <div>${p.description}</div>
    </div>
</li>`