import { defineType, defineField } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // Hero
    defineField({ name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string', initialValue: '15+ years experience' }),
    defineField({ name: 'heroHeadingLine1', title: 'Hero Heading Line 1', type: 'string', initialValue: 'Your Story,' }),
    defineField({ name: 'heroHeadingLine2', title: 'Hero Heading Line 2', type: 'string', initialValue: 'My Expertise.' }),
    defineField({
      name: 'heroBody',
      title: 'Hero Body',
      type: 'text',
      rows: 3,
      initialValue: 'Websites are more than code. They a tell your story. I can help that story come to life, and be accessible, functional, and beautiful.',
    }),
    defineField({ name: 'heroCtaLabel', title: 'Hero CTA Label', type: 'string', initialValue: 'Contact Alexander' }),
    defineField({ name: 'heroCtaHref', title: 'Hero CTA Link', type: 'string', initialValue: '/contact' }),
    defineField({
      name: 'heroImages',
      title: 'Hero Portrait Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    // Strategy
    defineField({ name: 'strategyEyebrow', title: 'Strategy Eyebrow', type: 'string', initialValue: "LET'S GET YOU" }),
    defineField({ name: 'strategyHeading', title: 'Strategy Heading', type: 'string', initialValue: 'A Better Strategy for Better Results' }),
    defineField({
      name: 'strategyBody',
      title: 'Strategy Body',
      type: 'text',
      rows: 6,
      initialValue: "I combine over 15 years of development experience with a sharp eye for performance and reliability. Whether you need a mission-critical bug fixed, a WordPress build stabilized, or a long-term development partner, my goal is to deliver solutions that are clean, functional, and future-proof.\n\nI use proven workflows to make sure your website isn't just online, but it's fast, secure, and scalable.\n\nSound like what you need?",
    }),
    defineField({
      name: 'strategyImage',
      title: 'Strategy Image',
      type: 'image',
      options: { hotspot: true },
    }),
    // Services intro
    defineField({ name: 'servicesEyebrow', title: 'Services Eyebrow', type: 'string', initialValue: 'WORKING WITH ALEXANDER...' }),
    defineField({ name: 'servicesHeadingLine1', title: 'Services Heading Line 1', type: 'string', initialValue: '...Is the Best Decision You Can Make!' }),
    defineField({ name: 'servicesHeadingLine2', title: 'Services Heading Line 2', type: 'string', initialValue: 'What Options Are There?' }),
    // Billing
    defineField({ name: 'billingHeading', title: 'Billing Section Heading', type: 'string', initialValue: "Billing Isn't Fun, But It's Necessary" }),
    // CTA
    defineField({ name: 'ctaHeading', title: 'CTA Heading', type: 'string', initialValue: "Let's Bring Your Story To Life" }),
    defineField({ name: 'ctaButtonLabel', title: 'CTA Button Label', type: 'string', initialValue: 'Contact Alexander Today' }),
    defineField({ name: 'ctaButtonHref', title: 'CTA Button Link', type: 'string', initialValue: '/contact' }),
    // FAQ intro
    defineField({ name: 'faqHeading', title: 'FAQ Heading', type: 'string', initialValue: 'Frequently Asked Questions' }),
    defineField({ name: 'faqSubheading', title: 'FAQ Subheading', type: 'string', initialValue: 'Everything you need to know about the service and billing.' }),
    // Interstitial
    defineField({ name: 'interstitialHeading', title: 'Interstitial Heading', type: 'string', initialValue: "Let's Work Together Soon!" }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' };
    },
  },
});
