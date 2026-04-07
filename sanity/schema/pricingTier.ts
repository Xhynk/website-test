import { defineType, defineField } from 'sanity';

export const pricingTier = defineType({
  name: 'pricingTier',
  title: 'Pricing Tier',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
    defineField({ name: 'price', title: 'Price', type: 'string' }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string', initialValue: 'Contact Alexander' }),
    defineField({ name: 'ctaHref', title: 'CTA Link', type: 'string', initialValue: '/contact' }),
    defineField({ name: 'highlighted', title: 'Highlighted (Featured)', type: 'boolean', initialValue: false }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  orderings: [{ title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', price: 'price' },
    prepare({ title, price }) {
      return { title, subtitle: price };
    },
  },
});
