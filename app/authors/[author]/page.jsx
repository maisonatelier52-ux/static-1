import Image from "next/image";
import Link from "next/link";

// ⚠️ Adjust these paths to match where this page.jsx actually lives relative to /public/data
import articleData from "../../../public/data/article.json";
import authorData from "../../../public/data/author.json";

/**
 * app/authors/[author]/page.jsx — author page.
 *
 * Grey banner: author name, social icons, bio, website link on the left;
 * large circular photo on the right — capped with a bold black rule.
 * Below: a grid of the author's articles (thumbnail + title +
 * "| CATEGORY |  date"), 3 columns, separated by hairlines.
 *
 * Plus full SEO:
 *  - generateMetadata(): title, description, canonical URL, Open Graph
 *    (type "profile"), Twitter card — all sourced from author.json.
 *  - JSON-LD: Person, BreadcrumbList, ItemList of the author's articles,
 *    Organization — sourced from author.json + article.json.
 *
 * `authorData` is keyed by slug directly (e.g. "rob-lewis"), matching
 * the [author] route param — no derived slugify matching needed. Each
 * entry carries its own `name` (for display) and `category` (the author's
 * primary beat, for filtering/grouping authors later).
 *
 * Next.js 15/16: `params` is async, so it's awaited below.
 */

// --- Site-wide constants (NOT author-specific, so NOT in author.json) ---
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"; // ⚠️ replace
const SITE_NAME = "Urban Observer"; // ⚠️ replace if different
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

function getAbsoluteUrl(path) {
  if (!path) return DEFAULT_OG_IMAGE;
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Dates in article.json are stored as "DD/MM/YYYY"
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const formatDate = (dateStr) => {
  const d = parseDate(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

function AuthorHeader({ name, bio, avatar, website, facebook, instagram }) {
  return (
    <div className="border-b-4 border-black bg-[#EDEDED]">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
            {name}
          </h1>

          <div className="mt-3 flex items-center justify-center gap-3 md:justify-start">
            {facebook && (
              <a href={facebook} aria-label="Facebook" className="text-[#E2432E] transition hover:opacity-70">
                <FacebookIcon className="h-4 w-4" />
              </a>
            )}
            {instagram && (
              <a href={instagram} aria-label="Instagram" className="text-[#E2432E] transition hover:opacity-70">
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
          </div>

          <p className="mt-4 text-xl leading-relaxed text-gray-800">{bio}</p>

          {website && (
            <a href={website} className="mt-3 inline-block break-all text-sm text-[#E2432E] hover:underline">
              {website}
            </a>
          )}
        </div>

        <Image src={avatar} alt={name} width={160} height={160} className="h-32 w-32 shrink-0 rounded-full object-cover sm:h-70 sm:w-70"/>
      </div>
    </div>
  );
}

function ArticleRow({ href, image, title, category, date }) {
  return (
    <Link href={href} className="group flex items-start gap-4 p-4">
      <div className="relative h-20 w-28 shrink-0">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-base font-bold leading-snug text-black transition group-hover:text-[#E2432E]">
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="font-bold uppercase tracking-wide text-[#E2432E]">
            | {category} |
          </span>
          <span className="text-gray-500">{date}</span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// generateMetadata — title, description, canonical URL, OG (profile), and
// Twitter card, all sourced directly from author.json
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }) {
  const { author } = await params;
  const authorInfo = authorData[author];

  if (!authorInfo) {
    return {
      title: "Author Not Found",
      description: "The author you're looking for doesn't exist.",
    };
  }

  const url = `${SITE_URL}/authors/${author}`;
  const imageUrl = getAbsoluteUrl(authorInfo.avatar);
  const description = authorInfo.bio;

  return {
    title: `${authorInfo.name} — Author Profile`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: authorInfo.name,
      description,
      url,
      siteName: SITE_NAME,
      type: "profile",
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 400,
          alt: authorInfo.name,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: authorInfo.name,
      description,
      images: [imageUrl],
    },
  };
}

export default async function AuthorPage({ params }) {
  const { author } = await params;

  const authorInfo = authorData[author];

  if (!authorInfo) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-gray-600">Author not found.</p>
      </main>
    );
  }

  const articles = Object.values(articleData)
    .flat()
    .filter((post) => post.author === authorInfo.name)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  // ---------------------------------------------------------------------
  // JSON-LD — Person + BreadcrumbList + ItemList (author's articles) +
  // Organization, sourced from author.json + article.json
  // ---------------------------------------------------------------------
  const url = `${SITE_URL}/authors/${author}`;
  const imageUrl = getAbsoluteUrl(authorInfo.avatar);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}#person`,
        name: authorInfo.name,
        description: authorInfo.bio,
        image: imageUrl,
        url,
        ...(authorInfo.category ? { knowsAbout: authorInfo.category } : {}),
        ...(authorInfo.website ? { sameAs: [authorInfo.website].filter(Boolean) } : {}),
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Authors", item: `${SITE_URL}/authors` },
          { "@type": "ListItem", position: 3, name: authorInfo.name, item: url },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#articles`,
        name: `Articles by ${authorInfo.name}`,
        itemListElement: articles.map((post, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/${post.category.toLowerCase()}/${post.slug}`,
          name: post.title,
        })),
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

      <AuthorHeader {...authorInfo} />

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 divide-y divide-gray-300 sm:grid-cols-2 sm:divide-x lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleRow
                key={article.slug}
                href={`/${article.category.toLowerCase()}/${article.slug}`}
                image={article.image}
                title={article.title}
                category={article.category}
                date={formatDate(article.date)}
              />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-gray-600">No articles found for this author yet.</p>
        )}
      </section>
    </main>
  );
}