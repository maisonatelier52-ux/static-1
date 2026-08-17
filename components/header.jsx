"use client";

import { useState, useMemo } from "react";
import { Mail, Search, Menu, X } from "lucide-react";
import Link from "next/link";

// ⚠️ Adjust this path to match where this file actually lives relative to /public/data
import articleData from "../public/data/article.json";

/**
 * Header / Masthead — "UrbanObserver" style.
 *
 * Fonts used in the reference:
 *  - Masthead + nav + "ALL" pill: a bold condensed display face (e.g. "Oswald"
 *    or "Anton") — registered here as `font-display`.
 *  - Tagline: same condensed face, lighter tracking, in red.
 *  - Date / top bar: default sans-serif.
 *
 * Add to your root layout (app/layout.js):
 *   import { Oswald } from "next/font/google";
 *   const oswald = Oswald({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-display" });
 *   // then add oswald.variable to your <html> or <body> className
 *
 * And in tailwind.config.js:
 *   theme: { extend: { fontFamily: { display: ["var(--font-display)", "sans-serif"] } } }
 *
 * The outlined logo look is done with -webkit-text-stroke rather than an
 * image, so it stays crisp at any size and the text stays selectable/SEO-able.
 * Swap the <h1> for an <img> once you have a logo file if you'd rather.
 *
 * Search: clicking the search icon expands a bar below the nav. Typing
 * filters every article across all categories in article.json by title
 * (case-insensitive, live as you type), showing up to 6 matches as real
 * links. Clicking a result or pressing the X closes the search and clears
 * the query.
 */

const CATEGORIES = [
  "Business",
  "Technology",
  "Politics",
  "Investigation",
  "Health",
  "Sports",
];

// Flatten every category's articles into one array, once, at module load
const ALL_ARTICLES = Object.values(articleData).flat();

function todayDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Header({ logoSrc }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_ARTICLES.filter((article) =>
      article.title.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="w-full bg-white text-black">
      {/* Top utility bar */}
      <div className="flex items-center justify-between border-b border-black px-4 py-2.5 sm:px-6">
        <span className="text-lg">{todayDate()}</span>

        <div className="hidden items-center gap-6 text-sm font-semibold uppercase sm:flex">
          <a href="/about" className="hover:opacity-70">About</a>
          <a href="/contact" className="hover:opacity-70">Contact</a>
          <a href="/account" className=" hover:opacity-70">Privacy Policy</a>
        </div>

        <button aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)} className="sm:hidden">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Masthead */}
      <div className="grid grid-cols-1 items-center gap-3 border-b-4 border-black px-4 py-6 sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-8">
        {/* Newsletter */}
        <div className="hidden justify-self-start sm:flex">
          {/* <div className="inline-flex flex-col items-center gap-1.5">
            <Mail size={26} strokeWidth={1.75} />
            <span className="font-display text-sm font-semibold uppercase tracking-wide">Newsletter</span>
          </div> */}
        </div>

        {/* Logo */}
        <div className="col-span-1 flex flex-col items-center">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt="UrbanObserver" className="h-12 w-auto sm:h-14 md:h-20" />
          ) : (
            <h1 className="masthead-title font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-6xl md:text-7xl">
              UrbanObserver
            </h1>
          )}
          <p className="mt-1 text-center font-display text-[10px] font-medium uppercase tracking-[0.1em] text-[#E2432E] sm:text-xs sm:tracking-[0.15em] md:text-base">
            Gossip &amp; Lifestyle Online Magazine
          </p>
        </div>

        {/* Pricing */}
        {/* <div className="hidden justify-end sm:flex">
          <a href="/pricing" className="border-2 border-black px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wide transition hover:bg-black hover:text-white">
            Pricing
          </a>
        </div> */}
      </div>

      {/* Category nav — desktop */}
      <nav className="hidden border-b-4 border-black sm:block">
        <div className="flex items-center gap-4 overflow-x-auto px-4 py-3 sm:justify-center sm:gap-6 sm:px-6">
          <a href="/" className="flex shrink-0 items-center gap-2 bg-black px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-white">
            Home
          </a>

          {CATEGORIES.map((cat) => (
            <a key={cat} href={`/${cat.toLowerCase()}`}
              className="shrink-0 font-display text-sm font-semibold uppercase tracking-wide transition hover:text-[#E2432E]">
              {cat}
            </a>
          ))}

          <button
            aria-label="Toggle search"
            onClick={() => setSearchOpen((v) => !v)}
            className="ml-auto shrink-0 transition hover:opacity-60 sm:ml-4"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} strokeWidth={2} />}
          </button>
        </div>
      </nav>

      {/* Expandable search bar */}
      {searchOpen && (
        <div className="border-b border-black bg-[#F7F7F7] px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-2 border border-black bg-white px-3 py-2">
              <Search size={18} className="shrink-0 text-gray-500" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full text-sm outline-none"
              />
              {query && (
                <button
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="shrink-0 text-gray-500 transition hover:text-black"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {query.trim() && (
              <div className="mt-2 divide-y divide-gray-200 border border-black bg-white">
                {results.length > 0 ? (
                  results.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/${article.category.toLowerCase()}/${article.slug}`}
                      onClick={closeSearch}
                      className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-gray-50"
                    >
                      <span className="font-display text-sm font-semibold">{article.title}</span>
                      <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-[#E2432E]">
                        {article.category}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No articles found for &quot;{query}&quot;.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile: categories + about / contact */}
      {menuOpen && (
        <div className="flex flex-col divide-y divide-[#EFEDE6] border-b border-black px-4 py-2 sm:hidden">
          {CATEGORIES.map((cat) => (
            <a key={cat} href={`/${cat.toLowerCase()}`} className="py-2.5 text-sm font-semibold uppercase tracking-wide">
              {cat}
            </a>
          ))}
          <a href="/about" className="py-2.5 text-sm font-semibold uppercase">About</a>
          <a href="/contact" className="py-2.5 text-sm font-semibold uppercase">Contact</a>
        </div>
      )}

      <style jsx>{`
        .masthead-title {
          -webkit-text-stroke: 1.5px black;
          text-stroke: 1.5px black;
        }
      `}</style>
    </header>
  );
}