module.exports = {
  attributes: [
    {
      name: 'action',
      label: 'Type',
      metadata: {
        options: [
          { name: 'payment', label: 'Payment' },
          { name: 'refund', label: 'Refund' },
          { name: 'other', label: 'Other' }
        ]
      },
      range: 'String',
    },
    {
      name: 'amount',
      label: 'Amount',
      range: 'Float'
    },
    {
      name: 'checkNumber',
      label: 'Check Number',
      range: 'String'
    },
    {
      name: 'notes',
      label: 'Notes',
      range: 'Text'
    }
  ]
}