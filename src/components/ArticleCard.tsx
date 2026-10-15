import React from 'react';
import { Bookmark, ArrowUpRight, Clock } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { navigateTo } from '../utils/router';
import { useBookmarks } from '../utils/bookmarks';

interface ArticleCardProps {
  article: BlogPost;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const { isSaved, toggle } = useBookmarks();
  const saved = isSaved(article.slug);

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking the bookmark button, prevent card navigation
    if ((e.target as HTMLElement).closest('.bookmark-btn')) {
      return;
    }
    navigateTo(`/${article.slug}`);
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(article.slug);
  };

  if (featured) {
    return (
      <article
        onClick={handleCardClick}
        className="group cursor-pointer bg-[#FAF9F5] border border-[#E5DFD5] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#1C1917] hover:shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Featured Image */}
          <div className="lg:col-span-7 relative overflow-hidden bg-[#F4F1EA] aspect-16/10 lg:aspect-auto min-h-[320px]">
            <img
              src={article.featuredImage}
              alt={article.imageAlt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              onError={(e) => {
                // Fallback container in case image error
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            
            {/* Quick Bookmark overlay */}
            <button
              onClick={handleBookmarkToggle}
              className="bookmark-btn absolute top-4 right-4 p-2.5 rounded-full bg-[#FAF9F5]/90 backdrop-blur-md text-[#1C1917] hover:bg-[#FAF9F5] border border-[#E5DFD5] transition-colors cursor-pointer shadow-sm"
              title={saved ? 'Remove from reading list' : 'Save to reading list'}
              aria-label={saved ? 'Remove from reading list' : 'Save to reading list'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#9A3412] text-[#9A3412]' : 'text-[#1C1917]'}`} />
            </button>

            {/* Artist Attribution Label */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#1C1917]/80 backdrop-blur-md text-[11px] text-[#FAF9F5] font-mono pointer-events-none">
              Artist: {article.author.name}
            </div>
          </div>

          {/* Featured Content Area */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#FAF9F5]">
            <div className="space-y-4">
              
              {/* Zero-Pill Unboxed Metadata with typographic separators */}
              <div className="flex items-center gap-2 text-xs text-[#57534E]">
                <span className="font-semibold tracking-wider uppercase text-[#9A3412]">
                  {article.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{article.publishedDate}</span>
                <span aria-hidden="true">·</span>
                <span>{article.readTime}</span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1C1917] leading-tight group-hover:text-[#9A3412] transition-colors">
                <a
                  href={`/${article.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(`/${article.slug}`);
                  }}
                  className="hover:underline focus:outline-none"
                >
                  {article.title}
                </a>
              </h2>

              <p className="text-sm text-[#57534E] leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            {/* Author Footer & Read Prompt */}
            <div className="pt-6 mt-6 border-t border-[#E5DFD5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-[#E5DFD5]"
                />
                <div className="text-xs">
                  <p className="font-medium text-[#1C1917]">{article.author.name}</p>
                  <p className="text-[#78716C]">{article.author.role.split('&')[0]}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C1917] group-hover:translate-x-1 transition-transform">
                Read Full {article.category} Guide
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>

        </div>
      </article>
    );
  }

  // Standard Grid Card
  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer bg-[#FAF9F5] border border-[#E5DFD5] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#1C1917] hover:shadow-sm"
    >
      <div>
        {/* Card Image */}
        <div className="relative aspect-4/3 overflow-hidden bg-[#F4F1EA]">
          <img
            src={article.featuredImage}
            alt={article.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className="bookmark-btn absolute top-3 right-3 p-2 rounded-full bg-[#FAF9F5]/90 backdrop-blur-md text-[#1C1917] hover:bg-[#FAF9F5] border border-[#E5DFD5] transition-colors cursor-pointer shadow-sm"
            title={saved ? 'Remove from reading list' : 'Save to reading list'}
            aria-label={saved ? 'Remove from reading list' : 'Save to reading list'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#9A3412] text-[#9A3412]' : 'text-[#1C1917]'}`} />
          </button>

          {/* Artist Attribution Label */}
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-[#1C1917]/80 backdrop-blur-md text-[10px] text-[#FAF9F5] font-mono pointer-events-none">
            Artist: {article.author.name}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 sm:p-6 space-y-3">
          
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-[#57534E]">
            <span className="font-semibold tracking-wide uppercase text-[#9A3412]">
              {article.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          <h3 className="font-serif text-xl font-semibold text-[#1C1917] leading-snug group-hover:text-[#9A3412] transition-colors line-clamp-2">
            <a
              href={`/${article.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(`/${article.slug}`);
              }}
              className="hover:underline focus:outline-none"
            >
              {article.title}
            </a>
          </h3>

          <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#E5DFD5] flex items-center justify-between text-xs text-[#78716C]">
        <span>{article.publishedDate}</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#1C1917] group-hover:translate-x-0.5 transition-transform">
          Read {article.category} Guide
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
