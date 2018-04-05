module.exports = ( { opts, ImageSrc } ) => {
    const fields = opts.fields.map( field => `<li data-name="${field.name}">${field.label}</li>` ).join('')

return `` +
`<div>
    <div>
        <img data-src="${ImageSrc('header_sunrays')}" />
    </div>
    <div data-js="nav" class="fd-hidden">
        <div>
            ${require('./lib/justify')}
            <div><span data-js="title" data-name="${opts.home.name}">${opts.home.label}</span></div>
        </div>
        <div>
            <ul data-js="navLinks">${fields}</ul>
            <div>
                <li class="account-ui">
                    <div data-js="signInBtn" class="fd-hidden">Member Sign In</div>
                    <div class="member-ui" data-js="memberMenu" class="fd-hidden">
                        <div data-js="userName"></div>
                        <ul class="account-menu fd-hidden" data-js="accountMenu">        
                            <li data-js="accountBtn">Your Account</li>
                            <li data-js="signOutBtn">Sign Out</li>                         
                        </ul>
                    </div>
                </li>
            </div>
        </div>
        <div><span data-js="csaSignUpBtn">CSA Sign Up</span></div>
    </div>
</div>`
}

/*   
return `` +
`<div>
    <div>
        <img data-src="${ImageSrc('header_sunrays')}" />
    </div>
    <div data-js="nav" class="fd-hidden">
        <div>
            ${require('./lib/justify')}
            <div><span data-js="title" data-name="${opts.home.name}">${opts.home.label}</span></div>
        </div>
        <ul data-js="navLinks">${fields}</ul>
        <div class="account-ui">
            <div data-js="signInBtn" class="fd-hidden">Sign In</div>
            <div class="member-ui" data-js="memberMenu" class="fd-hidden">
                <div data-js="userName"></div>
                <ul class="account-menu fd-hidden" data-js="accountMenu">
                    <li data-js="accountBtn">Your Account</li>
                    <li data-js="signOutBtn">Sign Out</li>         
                </ul>
            </div>
        </div>
    </div>
</div>`




     <div class="account-ui">
            <div data-js="signInBtn" class="fd-hidden">Member Sign In</div>
            <div class="member-ui" data-js="memberMenu" class="fd-hidden">
                <div data-js="userName"></div>
                <ul class="account-menu fd-hidden" data-js="accountMenu">
                    <li data-js="accountBtn">Your Account</li>
                    <li data-js="signOutBtn">Sign Out</li>         
                </ul>
            </div>
        </div>

    const fields = opts.fields.map( field => field.name === 'login'
        ? `<li class="account-ui" data-name="login">
            <div data-js="signInBtn" class="fd-hidden">Member Sign In</div>
            <div class="member-ui" data-js="memberMenu" class="fd-hidden">
                <div data-js="userName"></div>
                <ul class="account-menu fd-hidden" data-js="accountMenu">
                    <li data-js="accountBtn">Your Account</li>
                    <li data-js="signOutBtn">Sign Out</li>         
                </ul>
            </div>
          </li>`
        : `<li data-js="${field.name}" data-name="${field.name}">${field.label}</li>` ).join('')
        */