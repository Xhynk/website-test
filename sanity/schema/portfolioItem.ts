import { defineType, defineField } from 'sanity';

export const portfolioItem = defineType({
  name: 'portfolioItem',
  title: 'Portfolio Item',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  orderings: [{ title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: {
    select: { alt: 'alt', media: 'image' },
    prepare({ alt, media }) {
      return { title: alt || 'Untitled', media };
    },
  },
});
