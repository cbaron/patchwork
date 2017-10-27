module.exports = p =>
`<div>
    <h1>CSA Program</h1>
    <section class="about-csa">
        <h2>What is CSA?</h2>
        <p>Community Supported Agriculture (CSA) is a direct farm-to-table program granting access to Patchwork Gardens' bountiful harvests for a full season. Members take advantage of benefits and sharing information that regular customers don’t often see.</p>
        <p>Each week, you’ll receive a generous box of fresh produce with the option to add on extra portions of greens or freshly baked bread. This weekly horn of plenty will sync your eating and cooking habits to the season as nature originally intended. You'll also have opportunities to learn about different heirloom produce varieties and cook seasonal-specific recipes &mdash; all while knowing exactly where your food comes from, how it's grown, and who grows it.</p>
    </section>
    <div>
        <img data-src="${p.ImageSrc('csa_divider-1')}" />
    </div>
    <section class="csa-fit">
        <h2 data-js="howDoIKnow">How do I know if the CSA Program is right for me?</h2>
        <p>Patchwork Gardens' CSA Program is a great fit if:</p>
        <ul data-js="csaStatements">
            <li>You want to know your farmer and support local business</li>
            <li>You want to eat the freshest and best tasting produce available</li>
            <li>You want a wide variety of seasonal produce</li>
            <li>You have a willingness to try new foods and recipes</li>
        </ul>
    </section>
    <section class="csa-contents">
        <h2>What does a typical box contain and what size share is best?</h2>
        <p>The quantity and variety of each box depends on the type of share you purchase.</p>
        <div class="share-examples">
            <div>
                <h4>Typical Large Share Box</h4>
                <div><img data-src="${p.ImageSrc('large_share')}" /></div>
                <div>Sample Contents:</div>
                <ul data-js="shareExampleLg"></ul>
            </div>
            <div>
                <h4>Typical Small Share Box</h4>
                <div><img data-src="${p.ImageSrc('small_share')}" /></div>
                <div>Sample Contents:</div>
                <ul data-js="shareExampleSm"></ul>
            </div>
        </div>
        <div class="share-descriptions">
            <div class="item-detail">
                <div>
                    <span>Large Share Box</span>
                    <span>|</span>
                    <span>$27.50 - $30.00</span>
                </div>
                <p>Simply the best bang for your buck. A Large Share will include a wide variety of seasonal fruits and vegetables, the perfect weekly amount for a single family or two vegetarians. Get ready for veggie nirvana! <span data-name="sign-up" data-js="link" class="link">Sign Up</span></p>
            </div>
            <div class="item-detail">
                <div>
                    <span>Small Share Box</span>
                    <span>|</span>
                    <span>$17.50 - $20.00</span>
                </div>
                <p>Think of a Small Share as the Large Share's kid sister - same great variety of seasonal produce but on a slightly reduced scale. We recommend one Small Share per individual or two each for the vegetarians in the house. If your diet is lacking vegetables and you're serious about eating more, a Small Share is a great introduction to the CSA lifestyle. <span data-name="sign-up" data-js="link" class="link">Sign Up</span></p>
            </div>
        </div>
        <p>We do our best to keep all items fully in stock to provide a satisfying box for all of our members. However, in the event that particular fruits or vegetables are in limited supply, Large Shares will receive preference, another great reason to consider this option.</p>
        <div class="button-row">
            <button class="btn-yellow" data-js="signupBtn" type="button">Sign Up Now!</button>
        </div>
    </section>
    <div>
        <img data-src="${p.ImageSrc('csa_divider-2')}" />
    </div>
    <section class="delivery">
        <h2>How do I get my box each week?</h2>
        <p>Patchwork Gardens is happy to offer Home Delivery for just $1.50 per box! We encourage anyone living within our current <span data-name="locations" data-js="link" class="link">delivery range</span> to consider this option. Enjoy hassle-free to-your-door service! Simply set out the empty box from the previous week on your doorstep and we'll do the rest. We also offer <span data-name="locations" data-js="link" class="link">on-farm pickup</span> or <span data-name="locations" data-js="link" class="link">group drop-off</span>.</p>
        <div class="delivery-matrix" data-js="deliveryMatrix"></div>
    </section>
    <section>
        <h2>Can I customize my box?</h2>
        <p>Yes! Every member is welcome to opt-out of a specific kind of vegetable in a given season, meaning you'll never have to discard that unused kohlrabi ever again! Every week throughout the season when that vegetable would normally go in the box, we'll replace it with an alternate item. This will ensure you receive more of the vegetables that your really like!<p>
    </section>
    <section>
        <h2>What Add-Ons are available?</h2>
        <p>Want to add a bit more to the bounty? We've got you covered with these optional add-ons.
        <div class="add-ons">
            <div class="item-detail">
                <div>
                    <span>Extra Greens</span>
                    <span>|</span>
                    <span>$3 per bag</span>
                </div>
                <p>Extra Greens will vary each week. Examples include lettuce, spinach, kale, chard, green cabbage, pac choi, Chinese cabbage, tat soi, arugula, or mustards.</p>
            </div>
            <div class="item-detail">
                <div>
                    <span>Bread Shares</span>
                    <span>|</span>
                    <span>$5 per loaf</span>
                </div>
                <p>Courtesy of our good friends at <a href="" class="link">The Maker's Meadow</a>! Their bread is baked with whole wheat flour that they soak and grind themselves. Loaves rotate weekly. Enjoy standard, specialty or pizza bread.</p>
            </div>
        </div>
    </section>
    <section>
        <h2>How do I pay?</h2>
        <p>We require payment in full before the start of each season. For those who sign up using our <span data-name="sign-up" data-js="link" class="link">online form</span>, you'll have the opportunity to pay with a credit card at the end of the process.</p>
        <p>We also accept check. Please deliver and make payable to</p>
        <div class="contact">
            <div>Patchwork Gardens</div>
            <div>9057 W 3rd St</div>
            <div>Dayton, OH 45417</div>
        </div>
        <p>Please <a href="mailto:eat.patchworkgardens@gmail.com" class="link">email us</a> for information on payment plan options.</p>
        <div class="button-row">
            <button class="btn-yellow" data-js="signupBtn" type="button">Sign Up Now!</button>
        </div>
    </section>
</div>`