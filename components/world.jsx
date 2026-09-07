import Image from "next/image";
import Link from "next/link";

// ⚠️ Adjust this path to match where this file actually lives relative to /public/data
import articleData from "../public/data/article.json";

/**
 * World — second homepage section, same visual design as TopStories.
 *
 * 3 columns:
 *  - Left: "Top 4 This Week" — red banner header, 4 items each with a small
 *    thumbnail, title, category tag, and a large faded rank number.
 *  - Center: one large featured article — hero image with a white
 *    "highlight box" title overlapping its bottom edge, category | author |
 *    date line, and an excerpt.
 *  - Right: a plain list of 7 articles — bold title + "| CATEGORY |  date"
 *    line, separated by hairlines.
 *
 * Data: pulls articleData.world from /public/data/article.json,
 * sorted newest first, then split into non-overlapping groups so no
 * article appears twice on the page: the 4 newest go to Top 4, the next
 * one becomes the Featured Article, and everything after that fills the
 * Latest list. With 8 World articles total, that leaves 3 for
 * Latest right now — it'll grow toward a full 7 as more articles are
 * added to that category.
 *
 * Titles are black by default and turn red (#E2432E) on hover, same
 * pattern as everywhere else on the site — each item is a real link.
 */

// Dates in article.json are stored as "DD/MM/YYYY"
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const formatDate = (dateStr) => {
  const d = parseDate(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

function getExcerpt(body, maxLength = 160) {
  const firstParagraph = body?.find((block) => block.type === "paragraph");
  if (!firstParagraph) return "";
  const text = firstParagraph.text;
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

function CategoryTag({ category }) {
  return (
    <span className="text-xs font-bold uppercase tracking-wide text-[#E2432E]">
      | {category} |
    </span>
  );
}

function TopFiveItem({ href, image, title, category, rank }) {
  return (
    <Link href={href} className="group relative flex items-start gap-3 py-4 pr-10 sm:gap-4 sm:pr-12">
      <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-display text-sm font-bold leading-snug text-black transition group-hover:text-[#E2432E] sm:text-xl">
          {title}
        </h4>
        <div className="mt-1">
          <CategoryTag category={category} />
        </div>
      </div>
      <span className="pointer-events-none absolute bottom-1 right-0 font-display text-5xl font-semibold leading-none text-gray-300 sm:text-6xl">
        {rank}
      </span>
    </Link>
  );
}

function LatestListItem({ href, title, category, date }) {
  return (
    <Link href={href} className="group block py-4">
      <h4 className="font-display text-2xl font-bold leading-snug text-black transition group-hover:text-[#E2432E]">
        {title}
      </h4>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <CategoryTag category={category} />
        <span className="text-gray-500">{date}</span>
      </div>
    </Link>
  );
}

function FeaturedArticle({ href, image, title, category, author, date, excerpt }) {
  return (
    <Link href={href} className="group block text-center">
      <div className="relative aspect-[13/10] w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="relative z-10 -mt-10 flex w-full flex-col items-start px-2 sm:-mt-12">
        <span className="box-decoration-clone bg-white px-3 py-1 font-display text-3xl font-bold leading-tight text-black transition group-hover:text-[#E2432E] sm:text-4xl md:text-5xl">
          {title}
        </span>
      </div>

      <div className="mt-6 text-left">
        <p className="text-sm font-bold uppercase tracking-wide">
          <span className="text-[#E2432E]">| {category} |</span>{" "}
          <span className="font-normal normal-case text-black">{author}</span>{" "}
          <span className="font-normal normal-case text-gray-500">- {date}</span>
        </p>
        <p className="mt-3 text-xl leading-relaxed text-black-900">{excerpt}</p>
      </div>
    </Link>
  );
}

export default function World() {
  const sorted = (articleData.world || [])
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  // Split into non-overlapping groups: first 4 -> Top 4, next 1 ->
  // Featured, everything left over -> Latest. With only 8 World
  // articles right now, Latest ends up with 3 — it'll fill out to a
  // full 7 automatically as more World articles are added.
  const topFiveSource = sorted.slice(0, 4);
  const featuredSource = sorted[4];
  const latestSource = sorted.slice(5);

  const topFive = topFiveSource.map((article, i) => ({
    href: `/world/${article.slug}`,
    image: article.image,
    title: article.title,
    category: article.category,
    rank: i + 1,
  }));
  const latest = latestSource.map((article) => ({
    href: `/world/${article.slug}`,
    title: article.title,
    category: article.category,
    date: formatDate(article.date),
  }));
  const featured = featuredSource && {
    href: `/world/${featuredSource.slug}`,
    image: featuredSource.image,
    title: featuredSource.title,
    category: featuredSource.category,
    author: featuredSource.author,
    date: formatDate(featuredSource.date),
    excerpt: getExcerpt(featuredSource.body),
  };

  return (
    <section className="mx-auto max-w-7xl border-t-2 border-black px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Left — Top 5 This Week */}
        <div className="lg:col-span-3">
          <div className="bg-[#E2432E] px-4 py-3">
            <h3 className="font-display text-2xl font-bold uppercase italic tracking-wide text-white">
              WORLD
            </h3>
          </div>
          <div className="divide-y divide-gray-300">
            {topFive.map((item) => (
              <TopFiveItem key={item.href} {...item} />
            ))}
          </div>
        </div>

        {/* Center — Featured article */}
        <div className="lg:col-span-6 lg:border-x-2 lg:border-black lg:px-8">
          {featured && <FeaturedArticle {...featured} />}
        </div>

        {/* Right — Latest list */}
        <div className="lg:col-span-3">
          <div className="divide-y divide-gray-300">
            {latest.map((item) => (
              <LatestListItem key={item.href} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}