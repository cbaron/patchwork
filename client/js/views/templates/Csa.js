module.exports = p =>
`<div class="client-view">
    <section class="about-csa">
        <h2>What is CSA?</h2>
        <p><strong>Community Supported Agriculture (CSA)</strong> is a direct farm-to-table program granting access to Patchwork Gardens' bountiful harvests for a full season. Members take advantage of benefits and sharing information that regular customers don’t often see.</p>
        <p>Each week, you’ll receive a generous box of fresh produce with the option to add on extra portions of greens or freshly baked bread. This weekly horn of plenty will sync your eating and cooking habits to the season as nature originally intended. You'll also have opportunities to learn about different heirloom produce varieties and cook seasonal-specific recipes -- all while knowing exactly where your food comes from, how it's grown, and who grows it.</p>
    </section>
    <hr>
    <section class="csa-fit">
        <h2 data-js="howDoIKnow">How do I know if the CSA Program is right for me?</h2>
        <p>Patchwork Gardens' CSA Program is a great fit if:</p>
        <ul data-js="csaStatements"></ul>
    </section>
    <section class="csa-contents">
        <h2>What does a typical box contain and what size share is best?</h2>
        <p>The quantity and variety of each box depends on the type of share you purchase.</p>
        <div class="share-examples">
            <div>
                <h4>Typical Large Share Box</h4>
                <div><img src="/static/img/cornucopia.jpg" /></div>
                <div>Sample Contents:</div>
                <ul data-js="shareExampleLg"></ul>
            </div>
            <div>
                <h4>Typical Small Share Box</h4>
                <div><img src="/static/img/cornucopia.jpg" /></div>
                <div>Sample Contents:</div>
                <ul data-js="shareExampleSm"></ul>
            </div>
        </div>
        <div class="share-descriptions">
            <div>
                <div>
                    <span>Large Share Box</span><span>|</span><span>$27.50 - $30.00</span>
                </div>
                <p>Simply the best bang for your buck. A Large Share will include a wide variety of seasonal fruits and vegetables, the perfect weekly amount for a single family or two vegetarians. Get ready for veggie nirvana! <span class="sign-up">sign up</span></p>
            </div>
            <div>
                <div>
                    <span>Small Share Box</span><span>|</span><span>$17.50 - $20.00</span>
                </div>
                <p>Think of a Small Share as the Large Share's kid sister - same great variety of seasonal produce but on a slightly reduced scale. We recommend one Small Share per individual or two each for the vegetarians in the house. If your diet is lacking vegetables and you're serious about eating more, a Small Share is a great introduction to the CSA lifestyle. <span class="sign-up">sign up</span></p>
            </div>
        </div>
        <div>
            <button type="button">Sign Up Now!</button>
        </div>
    </section>
    <hr>
    <div class="how">
        <h2>How do I get my box each week?</h2>
        <div data-js="how"></div>
    </div>
</div>`

/*    <h3>
        <button data-js="signupBtn" class="btn btn-link signup-btn">Join our CSA!</button>
    </h3>*/