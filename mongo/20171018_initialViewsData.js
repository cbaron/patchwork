db.createCollection("Views")

db.Views.insert( {
    name: "about",
    label: "About",
    sectionOne: {
        heading: "We are purveyors of veggie variety",
        paragraphs: [
            "Patchwork Gardens is a chemical-free farm located in Dayton, Ohio. Every spring, we plant an 11 acre vegetable garden with the widest variety of produce we can manage. We cover all the garden favorites: spring salad greens, summertime tomatoes, autumn's root crops, and everything in between.",
            "If you've ever had a home garden and enjoyed its bounty, you may be familiar with the crops we cultivate. If you cherish a fondness for any vegetable at all, the chances are good that we've grown it before."
        ]
    },
    sectionTwo: {
        heading: "We are the keepers of chemical-free goodness",
        paragraphs: [
            "We grow our food without the use of any chemical fertilizers, pesticides, or herbicides. Our approach to agriculture favors hard work through diligent cultivation and a culture of healthy soil biology. These make for healthy plants. We plant cover-crops in the off-season and monitor our progress through yearly soil testing.",
            "Our goal is to spread good food and good farming practices within our community. The farm is in its seventh year now, and growing more productive every year as we learn from our collective experiences."
        ]
    },
    sectionThree: {
        heading: "We are constantly growing our membership",
        paragraphs: [
            "Most of what we grow gets directly distributed to our favorite folks &mdash; the hungry, healthy membership of our {{Community Supported Agriculture (CSA) program:csa}}. CSA members receive the lion's share of each week's harvest, a box of produce picked and packed according to what's most ready in the garden. The CSA runs mid-May to January and showcases all the variety of foods that we produce. We also attend farmer's markets and contract with local restaurants. See a map and list locations {{here:locations}}.",
            "We’re proud to be growing great vegetables and are eager to share them. Check us out at a farmer's market or consider joining our CSA today. {{Sign Up:sign-up}}"
        ]
    },
    sectionFour: {
        heading: "We are your friends and neighbors"
    }

} )