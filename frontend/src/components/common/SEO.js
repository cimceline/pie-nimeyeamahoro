import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
  title = 'Academic Portfolio',
  description = 'Academic portfolio and professional profile',
  keywords = '',
  image = '',
  url = '',
  type = 'website',
}) {
  const siteTitle = 'Academic Portfolio';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      <link rel="canonical" href={url || window.location.href} />
    </Helmet>
  );
}
