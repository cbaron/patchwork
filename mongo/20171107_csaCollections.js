db.createCollection("Share")
db.createCollection("AddOn")

db.Share.insert( [
    {
        name: 'large',
        label: 'Large Share',
        shareDescription: {
            heading: "Large Share Box",
            price: "$27.50 - $30.00",
            description: "Simply the best bang for your buck. A Large Share will include a wide variety of seasonal fruits and vegetables, the perfect weekly amount for a single family or two vegetarians. Get ready for veggie nirvana!"
        },
        shareExample: {
            heading: "Typical Large Share Box",
            image: "large_share",
            listHeading: "Sample Contents:",
            sampleList: [
                "1 head of lettuce",
                "1.5 lbs summer squash",
                "1.5 lbs tomatoes",
                "2 lbs green cabbage",
                "1.5 lbs eggplant",
                "2 lbs potatoes",
                "1 lb sweet peppers",
                "1 head of garlic",
                "1 lb beans",
                "1 bunch of cilantro",
                "6 ears of corn",
                "and a sunflower!"
            ]
        }
    },
    {
        name: 'small',
        label: 'Small Share',
        shareDescription: {
            heading: "Small Share Box",
            price: "$17.50 - $20.00",
            description: "Think of a Small Share as the Large Share's kid sister &mdash; same great variety of seasonal produce but on a slightly reduced scale. We recommend one Small Share per individual or two each for the vegetarians in the house. If your diet is lacking vegetables and you're serious about eating more, a Small Share is a great introduction to the CSA lifestyle."
        },
        shareExample: {
            heading: "Typical Small Share Box",
            image: "small_share",
            listHeading: "Sample Contents:",
            sampleList: [
                "1 head of lettuce",
                "1 lb sweet peppers",
                "3/4 lb tomatoes",
                "1/2 lb beans",
                "3/4 lb summer squash",
                "1 lb potatoes",
                "1 lb green cabbage",
                "2 ears of corn"
            ]
        }
    }
] )

db.AddOn.insert( [
    {
        name: "Extra Greens",
        price: "$3 per bag",
        description: "Extra Greens will vary each week. Examples include lettuce, spinach, kale, chard, green cabbage, pac choi, Chinese cabbage, tat soi, arugula, or mustards."
    }, {
        name: "Bread Shares",
        price: "$5 per loaf",
        description: "Courtesy of our good friends at {{The Maker's Meadow:null}}! Their bread is baked with whole wheat flour that they soak and grind themselves. Loaves rotate weekly. Enjoy standard, specialty or pizza bread."
    }
] )