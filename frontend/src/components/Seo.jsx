import { Helmet } from 'react-helmet-async';

const SITE = 'Smart Souk';
const SITE_URL = 'https://souk-smart.com';
const DEFAULT_DESC =
  'Boutique en ligne multi-catégories au Maroc. Électronique, maison, mode, sport. Livraison sous 24-48h. Paiement à la livraison.';
const DEFAULT_IMG = `${SITE_URL}/logo.png`;

export default function Seo({
  title,
  description,
  canonical,
  image,
  noindex = false,
  type = 'website',
  schema,
}) {
  const fullTitle = title ? `${title} — ${SITE}` : `${SITE} — Votre boutique en ligne au Maroc`;
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMG;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {schema &&
        (Array.isArray(schema) ? schema : [schema]).map((s, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(s)}
          </script>
        ))}
    </Helmet>
  );
}
