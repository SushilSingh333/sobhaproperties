export default {
  name: 'pricingCard',
  title: 'Pricing Card',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'priceLabel', title: 'Price Label', type: 'string' },
    { name: 'size', title: 'Size', type: 'string' },
    { name: 'unitType', title: 'Unit Type', type: 'string' },
    { name: 'order', title: 'Order', type: 'number' }
  ]
}
