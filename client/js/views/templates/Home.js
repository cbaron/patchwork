module.exports = p =>
`<div>
    <img data-src="${p.ImageSrc('cornucopia')}" />
    <div class="overlay">
        <div>Fresh food from farmers you know</div>
        <div>
            <button class="btn-yellow" data-js="joinBtn" type="button">Join our CSA!</button>
        </div>
    </div>
</div>`