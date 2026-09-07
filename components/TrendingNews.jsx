"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ⚠️ Adjust this path to match where this file actually lives relative to /public/data
import articleData from "../public/data/article.json";

/**
 * TrendingNews — homepage section with 3 columns:
 *  - Finance: bordered card, a featured article carousel (image with
 *    an overlapping white title box, byline, excerpt) with working
 *    prev/next arrows that cycle through every Finance article.
 *  - U.S. / Sports: plain lists — bold two-line title on the left, small
 *    square thumbnail on the right, separated by hairlines.
 *
 * Column heading style: centered, uppercase, italic, with a thin underline.
 * "Finance" is red, "U.S."/"Sports" are black. Titles go
 * black -> red on hover, same pattern as the rest of the homepage.
 *
 * Data: each column pulls its own category from
 * /public/data/article.json, sorted newest first.
 *  - The Finance carousel cycles through ALL Finance articles
 *    (wraps around at both ends) — nothing is "used up" by cycling, so
 *    there's no overlap concern there.
 *  - U.S. and Sports lists show up to 7 articles each (newest first);
 *    with 8 articles in each category that leaves 1 unused per category,
 *    same "no repeats" approach as the rest of the homepage.
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

function ColumnHeading({ label, color }) {
  return (
    <div className="mb-6 text-center">
      <h2 className={`font-display text-3xl font-bold uppercase italic tracking-wide sm:text-4xl ${color}`}>
        {label}
      </h2>
      <div className="mt-3 border-b border-black" />
    </div>
  );
}

function FinanceColumn({ articles }) {
  const [index, setIndex] = useState(0);

  if (articles.length === 0) {
    return (
      <div className="border border-black border-b-4 p-6">
        <ColumnHeading label="Finance" color="text-[#E2432E]" />
        <p className="text-center text-sm text-gray-500">No articles yet.</p>
      </div>
    );
  }

  const article = articles[index];
  const excerpt = getExcerpt(article.body);

  const handlePrev = () => setIndex((i) => (i - 1 + articles.length) % articles.length);
  const handleNext = () => setIndex((i) => (i + 1) % articles.length);

  return (
    <div className="border border-black border-b-4 p-6">
      <ColumnHeading label="Finance" color="text-[#E2432E]" />

      <Link href={`/finance/${article.slug}`} className="group block">
        <div className="relative h-80 w-full sm:h-96">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </div>

        <div className="relative z-10 -mt-4 w-full max-w-[90%] mx-auto text-center">
          <span className="box-decoration-clone bg-white px-3 py-1 font-display text-3xl font-bold uppercase leading-tight text-black transition group-hover:text-[#E2432E]">
            {article.title}
          </span>
        </div>
      </Link>

      <p className="mt-5 text-center text-sm text-gray-600">
        {article.author} - {formatDate(article.date)}
      </p>
      <p className="mt-3 text-center text-lg leading-relaxed text-black">
        {excerpt}
      </p>

      <div className="mt-6 flex justify-center gap-2">
        <button
          aria-label="Previous"
          onClick={handlePrev}
          className="flex h-9 w-9 items-center justify-center border border-black text-black transition hover:bg-black hover:text-white"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          aria-label="Next"
          onClick={handleNext}
          className="flex h-9 w-9 items-center justify-center border border-black text-black transition hover:bg-black hover:text-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function ListRow({ href, title, image }) {
  return (
    <Link href={href} className="group flex items-start justify-between gap-4 py-4">
      <h3 className="flex-1 font-display text-lg font-bold leading-snug text-black transition group-hover:text-[#E2432E] sm:text-2xl">
        {title}
      </h3>
      <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
    </Link>
  );
}

function ListColumn({ label, category, items }) {
  return (
    <div>
      <ColumnHeading label={label} color="text-black" />
      <div className="divide-y divide-black">
        {items.map((item) => (
          <ListRow key={item.slug} href={`/${category}/${item.slug}`} title={item.title} image={item.image} />
        ))}
      </div>
    </div>
  );
}

export default function TrendingNews() {
  const financeArticles = (articleData.finance || [])
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const usArticles = (articleData.us || [])
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, 6);

  const sportsArticles = (articleData.sports || [])
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
        <FinanceColumn articles={financeArticles} />
        <div className="lg:border-l lg:border-black lg:pl-8">
          <ListColumn label="U.S." category="us" items={usArticles} />
        </div>
        <div className="lg:border-l lg:border-black lg:pl-8">
          <ListColumn label="Sports" category="sports" items={sportsArticles} />
        </div>
      </div>
    </section>
  );
}