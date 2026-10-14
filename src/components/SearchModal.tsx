import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, BookOpen } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { navigateTo } from '../utils/router';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = BLOG_ARTICLES.filter((article) => {
    const q = query.trim().toLowerCase();
    if (!q) return false;
    return (
      article.title.toLowerCase().includes(q) ||
      article.subtitle.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q) ||
      article.keywords.some((k) => k.toLowerCase().includes(q)) ||
      article.excerpt.toLowerCase().includes(q)
    );
  });

  const handleSelect = (slug: string) => {
    onClose();
    navigateTo(`/blog/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-[#FAF9F5] border border-[#E5DFD5] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E5DFD5] flex items-center gap-3 bg-[#FAF9F5]">
          <Search className="w-5 h-5 text-[#78716C] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides, fabrics, outfit formulas, budget tips..."
            className="flex-1 text-sm bg-transparent border-none text-[#1C1917] placeholder-[#78716C] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#78716C] hover:text-[#1C1917] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-[#78716C] hover:text-[#1C1917] bg-[#F4F1EA] rounded"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {!query ? (
            <div className="py-8 text-center space-y-2 text-xs text-[#78716C]">
              <p className="font-medium text-[#1C1917]">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['2026 Trends', 'Capsule Wardrobe', 'Linen vs Cotton', 'Smart Casual', 'Garment Care', 'Accessories', 'Size Guide'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-[#F4F1EA] hover:bg-[#EBE6DF] text-[#57534E] rounded-md transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center space-y-2 text-xs text-[#78716C]">
              <p>No guides found for "{query}".</p>
              <p className="text-[#A8A29E]">Try searching for "linen", "trends", "suits", or "budget".</p>
            </div>
          ) : (
            results.map((art) => (
              <button
                key={art.id}
                onClick={() => handleSelect(art.slug)}
                className="w-full text-left p-3.5 bg-[#F4F1EA] hover:bg-[#EBE6DF] rounded-xl transition-colors group flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="text-xs text-[#78716C] flex items-center gap-2 font-mono">
                    <span className="text-[#9A3412] uppercase">{art.category}</span>
                    <span>·</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#1C1917] group-hover:text-[#9A3412] transition-colors">
                    {art.title}
                  </h4>
                  <p className="text-xs text-[#57534E] line-clamp-1">
                    {art.excerpt}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#78716C] group-hover:text-[#1C1917] shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F4F1EA] border-t border-[#E5DFD5] text-xs text-[#78716C] flex justify-between items-center">
          <span>{results.length} guides found</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
