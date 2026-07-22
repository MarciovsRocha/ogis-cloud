import { Helmet } from "react-helmet-async";
import { BRAND } from "../config.js";

const DEFAULT_DESC =
  "Do domínio ao sistema de gestão, uma mensalidade cuida de tudo. Site, e-mail profissional e sistemas sob medida para PMEs de Curitiba, com um único responsável.";

// JSON-LD LocalBusiness (skill seo-local-business) — negócio de serviços em Curitiba.
const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "ogis.cloud",
  description: DEFAULT_DESC,
  url: "https://ogis.cloud",
  email: BRAND.email,
  areaServed: "Curitiba e Região Metropolitana, PR",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Curitiba",
    addressRegion: "PR",
    addressCountry: "BR",
  },
  slogan: BRAND.tagline,
};

export default function SEO({ title, description, path = "/", noindex = false }) {
  const fullTitle = title ? `${title} | ${BRAND.name}` : `${BRAND.name} — Presença digital e sistemas gerenciados`;
  const desc = description || DEFAULT_DESC;
  const url = `https://ogis.cloud${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <script type="application/ld+json">{JSON.stringify(LOCAL_BUSINESS_JSONLD)}</script>
    </Helmet>
  );
}
