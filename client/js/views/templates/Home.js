module.exports = p =>
`<div>
    <img data-src="${p.ImageSrc('cornucopia-home')}" />
    <div class="overlay">
        <div data-js="slogan"></div>
        <div>
            <button class="btn-yellow" data-js="joinBtn" type="button">Join our CSA!</button>
        </div>
    </div>
</div>`