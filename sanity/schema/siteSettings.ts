import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
      initialValue: '© 2026 Alexander Demchak - All rights reserved.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'Default SEO Title',
      type: 'string',
      initialValue: 'Alexander Demchak — Fractional CTO & Web Developer',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO Description',
      type: 'text',
      rows: 3,
      initialValue:
        'Over 15 years of web development experience. Fractional CTO services, development retainers, and ad-hoc development.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
