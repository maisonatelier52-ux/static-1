"use client";

import Link from "next/link";
import { ArrowRight, ArrowUp } from "lucide-react";

// Adjust this path to wherever /public/data/article.json actually sits
// relative to this file's location in your project.
import articleData from "../public/data/article.json";
import authorData from "../public/data/author.json";

/**
 * Footer — "UrbanObserver" style.
 *
 * Matches the reference top-to-bottom:
 *  1. Grey bar: outline-stroke "URBANOBSERVER" wordmark (same font-display +
 *     -webkit-text-stroke treatment as the header masthead) + category nav +
 *     a secondary row (About / Contact / Privacy Policy / Newsletter),
 *     capped with a bold black rule.
 *  2. Four columns: About Us / Latest Articles / Most Popular / Subscribe.
 *  3. Copyright bar.
 *  4. Back-to-top button.
 *
 * Social icons: lucide-react 1.0 removed all brand/logo icons (Facebook,
 * Instagram, Twitter/X, YouTube, etc.) for trademark reasons, so these four
 * are small inline SVGs instead of lucide imports.
 */

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

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.5-7.2L4.4 22H1.3l8.1-9.3L1 2h7.3l5 6.6L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23 12s0-3.6-.46-5.3a2.9 2.9 0 0 0-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.54.5a2.9 2.9 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.46 5.3a2.9 2.9 0 0 0 2 2c1.64.5 8.54.5 8.54.5s6.9 0 8.54-.5a2.9 2.9 0 0 0 2-2C23 15.6 23 12 23 12ZM9.75 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: XIcon, href: "#", label: "X" },
  { icon: YoutubeIcon, href: "#", label: "YouTube" },
];

const CATEGORIES = [
  "Business",
  "World",
  "Politics",
  "Finance",
  "U.S.",
  "Sports",
];

// Converts a display label into a clean URL slug.
// e.g. "U.S." -> "us", "Business" -> "business", "Top Stories" -> "top-stories"
function slugify(label) {
  return label
    .toLowerCase()
    .replace(/\./g, "")       // strip periods: "U.S." -> "us"
    .trim()
    .replace(/\s+/g, "-");    // spaces -> dashes for multi-word labels
}

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const formatDateLong = (dateStr) =>
  parseDate(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// Every post across every category in article.json, flattened and
// de-duplicated by slug, each carrying its own href and display category.
function getAllArticles() {
  const all = Object.entries(articleData).flatMap(([catKey, posts]) =>
    (posts || []).map((p) => ({ ...p, catKey }))
  );

  const seen = new Set();
  return all.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

function toListItem(p) {
  const slug = p.categorySlug || p.catKey;
  return {
    title: p.title,
    category: slug.toUpperCase() === "US" ? "U.S." : slug.charAt(0).toUpperCase() + slug.slice(1),
    date: formatDateLong(p.date),
    href: `/${slug}/${p.slug}`,
  };
}

// Most recent N articles, newest first.
function getLatestArticles(limit = 3) {
  return getAllArticles()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, limit)
    .map(toListItem);
}

// article.json currently has no real popularity signal (no view counts,
// no click data), so rather than fake a "Most Popular" ranking, the footer
// instead lists real authors from author.json.
// author.json is keyed by slug (e.g. "rob-lewis"), with the display name
// and beat living inside each entry as `name` and `category`.
function getAuthors(limit = 3) {
  return Object.entries(authorData)
    .map(([slug, info]) => ({
      name: info.name || slug,
      role: info.category || "",
      slug,
      avatar: info.avatar || "",
    }))
    .slice(0, limit);
}

function ArticleList({ items }) {
  return (
    <ul className="space-y-6">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="font-display text-lg font-bold leading-snug transition hover:text-[#E2432E]"
          >
            {item.title}
          </Link>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="font-bold uppercase tracking-wide">{item.category}</span>
            <span className="text-gray-500">{item.date}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AuthorList({ authors }) {
  return (
    <ul className="space-y-5">
      {authors.map((author) => (
        <li key={author.slug}>
          <Link href={`/authors/${author.slug}`} className="group flex items-center gap-3">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="h-11 w-11 shrink-0 rounded-full object-cover bg-gray-200"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-500"
              style={{ display: author.avatar ? "none" : "flex" }}
            >
              {author.name.charAt(0)}
            </div>
            <div>
              <p className="font-display text-base font-bold leading-snug transition group-hover:text-[#E2432E]">
                {author.name}
              </p>
              {author.role && (
                <p className="text-xs uppercase tracking-wide text-gray-500">{author.role}</p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const latestArticles = getLatestArticles(3);
  const authors = getAuthors(6);

  return (
    <footer className="w-full bg-white text-black">
      {/* Grey top bar: logo + nav + secondary links */}
      <div className="border-t border-black bg-[#EDEDED]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between">
          <h2 className="footer-masthead-title font-display text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
            UrbanObserver
          </h2>

          <div className="flex flex-col gap-3 md:items-end md:border-l md:border-gray-300 md:pl-8">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 font-display text-sm font-bold uppercase tracking-wide">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={`/${slugify(cat)}`}
                  className="transition hover:text-[#E2432E]"
                >
                  {cat}
                </a>
              ))}
            </nav>

            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
              <a href="/about" className="hover:text-black">About</a>
              <span className="hidden h-3 w-px bg-gray-400 sm:block" />
              <a href="/contact" className="hover:text-black">Contact</a>
              <span className="hidden h-3 w-px bg-gray-400 sm:block" />
              <a href="/privacy-policy" className="hover:text-black">Privacy Policy</a>
              <span className="hidden h-3 w-px bg-gray-400 sm:block" />
              <a href="/newsletter" className="hover:text-black">Newsletter</a>
            </nav>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-black" />

      {/* Four columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 md:grid-cols-4 md:gap-0 md:divide-x md:divide-gray-200">
        {/* About Us */}
        <div className="md:pr-8">
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
            About Us
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            Each template in our ever growing studio library can be added and
            moved around within any page effortlessly with one click.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center bg-[#E2432E] text-white transition hover:bg-[#c53523]"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Latest Articles */}
        <div className="md:px-8">
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
            Latest Articles
          </h3>
          <div className="mt-6">
            <ArticleList items={latestArticles} />
          </div>
        </div>

        {/* Our Authors */}
        <div className="md:px-8">
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
            Our Authors
          </h3>
          <div className="mt-6">
            <AuthorList authors={authors} />
          </div>
        </div>

        {/* Subscribe */}
        <div className="md:pl-8">
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
            Subscribe
          </h3>

          <form className="mt-6 flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-black px-4 py-3 text-sm outline-none placeholder:text-gray-500"
            />

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 bg-[#E2432E] py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#c53523]"
            >
              I Want In
              <ArrowRight size={16} />
            </button>

            <label className="flex items-start gap-2 text-xs text-gray-700">
              <input type="checkbox" className="mt-0.5" />
              <span>
                I&apos;ve read and accept the{" "}
                <a href="/privacy-policy" className="text-[#E2432E] underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </form>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-200">
        <p className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-600 sm:px-6">
          © UrbanObserver. All Rights Reserved.
        </p>
      </div>

      {/* Back to top */}
      <button
        aria-label="Back to top"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#E2432E] text-white shadow-lg transition hover:bg-[#c53523]"
      >
        <ArrowUp size={20} />
      </button>

      <style jsx>{`
        .footer-masthead-title {
          -webkit-text-stroke: 1.5px black;
        }
      `}</style>
    </footer>
  );
}