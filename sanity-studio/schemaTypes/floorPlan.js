export default {
  name: 'floorPlan',
  title: 'Floor Plan',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'image', title: 'Image', type: 'image' },
    { name: 'showButton', title: 'Show Button', type: 'boolean' },
    { name: 'order', title: 'Order', type: 'number' }
  ]
}
