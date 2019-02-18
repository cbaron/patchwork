db.Pages.updateOne({ "label": "Get Involved" }, { $unset: { "employment.openPositions": "" } })
db.createCollection("OpenPositions")