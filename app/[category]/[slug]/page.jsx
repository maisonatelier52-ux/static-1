import Image from "next/image";
import Link from "next/link";

// ⚠️ Adjust these paths to match where this page.jsx actually lives relative to /public/data
import articleData from "../../../public/data/article.json";
import authorData from "../../../public/data/author.json";

/**
 * app/[category]/[slug]/page.jsx — article detail page.
 *
 * Same visual design/structure as before (sticky sidebar with Top 5 + Related
 * Posts, article header with byline + share icons, hero image, body,
 * tags, author bio) — only the data format changed to match your other
 * project's pattern:
 *  - articleData/authorData imported from JSON files instead of hardcoded
 *    consts.
 *  - next/image instead of raw <img>.
 *  - next/link for internal links instead of <a href="#">.
 *  - Dates stored as "DD/MM/YYYY" and formatted with parseDate/formatDate,
 *    same convention as your category page reference.
 *
 * Expected shape of /public/data/article.json:
 *   {
 *     "technology": [
 *       {
 *         "slug": "cybersecurity-protecting-yourself-online",
 *         "title": "...",
 *         "category": "Technology",
 *         "author": "Rob Lewis",
 *         "date": "13/09/2023",
 *         "readTime": "3 min. read",
 *         "image": "/images/image3.webp",
 *         "tags": ["Magazine", "Newspaper", "Urban"],
 *         "body": [
 *           { "type": "heading", "text": "..." },
 *           { "type": "paragraph", "text": "..." },
 *           { "type": "image", "src": "/images/image1.webp" }
 *         ]
 *       }
 *     ],
 *     "drama": [ ... ]
 *   }
 *
 * Expected shape of /public/data/author.json:
 *   {
 *     "Rob Lewis": {
 *       "avatar": "/images/image3.webp",
 *       "bio": "..."
 *     }
 *   }
 *
 * Skipped on purpose (unchanged from before):
 *  - The "Leave a Reply" comment form.
 *  - The Previous Article / Next Article / Popular Articles row.
 *  - The floating "DEMOS / HOSTING / SERVICES / BUY" box.
 *  - The duplicate nav row under the title (sticky Header re-appearing).
 *  - The back-to-top button — already global, in Footer.jsx.
 */

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
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

function PinterestIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-3.64 19.31c-.05-.82-.09-2.08.02-2.98.1-.8.66-5.1.66-5.1s-.17-.34-.17-.83c0-.78.45-1.36 1.02-1.36.48 0 .71.36.71.79 0 .48-.31 1.2-.46 1.87-.13.56.28 1.02.83 1.02 1 0 1.77-1.05 1.77-2.58 0-1.35-.97-2.29-2.35-2.29-1.6 0-2.54 1.2-2.54 2.44 0 .48.19 1 .42 1.28a.17.17 0 0 1 .04.16c-.05.19-.15.6-.17.68-.03.11-.09.14-.2.08-.75-.35-1.22-1.44-1.22-2.32 0-1.89 1.37-3.62 3.96-3.62 2.08 0 3.7 1.48 3.7 3.46 0 2.06-1.3 3.73-3.1 3.73-.61 0-1.18-.32-1.37-.69l-.37 1.42c-.14.51-.51 1.16-.76 1.55A10 10 0 1 0 12 2Z" />
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

function TopFiveSidebarItem({ image, title, category, href, rank }) {
  return (
    <Link href={href} className="group relative flex items-start gap-3 py-3 pr-8">
      <Image src={image} alt={title} width={56} height={56} className="h-14 w-14 shrink-0 object-cover" />
      <div className="min-w-0 flex-1">
        <h4 className="font-display text-sm font-bold leading-snug text-black transition group-hover:text-[#E2432E]">
          {title}
        </h4>
        <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-[#E2432E]">
          | {category} |
        </span>
      </div>
      <span className="pointer-events-none absolute bottom-1 right-0 font-display text-3xl font-semibold leading-none text-gray-300">
        {rank}
      </span>
    </Link>
  );
}

function Sidebar({ topFive, relatedPosts, className = "" }) {
  return (
    <aside className={`lg:sticky lg:top-6 lg:self-start ${className}`}>
      <div className="bg-[#E2432E] px-4 py-3">
        <h3 className="font-display text-base font-bold uppercase italic tracking-wide text-white">Top 5 This Week</h3>
      </div>
      <div className="divide-y divide-gray-300">
        {topFive.map((item, i) => (
          <TopFiveSidebarItem key={item.href} {...item} rank={i + 1} />
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-display text-base font-bold uppercase italic tracking-wide text-[#E2432E]">Related Posts</h3>
        <ul className="mt-4 space-y-4">
          {relatedPosts.map((post) => (
            <li key={post.href}>
              <Link href={post.href} className="group block font-display text-sm font-bold leading-snug text-black transition hover:text-[#E2432E]">
                {post.title}
              </Link>
              <span className="text-xs font-bold uppercase tracking-wide text-[#E2432E]">
                {post.category}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function ArticleHeader({ title, category, author, date, readTime }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
        {title}
      </h1>
      <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-[#E2432E]">
        | {category} |
      </span>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-4">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-black">Author: {author}</span>
          <span className="mx-2">·</span>
          {formatDate(date)}
          <span className="mx-2">·</span>
          {readTime}
        </p>
        <div className="flex items-center gap-3">
          <a href="#" aria-label="Share on Facebook" className="text-gray-600 transition hover:text-[#E2432E]">
            <FacebookIcon className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Share on X" className="text-gray-600 transition hover:text-[#E2432E]">
            <XIcon className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Share on Pinterest" className="text-gray-600 transition hover:text-[#E2432E]">
            <PinterestIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function ArticleBody({ body }) {
  return (
    <div className="mt-8 space-y-6">
      {body.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2 key={i} className="font-display text-2xl font-bold">
              {block.text}
            </h2>
          );
        }
        if (block.type === "image") {
          return (
            <div key={i} className="relative h-64 w-full sm:h-96">
              <Image src={block.src} alt="" fill className="object-cover" />
            </div>
          );
        }
        return (
          <p key={i} className="text-base leading-relaxed text-gray-700">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function TagsRow({ tags }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-300 pt-6">
      <span className="text-xs font-bold uppercase tracking-wide">Tags:</span>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tag/${tag.toLowerCase()}`}
          className="border border-gray-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-700 transition hover:border-black hover:text-black"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

function AuthorBio({ name, bio, avatar, slug }) {
  return (
    <div className="mt-10 flex flex-col gap-4 border border-gray-300 p-6 sm:flex-row sm:items-start">
      <Image src={avatar} alt={name} width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover" />
      <div>
        {slug ? (
          <Link href={`/authors/${slug}`} className="font-display text-lg font-bold uppercase transition hover:text-[#E2432E]">
            {name}
          </Link>
        ) : (
          <h3 className="font-display text-lg font-bold uppercase">{name}</h3>
        )}
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{bio}</p>
        <div className="mt-3 flex items-center gap-3">
          <a href="#" aria-label="Facebook" className="text-gray-600 transition hover:text-[#E2432E]">
            <FacebookIcon className="h-4 w-4" />
          </a>
          <a href="#" aria-label="X" className="text-gray-600 transition hover:text-[#E2432E]">
            <XIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }) {
  const { category, slug } = await params;

  const categoryPosts = articleData[category] || [];
  const article = categoryPosts.find((post) => post.slug === slug);

  if (!article) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-gray-600">Article not found.</p>
      </main>
    );
  }

  const authorEntry = Object.entries(authorData).find(
    ([, info]) => info.name === article.author
  );
  const [authorSlug, authorInfo] = authorEntry || [null, {}];

  // Top 5: flatten every category's posts, newest first, take 5
  const topFive = Object.entries(articleData)
    .flatMap(([cat, posts]) => posts.map((post) => ({ ...post, category: cat })))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, 5)
    .map((post) => ({
      image: post.image,
      title: post.title,
      category: post.category,
      href: `/${post.category}/${post.slug}`,
    }));

  // Related posts: other posts in the same category, newest first
  const relatedPosts = categoryPosts
    .filter((post) => post.slug !== slug)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, 6)
    .map((post) => ({
      title: post.title,
      category: article.category,
      href: `/${category}/${post.slug}`,
    }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr] lg:gap-10">
        <Sidebar
          topFive={topFive}
          relatedPosts={relatedPosts}
          className="order-2 lg:order-none"
        />

        <article className="order-1 lg:order-none">
          <ArticleHeader
            title={article.title}
            category={article.category}
            author={article.author}
            date={article.date}
            readTime={article.readTime}
          />

          <div className="relative mt-6 h-64 w-full sm:h-96">
            <Image src={article.image} alt={article.title} fill className="object-cover" />
          </div>

          <ArticleBody body={article.body} />
          <TagsRow tags={article.tags} />
          <AuthorBio name={article.author} bio={authorInfo.bio} avatar={authorInfo.avatar} slug={authorSlug} />
        </article>
      </div>
    </main>
  );
}