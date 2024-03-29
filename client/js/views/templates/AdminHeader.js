module.exports = p =>
`<nav data-js="container" class="admin-header">
    <div class="clearfix hidden-xs">
        <div class="logo-container">
            <img src="${p.opts.logo}"/>
        </div>
        <div data-js="userPanel" class="pull-right hide">
            <button data-js="signoutBtn" class="btn btn-link">Sign Out</button>
            <span data-js="name"></span>
            <span data-js="profileBtn" class="glyphicon glyphicon-user hide"></span>
        </div>
    </div>
</nav>`
