module.exports = p => {
const fields = p.opts.fields.map( field => `<li data-id="${field.name}">${field.label}</li>` ).join('')

return `` +
`<nav data-js="container" class="row header navbar navbar-default">
    <div class="navbar-header">
        <button data-js="hamburger" type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#mobile-menu" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
    </div>

    <div data-js="navbarCollapse" class="collapse navbar-collapse" id="mobile-menu">
        <ul data-js="navLinks" class="nav navbar-nav">
            <li data-id="${p.opts.home.name}">${p.opts.home.label}</li>
            ${fields}
        </ul>
    </div>
    <div class="header-title" data-js="headerTitle" data-id="${p.opts.home.name}">${p.opts.home.label}</div>       
</nav>`
}
