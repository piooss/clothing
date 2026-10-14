import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight, Sparkles, SlidersHorizontal, BookOpen, Compass, Search } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { ArticleCard } from './ArticleCard';
import { ArticleFilter } from './ArticleFilter';
import { updateMetaTags } from '../utils/seo';
import { navigateTo } from '../utils/router';

interface HomePageProps {
  initialCategory?: string;
  initialSearch?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ initialCategory = 'All', initialSearch = '' }) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    updateMetaTags(undefined);
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set(BLOG_ARTICLES.map((a) => a.category));
    return Array.from(set);
  }, []);

  // Filter & sort articles
  const filteredArticles = useMemo(() => {
    let result = BLOG_ARTICLES.filter((article) => {
      const matchesCategory =
        activeCategory === 'All' || article.category.toLowerCase() === activeCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.subtitle.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.keywords.some((k) => k.toLowerCase().includes(query)) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'readTimeAsc') {
      result.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
    } else if (sortBy === 'readTimeDesc') {
      result.sort((a, b) => parseInt(b.readTime) - parseInt(a.readTime));
    } else if (sortBy === 'titleAsc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  // Featured article is the flagship 2026 trends guide
  const featuredArticle = BLOG_ARTICLES[0];
  const remainingArticles = filteredArticles.filter((a) => a.id !== (activeCategory === 'All' && !searchQuery ? featuredArticle.id : ''));

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      
      {/* Editorial Broadside Hero Marquee */}
      <section className="border-b border-[#E5DFD5] bg-[#FAF9F5] pt-10 sm:pt-14 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Masthead Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#78716C]">
              <span>VOL. 2026</span>
              <span aria-hidden="true">·</span>
              <span>ISSUE IV</span>
              <span aria-hidden="true">·</span>
              <span>CURATED CLOTHING JOURNAL</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1C1917] tracking-tight text-balance">
              The Architecture of Timeless Style
            </h1>
            
            <p className="text-sm sm:text-base text-[#57534E] max-w-xl mx-auto leading-relaxed">
              Ten definitive publications examining wardrobe construction, textile science, color harmonies, garment longevity, and sustainable craftsmanship.
            </p>
          </div>

          {/* Lead Featured Article Card */}
          {activeCategory === 'All' && !searchQuery && (
            <div className="pt-4">
              <div className="flex items-center justify-between pb-3 text-xs uppercase font-mono tracking-wider text-[#78716C]">
                <span>Lead Feature</span>
                <span className="hidden sm:inline">2026 Runway & Wardrobe Movement</span>
              </div>
              <ArticleCard article={featuredArticle} featured={true} />
            </div>
          )}

        </div>
      </section>

      {/* Main Journal Index with Live Filters & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading & Filter Module */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5DFD5] pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-[#78716C]">
                Complete Publication Archive
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                Sartorial Guides & Essays
              </h2>
            </div>
            <p className="text-xs text-[#78716C] max-w-xs sm:text-right">
              Filter by department or search specific fabrics, tailoring terms, and outfit formulas.
            </p>
          </div>

          <ArticleFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalCount={filteredArticles.length}
          />
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-[#F4F1EA] rounded-2xl border border-[#E5DFD5] space-y-4">
            <Search className="w-10 h-10 text-[#78716C] mx-auto stroke-1" />
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">
              No articles match your search
            </h3>
            <p className="text-xs text-[#57534E] max-w-md mx-auto">
              We couldn't find any guides matching "{searchQuery}". Try searching for broader terms like "linen", "wardrobe", "formal", or reset the category filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#1C1917] text-[#FAF9F5] text-xs font-medium rounded-md hover:bg-[#292524] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

      </section>

      {/* Curatorial Editorial Strip: The Philosophy of Conscious Wardrobes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4F1EA] border border-[#E5DFD5] rounded-2xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-widest font-mono text-[#9A3412] font-semibold">
                The Sartorial Manifesto
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1C1917] leading-tight">
                "Style is an architecture of self: it requires solid foundations, natural materials, and zero ephemeral waste."
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-2xl">
                L'Atelier Sartorial exists to liberate modern dressers from the frenetic treadmill of 52 micro-seasons per year. By understanding textile breathability, silhouette proportions, and garment maintenance, anyone can build a timeless wardrobe that commands respect while costing less over a lifetime.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-3 bg-[#FAF9F5] p-6 rounded-xl border border-[#E5DFD5]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#78716C]">
                Reader Quick-Start
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => navigateTo('/blog/how-to-build-wardrobe-on-budget')}
                    className="font-medium text-[#1C1917] hover:text-[#9A3412] text-left block"
                  >
                    → The 70/30 Capsule Wardrobe Blueprint
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('/blog/best-fabrics-to-wear-in-summer')}
                    className="font-medium text-[#1C1917] hover:text-[#9A3412] text-left block"
                  >
                    → Summer Textile Breathability Chart
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('/blog/how-to-choose-clothing-size-online')}
                    className="font-medium text-[#1C1917] hover:text-[#9A3412] text-left block"
                  >
                    → How to Measure Flat Garments Accurately
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
