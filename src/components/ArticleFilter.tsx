import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ArticleFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
}

export const ArticleFilter: React.FC<ArticleFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
}) => {
  return (
    <div className="space-y-5">
      {/* Search Bar & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Instant Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search guides, textiles, wardrobe formulas, dress codes..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#FAF9F5] border border-[#E5DFD5] rounded-lg text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#1C1917] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917] p-0.5"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Metric Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-[#78716C] font-mono tabular-nums">
            {totalCount} {totalCount === 1 ? 'Article' : 'Articles'}
          </span>

          <div className="flex items-center gap-1.5 text-xs text-[#57534E] bg-[#FAF9F5] border border-[#E5DFD5] rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#78716C]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent border-none text-[#1C1917] font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="default">Curated Order</option>
              <option value="readTimeAsc">Shortest Read</option>
              <option value="readTimeDesc">Longest Deep Dive</option>
              <option value="titleAsc">Title (A-Z)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Segmented Category Buttons (Adhering to anti-slop guidelines: interactive buttons, no pill enclosures) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectCategory('All')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            activeCategory === 'All'
              ? 'bg-[#1C1917] text-[#FAF9F5]'
              : 'bg-[#F4F1EA] text-[#57534E] hover:text-[#1C1917] hover:bg-[#EBE6DF]'
          }`}
        >
          All Topics
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              activeCategory === cat
                ? 'bg-[#1C1917] text-[#FAF9F5]'
                : 'bg-[#F4F1EA] text-[#57534E] hover:text-[#1C1917] hover:bg-[#EBE6DF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Filter Prompt */}
      {(activeCategory !== 'All' || searchQuery) && (
        <div className="flex items-center gap-2 text-xs text-[#57534E] pt-1">
          <span>Active filter:</span>
          {activeCategory !== 'All' && (
            <span className="font-semibold text-[#1C1917]">
              Category: {activeCategory}
            </span>
          )}
          {activeCategory !== 'All' && searchQuery && <span>·</span>}
          {searchQuery && (
            <span>
              Keyword: "{searchQuery}"
            </span>
          )}
          <button
            onClick={() => {
              onSelectCategory('All');
              onSearchChange('');
            }}
            className="text-[#9A3412] hover:underline ml-2 cursor-pointer font-medium"
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  );
};
