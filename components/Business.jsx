import Image from "next/image";
import Link from "next/link";

// ⚠️ Adjust this path to match where this file actually lives relative to /public/data
import articleData from "../public/data/article.json";

/**
 * Business — homepage section, same visual design as LatestNews.
 *
 * Row 1: 3 large cards. Title sits in a white "highlight" box (via
 * box-decoration-clone, so each wrapped line gets its own background)
 * that slightly overlaps the bottom of the image, followed by a centered
 * "| CATEGORY | Author" line and a short excerpt.
 *
 * Row 2: 4 smaller cards — same white-box title treatment, no excerpt.
 *
 * Titles are black by default and turn red (#E2432E) on hover — the whole
 * card is a link, so hovering anywhere on it triggers the color change.
 *
 * Data: pulls articleData.business from /public/data/article.json,
 * sorted newest first (same parseDate convention as your other pages).
 * The 3 newest go in the featured row, the next 4 in the secondary row.
 * Excerpts are derived from each article's first paragraph block, since
 * article.json doesn't store a separate excerpt field.
 */

// Dates in article.json are stored as "DD/MM/YYYY"
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

function getExcerpt(body, maxLength = 140) {
  const firstParagraph = body?.find((block) => block.type === "paragraph");
  if (!firstParagraph) return "";
  const text = firstParagraph.text;
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

function ByLine({ category, author }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wide">
      <span className="text-[#E2432E]">| {category} |</span>{" "}
      <span className="font-normal normal-case text-gray-700">{author}</span>
    </p>
  );
}

function FeaturedCard({ href, image, title, category, author, excerpt }) {
  return (
    <Link href={href} className="group flex flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-0">
      <div className="relative aspect-[4/3] w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="relative z-10 -mt-4 w-full max-w-[85%] text-center">
        <span className="box-decoration-clone bg-white px-3 py-1 font-display text-lg font-bold uppercase leading-tight text-black transition group-hover:text-[#E2432E] sm:text-2xl">
          {title}
        </span>
      </div>

      <div className="mt-6">
        <ByLine category={category} author={author} />
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{excerpt}</p>
      </div>
    </Link>
  );
}

function SecondaryCard({ href, image, title, category, author }) {
  return (
    <Link href={href} className="group flex flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-0">
      <div className="relative aspect-[4/3] w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="relative z-10 -mt-4 w-full max-w-[85%] text-center">
        <span className="box-decoration-clone bg-white px-3 py-1 font-display text-2xl font-bold leading-snug text-black transition group-hover:text-[#E2432E]">
          {title}
        </span>
      </div>

      <div className="mt-3">
        <ByLine category={category} author={author} />
      </div>
    </Link>
  );
}

export default function Business() {
  const businessArticles = (articleData.business || [])
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const featured = businessArticles.slice(0, 3).map((article) => ({
    href: `/business/${article.slug}`,
    image: article.image,
    title: article.title,
    category: article.category,
    author: article.author,
    excerpt: getExcerpt(article.body),
  }));

  const secondary = businessArticles.slice(3, 7).map((article) => ({
    href: `/business/${article.slug}`,
    image: article.image,
    title: article.title,
    category: article.category,
    author: article.author,
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Row 1 — 3 large featured cards */}
      <div className="grid grid-cols-1 divide-y-2 divide-black sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
        {featured.map((post) => (
          <FeaturedCard key={post.href} {...post} />
        ))}
      </div>

      {/* Row 2 — 4 smaller cards */}
      <div className="mt-4 grid grid-cols-1 divide-y-2 divide-black border-t-2 border-black sm:mt-12 sm:grid-cols-2 sm:divide-x-2 sm:divide-y-0 sm:pt-12 md:grid-cols-4">
        {secondary.map((post) => (
          <SecondaryCard key={post.href} {...post} />
        ))}
      </div>
    </section>
  );
}