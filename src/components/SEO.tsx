import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
}

export default function SEO({ 
  title = 'بوابة المعرفة المغربية | منصة تعليمية شاملة',
  description = 'أول منصة تعليمية مغربية شاملة تقدم دروس فيديو، تمارين تفاعلية، وامتحانات وطنية لجميع المستويات.',
  keywords = 'تعليم, دروس, مغرب, باكالوريا, رياضيات, فيزياء, عربية',
  image = 'https://edu-platform-v2.vercel.app/og-image.png',
  url = 'https://edu-platform-v2.vercel.app/'
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
