import Image from "next/image";
import Link from "next/link";

// ⚠️ Adjust these paths to match where this page.jsx actually lives relative to /public/data
import articleData from "../../public/data/article.json";
import authorData from "../../public/data/author.json";

const DEFAULT_AVATAR = "/images/image3.webp";

/**
 * app/[category]/page.jsx — dynamic category page.
 *
 * Same visual design as before (grey banner header with category name +
 * secondary category nav capped with a bold black rule, 4-column grid of
 * article cards with the white overlapping title box) — only the data
 * format changed to match your other project's pattern:
 *  - articleData imported from /public/data/article.json instead of a
 *    hardcoded ARTICLES array. The JSON is already keyed by category, same
 *    shape as your article-detail-page reference.
 *  - authorData imported from /public/data/author.json to show each
 *    article's author avatar next to their name, same as your other
 *    project's category page reference. authorData is keyed by slug
 *    (e.g. "rob-lewis"), so it's matched by searching for an entry whose
 *    `.name` equals the article's `author` string.
 *  - next/image instead of raw <img>.
 *  - next/link for internal links instead of <a href="#">.
 *  - The category nav list is now derived from the JSON's keys instead of
 *    a separate hardcoded ALL_CATEGORIES array, so adding a category to
 *    article.json automatically adds it to this nav too.
 *
 * Next.js 15/16: `params` is async, so it's awaited below.
 */

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

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const categoryLabel = capitalize(category);

  const otherCategories = Object.keys(articleData).filter(
    (cat) => cat.toLowerCase() !== category.toLowerCase()
  );

  const articles = (articleData[category] || [])
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <main className="w-full bg-white">
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