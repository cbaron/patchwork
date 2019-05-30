module.exports = p => {
    const fields = p.opts.fields.map( field => `<li data-name="${field.name}">${field.label}</li>` ).join('')

return `` +
`<div>
    <div>
        <img data-src="${p.ImageSrc('header_sunrays')}" />
    </div>
    <div data-js="nav" class="fd-hidden header-content">
        <div class="cart" data-js="cart">
            <span>${p.GetIcon('shoppingCart')}</span>
            <span data-js="cartCount">(0)</span>
        </div>
        <div class="title">
            ${require('./lib/justify')}
            <div><span data-js="title" data-name="${p.opts.home.name}">${p.opts.home.label}</span></div>
        </div>
        <div class="nav">
            <ul data-js="navLinks">${fields}</ul>
            <ul>
                <li>
                    <div data-js="signInBtn" class="fd-hidden">Member Sign In</div>
                    <div class="member-ui" data-js="memberMenu" class="fd-hidden">
                        <div data-js="userName"></div>
                        <ul class="account-menu fd-hidden" data-js="accountMenu">        
                            <li data-js="accountBtn">Your Account</li>
                            <li data-js="shoppingBtn">Shopping</li>
                            <li data-js="signOutBtn">Sign Out</li>                         
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div><span data-js="csaSignUpBtn">CSA Sign Up</span></div>
    </div>
</div>`
}