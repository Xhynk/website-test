import { sanityClient } from 'sanity:client';

export async function fetchSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]{
    logo,
    footerText,
    socialLinks,
    seoTitle,
    seoDescription,
    ogImage
  }`);
}

export async function fetchHomePage() {
  return sanityClient.fetch(`*[_type == "homePage"][0]{
    heroEyebrow,
    heroHeadingLine1,
    heroHeadingLine2,
    heroBody,
    heroCtaLabel,
    heroCtaHref,
    heroImages,
    strategyEyebrow,
    strategyHeading,
    strategyBody,
    strategyImage,
    servicesEyebrow,
    servicesHeadingLine1,
    servicesHeadingLine2,
    billingHeading,
    ctaHeading,
    ctaButtonLabel,
    ctaButtonHref,
    faqHeading,
    faqSubheading,
    interstitialHeading
  }`);
}

export async function fetchServiceCards() {
  return sanityClient.fetch(`*[_type == "serviceCard"] | order(sortOrder asc){
    title,
    description,
    image,
    sortOrder
  }`);
}

export async function fetchPricingTiers() {
  return sanityClient.fetch(`*[_type == "pricingTier"] | order(sortOrder asc){
    title,
    subtitle,
    price,
    features,
    ctaLabel,
    ctaHref,
    highlighted,
    sortOrder
  }`);
}

export async function fetchFaqItems() {
  return sanityClient.fetch(`*[_type == "faqItem"] | order(sortOrder asc){
    question,
    answer,
    sortOrder
  }`);
}

export async function fetchPortfolioItems() {
  return sanityClient.fetch(`*[_type == "portfolioItem"] | order(sortOrder asc){
    image,
    alt,
    sortOrder
  }`);
}
