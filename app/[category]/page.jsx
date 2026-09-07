import Image from "next/image";
import Link from "next/link";

// ⚠️ Adjust these paths to match where this page.jsx actually lives relative to /public/data
import articleData from "../../public/data/article.json";
import authorData from "../../public/data/author.json";

const DEFAULT_AVATAR = "/images/image3.webp";

/**
 * app/[category]/page.jsx — dynamic category page.
 *
 * Grey banner header with category name + secondary category nav capped
 * with a bold black rule, 4-column grid of article cards with the white
 * overlapping title box — plus full SEO:
 *  - generateMetadata(): title, description, canonical URL, Open Graph,
 *    Twitter card — all sourced from article.json (category's articles).
 *  - JSON-LD: CollectionPage + ItemList (articles in category) +
 *    BreadcrumbList + Organization — same source.
 *
 * Next.js 15/16: `params` is async, so it's awaited below.
 */

// --- Site-wide constants (NOT category-specific, so NOT in article.json) ---
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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getAuthorAvatar(authorName) {
  const entry = Object.values(authorData).find((info) => info.name === authorName);
  return entry?.avatar || DEFAULT_AVATAR;
}

function CategoryHeader({ label, categories }) {
  return (
    <div className="border-b-4 border-black bg-[#EDEDED]">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6">
        <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
          {label}
        </h1>
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {categories.map((cat) => (
            <Link key={cat} href={`/${cat.toLowerCase()}`}
              className="font-display text-sm font-bold uppercase tracking-wide transition hover:text-[#E2432E]">
              {capitalize(cat)}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function ArticleCard({ href, image, title, category, author, authorAvatar }) {
  return (
    <Link href={href} className="group px-4 py-8 sm:px-6 sm:py-10">
      <div className="relative h-64 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="relative z-10 -mt-4 w-full max-w-[90%] mx-auto text-center">
        <span className="box-decoration-clone bg-white px-3 py-1 font-display text-lg font-bold leading-snug text-black transition group-hover:text-[#E2432E]">
          {title}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-[#E2432E]">
          | {category} |
        </span>
        <Image src={authorAvatar} alt={author} width={20} height={20} className="h-5 w-5 rounded-full object-cover"/>
        <span className="text-xs text-gray-700">{author}</span>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// generateMetadata — title, description, canonical URL, OG, Twitter card,
// all sourced from article.json (using the category's own articles/label)
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }) {
  const { category } = await params;
  const categoryLabel = capitalize(category);
  const articles = articleData[category] || [];

  if (articles.length === 0) {
    return {
      title: `${categoryLabel} — ${SITE_NAME}`,
      description: `Browse the latest ${categoryLabel} articles on ${SITE_NAME}.`,
    };
  }

  const url = `${SITE_URL}/${category}`;
  // Use the most recent article's image as the category's representative OG image
  const latestArticle = articles
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];
  const imageUrl = getAbsoluteUrl(latestArticle.image);
  const description = `Read the latest ${categoryLabel} coverage from ${SITE_NAME}: ${articles
    .slice(0, 3)
    .map((a) => a.title)
    .join(", ")}.`;

  return {
    title: `${categoryLabel} — ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${categoryLabel} — ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: categoryLabel,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryLabel} — ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const categoryLabel = capitalize(category);

  const otherCategories = Object.keys(articleData).filter(
    (cat) => cat.toLowerCase() !== category.toLowerCase()
  );

  const articles = (articleData[category] || [])
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  // ---------------------------------------------------------------------
  // JSON-LD — CollectionPage + ItemList (articles in this category) +
  // BreadcrumbList + Organization, sourced from article.json
  // ---------------------------------------------------------------------
  const url = `${SITE_URL}/${category}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collectionpage`,
        name: `${categoryLabel} — ${SITE_NAME}`,
        url,
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#articles`,
        name: `${categoryLabel} Articles`,
        itemListElement: articles.map((post, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/${category}/${post.slug}`,
          name: post.title,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: categoryLabel, item: url },
        ],
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
    ],
  };

  return (
    <main className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CategoryHeader label={categoryLabel} categories={otherCategories} />

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 divide-y divide-black sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                href={`/${category}/${article.slug}`}
                image={article.image}
                title={article.title}
                category={article.category}
                author={article.author}
                authorAvatar={getAuthorAvatar(article.author)}
              />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-gray-600">No articles found in this category yet.</p>
        )}
      </section>
    </main>
  );
}