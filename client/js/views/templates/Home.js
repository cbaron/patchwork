module.exports = p =>
`<div>
    <img data-src="${p.ImageSrc('cornucopia-home')}" />
    <div class="overlay">
        <div data-js="slogan"></div>
        <div>
            <button class="btn-yellow" data-js="joinBtn" type="button">Join our CSA!</button>
        </div>
        <div class="newsletter">
            <div>Subscribe to our weekly newsletter!</div>
            <div>
                <input data-js="email" type="email" placeholder="Enter your email." />
                <button class="btn-yellow" data-js="newsletterBtn">Submit</button>
            </div>
        </div>
    </div>
</div>`