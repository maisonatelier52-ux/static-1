import Image from "next/image";
import Link from "next/link";

// ⚠️ Adjust this path to match where this file actually lives relative to /public/data
import articleData from "../public/data/article.json";

/**
 * Politics — homepage section, same visual design as MustRead.
 *
 * Header: a "DON'T MISS" wordmark in a white bordered box, centered over a
 * band of repeating thin horizontal lines (done with a CSS repeating
 * gradient — no image needed).
 *
 * Body, two columns:
 *  - Left: 2x2 grid of cards (image, bold title, "| CATEGORY |  Author"
 *    line), separated by hairlines.
 *  - Right: a vertical list of 3 items — thumbnail + title + "| CATEGORY |
 *    date", separated by hairlines, with a vertical divider from the left
 *    column at desktop width.
 *
 * Titles are black by default, red (#E2432E) on hover.
 *
 * Data: pulls articleData.politics from /public/data/article.json, sorted
 * newest first, then split into non-overlapping groups so no article
 * appears twice: the 4 newest fill the grid, the next 3 fill the list.
 * With 8 Politics articles total, that uses 7 and leaves 1 unused for now
 * — it'll show up once older grid/list items rotate out or you add more
 * articles.
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

function CategoryTag({ category }) {
  return (
    <span className="text-xs font-bold uppercase tracking-wide text-[#E2432E]">
      | {category} |
    </span>
  );
}

function SectionHeader() {
  return (
    <div className="relative flex items-center justify-center bg-[#EAF4FB] py-6">
      <div
        className="absolute inset-x-0 top-0 h-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, #000 0, #000 1px, transparent 1px, transparent 7px)",
        }}
      />
      <div className="relative bg-white px-6 py-2">
        <h2 className="border-2 border-black px-6 py-2 font-display text-2xl font-bold uppercase italic tracking-wide sm:text-3xl">
          POLITICS
        </h2>
      </div>
    </div>
  );
}

function GridCard({ href, image, title, category, author }) {
  return (
    <Link href={href} className="group p-4">
      <div className="relative h-56 w-full sm:h-64">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="relative z-10 -mt-4 w-full max-w-[90%] mx-auto text-center">
        <span className="box-decoration-clone bg-white px-2 py-1 font-display text-2xl font-bold leading-snug text-black transition group-hover:text-[#E2432E]">
          {title}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        <CategoryTag category={category} />
        <span className="text-xs text-gray-700">{author}</span>
      </div>
    </Link>
  );
}

function ListItem({ href, image, title, category, date }) {
  return (
    <Link href={href} className="group flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
      <div className="relative h-56 w-full sm:h-40 sm:w-56 sm:shrink-0 md:h-52 md:w-72">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-3xl font-bold leading-snug text-black transition group-hover:text-[#E2432E]">
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <CategoryTag category={category} />
          <span className="text-gray-500">{date}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Politics() {
  const sorted = (articleData.politics || [])
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const gridSource = sorted.slice(0, 4);
  const listSource = sorted.slice(4, 7);

  const gridItems = gridSource.map((article) => ({
    href: `/politics/${article.slug}`,
    image: article.image,
    title: article.title,
    category: article.category,
    author: article.author,
  }));

  const listItems = listSource.map((article) => ({
    href: `/politics/${article.slug}`,
    image: article.image,
    title: article.title,
    category: article.category,
    date: formatDate(article.date),
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeader />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-0">
        {/* Left — 2x2 grid */}
        <div className="grid grid-cols-1 divide-y divide-gray-300 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:border-r lg:border-gray-300 lg:pr-8">
          <div className="grid grid-cols-1 divide-y divide-gray-300 sm:col-span-2 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {gridItems.slice(0, 2).map((item) => (
              <GridCard key={item.href} {...item} />
            ))}
          </div>
          <div className="grid grid-cols-1 divide-y divide-gray-300 border-t border-gray-300 sm:col-span-2 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {gridItems.slice(2, 4).map((item) => (
              <GridCard key={item.href} {...item} />
            ))}
          </div>
        </div>

        {/* Right — list */}
        <div className="divide-y divide-gray-300 lg:pl-8">
          {listItems.map((item) => (
            <ListItem key={item.href} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}