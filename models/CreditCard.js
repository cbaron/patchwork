module.exports = {
    attributes: [ {
        name: 'ccNo',
        label: 'Card Number',
        range: 'String',
        error: 'A credit card number is required',
        prompt: 'Visa, MasterCard, American Express, JCB, Discover, and Diners Club are accepted.'
    }, {
        name: 'ccMonth',
        label: 'Exp Month',
        metadata: {
            options: [
                { name: '1', label: '01' },
                { name: '2', label: '02' },
                { name: '3', label: '03' },
                { name: '4', label: '04' },
                { name: '5', label: '05' },
                { name: '6', label: '06' },
                { name: '7', label: '07' },
                { name: '8', label: '08' },
                { name: '9', label: '09' },
                { name: '10', label: '10' },
                { name: '11', label: '11' },
                { name: '12', label: '12' }
            ]
        },
        range: 'String',
        error: 'A credit card month expiration is required'
    }, {
        name: 'ccYear',
        label: 'Exp Year',
        metadata: {
            options: [
                { name: '2018', label: '2018' },
                { name: '2019', label: '2019' },
                { name: '2020', label: '2020' },
                { name: '2021', label: '2021' },
                { name: '2022', label: '2022' },
                { name: '2023', label: '2023' },
                { name: '2024', label: '2024' },
                { name: '2025', label: '2025' },
                { name: '2026', label: '2026' }
            ]
        },
        range: 'String',
        error: 'A credit card year expiration is required'
    }, {
        name: 'cvc',
        label: 'CVC',
        range: 'String',
        error: 'A credit card cvc is required'
    } ]
}