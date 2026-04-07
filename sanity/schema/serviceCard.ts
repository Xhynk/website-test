import { defineType, defineField } from 'sanity';

export const serviceCard = defineType({
  name: 'serviceCard',
  title: 'Service Card',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  orderings: [{ title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', order: 'sortOrder' },
    prepare({ title, order }) {
      return { title: `${order}. ${title}` };
    },
  },
});
