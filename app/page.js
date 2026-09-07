import Business from "../components/Business";
import World from "../components/world";
import Politics from "../components/Politics";
import SubscribeBanner from "../components/SubscribeBanner";
import TrendingNews from "../components/TrendingNews";

// ⚠️ Adjust this path to match where this page.js actually lives relative to /public/data
import articleData from "../public/data/article.json";

/**
 * app/page.js — homepage.
 *
 * Composes the Business / World / Politics section components,
 * SubscribeBanner, and TrendingNews — plus full SEO:
 *  - generateMetadata(): title, description, canonical URL, Open Graph,
 *    Twitter card — description/image drawn from the latest articles
 *    across all categories in article.json.
 *  - JSON-LD: WebSite + Organization + ItemList (latest articles site-wide).
 */

// --- Site-wide constants (same values used across article/author/category pages) ---
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"; // ⚠️ replace
const SITE_NAME = "Urban Observer"; // ⚠️ replace if different
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

function getAbsoluteUrl(path) {
  if (!path) return DEFAULT_OG_IMAGE;
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

// Dates in article.json are stored as "DD/MM/YYYY"
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

// Flatten every category's articles, newest first
function getLatestArticles(limit = 8) {
  return Object.entries(articleData)
    .flatMap(([cat, posts]) => posts.map((post) => ({ ...post, categoryKey: cat })))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// generateMetadata — homepage title, description, canonical URL, OG,
// Twitter card. Description/image drawn from the latest article site-wide.
// ---------------------------------------------------------------------------
export async function generateMetadata() {
  const latest = getLatestArticles(3);
  const heroImage = latest[0] ? getAbsoluteUrl(latest[0].image) : DEFAULT_OG_IMAGE;
  const description =
    latest.length > 0
      ? `Latest headlines from ${SITE_NAME}: ${latest.map((a) => a.title).join(", ")}.`
      : `${SITE_NAME} — breaking news, business, technology, and politics coverage.`;

  return {
    title: `${SITE_NAME} — Breaking News, Business, Technology & Politics`,
    description,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title: SITE_NAME,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description,
      images: [heroImage],
    },
  };
}

export default function Home() {
  const latestArticles = getLatestArticles(8);

  // ---------------------------------------------------------------------
  // JSON-LD — WebSite + Organization + ItemList (latest articles),
  // sourced from article.json
  // ---------------------------------------------------------------------
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/logo.png`, // ⚠️ replace with real logo
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}#latest-articles`,
        name: "Latest Articles",
        itemListElement: latestArticles.map((post, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/${post.categoryKey}/${post.slug}`,
          name: post.title,
        })),
      },
    ],
  };

  return (
    <main className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Business />
      <World />
      <Politics />
      <SubscribeBanner />
      <TrendingNews />
    </main>
  );
}