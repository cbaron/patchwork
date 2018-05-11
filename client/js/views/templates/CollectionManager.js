module.exports = ( p ) => `<section>
    <div class="left-panel" data-js="leftPanel">
        <section>
            <button class="link" data-js="backBtn">${require('./lib/leftArrow')()}<span>Back to Admin</span></button>
        </section>
        <section>
            <button class="link" data-js="resource"></button>
        </section>
        <section>
            <div data-view="list" data-name="collections"></div>
        </section>
    </div>
    <div data-js="mainPanel" class="main-panel"></div>
</section>`
