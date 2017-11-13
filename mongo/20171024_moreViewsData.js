db.Pages.insert( {
    name: "locations",
    label: "Locations",
    intro: "Patchwork Gardens has a truly local presence, and chances are our veggies are closer than you think. Use the interactive map above or read below to find locations where we sell and distribute our chemical-free produce.",
    farmersMarkets: {
        heading: "Farmers Markets",
        description: "For the past 7 years, PWG has been attending Yellow Springs Saturday market, where we've had the good fortune to form friendships and positive relationships with many customers. We are pleased to be a reliable source of fresh, healthy food for those who prefer to purchase through the weekly market. Come out and say hello!"
    },
    retailOutlets: {
        heading: "Retail Outlets",
        description: "We currently partner with two retail outlets in order to provide produce to an expanded customer base, and to complement the goods and services being provided by other businesses. You can buy our produce on a weekly basis at the following outlets:"
    },
    restaurants: {
        heading: "Restaurants",
        description: "We are proud to supply our region’s restaurants with healthy, locally grown, and seasonal produce. PWG sells to restaurants whose owners, chefs, and cooks value using local, chemical-free ingredients. We strive to offer an abundance and wide variety of high-quality vegetables and fruits to our buyers all year long. The following list of restaurants cook with PWG produce:"
    },
    pickupLocations: {
        heading: "Group Pick-Up Locations",
        description: "Group Locations are shown below. There is no additional fee for this service."
    }
} )

db.Pages.insert( {
    name: "get-involved",
    label: "Get Involved",
    employment: {
        heading: "Employment Opportunities",
        description: "We are currently hiring for the following positions:",
        openPositions: [
            "Seed-Starting and Transplant House Operator",
            "CSA Produce Packer & Delivery Driver"
        ]
    },
    internships: {
        heading: "Internships",
        description: "Patchwork Gardens is happy to offer internship opportunities for those interested in immersing themselves in the work and lifestyle of chemical-free farming. We prefer candidates who are able to work full-time (40-60 hours/week) and willing to stay with us for the length of the entire growing season (mid-April &ndash; November). There's also work to be done in winter, so we gladly welcome applicants any time of year. The right person could have the opportunity to become a long-term partner in the farm. We are a young, energetic group, learning fast and making progress in our first seven years of growing. We are quickly expanding in the Dayton area and seek applicants whose energy will help us grow our business.",
        application: "To apply, please fill out the {{Patchwork Gardens Internship Application:https://docs.google.com/forms/d/1YAW7JYS4KuvWZJJf7K8Qn4RNvmjP-WtauUd3AclN09s/viewform}}. We’ll get in touch with you once we’ve received your information."
    },
    internDuties: {
        heading: "Major Duties",
        dutyList: [
            "Starting plants from seed and transplanting seedlings into the garden",
            "Preparation and maintenance of garden including tilling, broadforking, spreading manure, watering, weeding and mulching",
            "Harvesting, cleaning, packing, and delivering produce for our CSA, wholesale customers, and farmers markets",
            "Sharing in responsibility of feeding, watering, and other care of livestock (chickens, pigs, sheep)",
            "Providing assistance with construction projects and maintenance of farm infrastructure"
        ]
    },
    internQualifications: {
        heading: "Desired Qualifications",
        qualificationList: [
            "Knowledge of and experience with growing vegetables without added chemicals",
            "Strong work ethic and desire to learn",
            "Self-motivated and willing to take initiative",
            "Attention to detail and efficiency",
            "Creativity and love for a sustainable lifestyle"
        ],
    },
    internCompensation: {
        heading: "Compensation",
        compensationList: [
            "Meals including fresh produce from the farm, grass-fed beef and pork, pastured chickens, and raw milk, all raised responsibly and locally by friends",
            "Housing in the renovated loft of our reconstructed 100+ year old barn is available but not required",
            "Weekly stipend increasing with length of stay and performance"
        ],
    },
    volunteer: {
        heading: "Volunteer",
        description: "Want to help out at Patchwork Gardens? Throughout the growing season, there are a variety of opportunities for those who would like to lend a helping hand. To share your interest, please fill out the {{Patchwork Gardens Volunteer Form:https://docs.google.com/forms/d/1GuFrGKvpzJaFY5Dhz3kBsIy_AaY6xZ3NzuqTzvOFmrw/viewform}}."
    }
} )

db.Pages.insert( {
    name: "csa",
    label: "CSA",
    aboutCSA: {
        heading: "What is CSA?",
        description: [
            "Community Supported Agriculture (CSA) is a direct farm-to-table program granting access to Patchwork Gardens' bountiful harvests for a full season. Members take advantage of benefits and sharing information that regular customers don’t often see.",
            "Each week, you’ll receive a generous box of fresh produce with the option to add on extra portions of greens or freshly baked bread. This weekly horn of plenty will sync your eating and cooking habits to the season as nature originally intended. You'll also have opportunities to learn about different heirloom produce varieties and cook seasonal-specific recipes &mdash; all while knowing exactly where your food comes from, how it's grown, and who grows it."
        ]
    },
    dividerImageOne: 'csa_divider-1',
    csaFit: {
        heading: "How do I know if the CSA Program is right for me?",
        description: "Patchwork Gardens' CSA Program is a great fit if:",
        csaFitStatements: [
            "You want to know your farmer and support local business",
            "You want to eat the freshest and best tasting produce available",
            "You want a wide variety of seasonal produce",
            "You have a willingness to try new foods and recipes"
        ]
    },
    csaContents: {
        heading: "What does a typical box contain and what size share is best?",
        description: "The quantity and variety of each box depends on the type of share you purchase.",
        sharePriority: "We do our best to keep all items fully in stock to provide a satisfying box for all of our members. However, in the event that particular fruits or vegetables are in limited supply, Large Shares will receive preference, another great reason to consider this option."
    },
    dividerImageTwo: "csa_divider-2",
    csaDelivery: {
        heading: "How do I get my box each week?",
        description: "Patchwork Gardens is happy to offer Home Delivery for just $1.50 per box! We encourage anyone living within our current {{delivery range:locations}} to consider this option. Enjoy hassle-free to-your-door service! Simply set out the empty box from the previous week on your doorstep and we'll do the rest. We also offer {{on-farm pickup:locations}} or {{group drop-off:locations}}."
    },
    csaCustomization: {
        heading: "Can I customize my box?",
        description: "Yes! Every member is welcome to opt-out of a specific kind of vegetable in a given season, meaning you'll never have to discard that unused kohlrabi ever again! Every week throughout the season when that vegetable would normally go in the box, we'll replace it with an alternate item. This will ensure you receive more of the vegetables that your really like!"
    },
    addOns: {
        heading: "What Add-Ons are available?",
        description: "Want to add a bit more to the bounty? We've got you covered with these optional add-ons.",
    },
    payment: {
        heading: "How do I pay?",
        description: "We require payment in full before the start of each season. For those who sign up using our {{online form:sign-up}}, you'll have the opportunity to pay with a credit card at the end of the process.",
        payableTo: "We also accept check. Please deliver and make payable to",
        emailUs: "Please {{email us:mailto:eat.patchworkgardens@gmail.com}} for information on payment plan options."
    }
} )

db.Pages.insert( {
    name: "contact",
    label: "Contact",
    intro: [
        "Questions? Comment? Suggestions?",
        "We'd love to hear from you!"
    ]
} )

db.Pages.insert( {
    name: "home",
    label: "Home",
    slogan: "Fresh food from farmers you know"
} )