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
        <div data-js="shareExamples" class="share-examples">
            <div>
                <h4>Typical Large Share Box</h4>
                <div><img src="/static/img/cornucopia.jpg" /></div>
                <div>Sample Contents:</div>
                <ul data-js="shareExample"></ul>
            </div>
            <div>
                <h4>Typical Small Share Box</h4>
                <div><img src="/static/img/cornucopia.jpg" /></div>
                <div>Sample Contents:</div>
                <ul data-js="shareExample"></ul>
            </div>
        </div>
        <p>This box has a retail value of about $30. Small shares will receive a smaller variety of fruits and vegetables. We try to do our best to have plenty of everything we grow to provide a satisfying box for all of our members. However, in the event that particular fruits or vegetables are in limited supply, large shares will receive preference.  This is one reason to consider a Large share if appropriate for your eating habits.</p>
        <div class="csa-customization">
            <h2>New this year: customize your box!</h2>
            <div data-js="customize"></div>
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