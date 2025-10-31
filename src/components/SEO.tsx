import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
  noindex?: boolean
}

const SEO = ({
  title = 'GrowMyApp — Turn Your Shelf Projects Into Revenue',
  description = 'Connect builders with marketers for equity partnerships. Got projects collecting dust? Find marketers who can bring them to market. Want to market ready-to-launch products? Find builders who need your help. Partner for equity—zero downside, all upside.',
  keywords = 'project marketplace, builder marketer platform, equity partnership, shelf projects, marketing partnerships, technical projects, revenue share, project collaboration, app marketing, product launch, growth marketing, saas marketing, mobile app growth',
  ogImage = 'https://growmyapp.io/logo-bg.png',
  ogType = 'website',
  canonicalUrl = 'https://growmyapp.io/',
  noindex = false,
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}

export default SEO

