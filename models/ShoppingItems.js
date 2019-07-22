module.exports = {
  attributes: [
    {
      name: 'name',
      label: 'Name',
      range: 'String'
    },
    {
      name: 'label',
      label: 'Label',
      range: 'String'
    },
    {
      name: 'available',
      label: 'Available',
      range: 'Float'
    },
    {
      name: 'amountOptions',
      label: 'Amount Options',
      range: 'List',
      itemView: 'form',
      itemRange: [
        {
          name: 'amount',
          label: 'Amount',
          range: 'Integer'
        },
        {
          name: 'price',
          label: 'Price',
          range: 'Float'
        },
        {
          name: 'image',
          label: 'Image',
          range: 'ImageUrl'
        }
      ]
    },
    {
      name: 'quantityOptions',
      label: 'Quantity Options',
      range: 'List',
      itemRange: 'Integer'
    },
    {
      name: 'description',
      label: 'Description',
      range: 'Text'
    },
    {
      name: 'unit',
      label: 'Unit',
      range: 'String'
    },
  ]
}