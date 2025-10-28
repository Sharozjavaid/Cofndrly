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
  title = 'cofndrly — where builders meet storytellers',
  description = 'Not another networking app — a place to start something. Connect technical builders with growth hackers, content creators, and marketers to launch your next startup.',
  keywords = 'co-founder matching, find co-founder, technical co-founder, startup co-founder, growth hacker, content creator, entrepreneur networking, startup founders, builder network, marketing co-founder',
  ogImage = 'https://cofndrly.com/og-image.png',
  ogType = 'website',
  canonicalUrl = 'https://cofndrly.com/',
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

