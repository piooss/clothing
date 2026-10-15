import React, { useState } from 'react';
import { Bookmark, Search, Menu, X, ArrowRight } from 'lucide-react';
import { navigateTo } from '../utils/router';
import { useBookmarks } from '../utils/bookmarks';

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenReadingList?: () => void;
  currentCategory?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenReadingList, currentCategory }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { savedSlugs } = useBookmarks();

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigateTo(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5DFD5] transition-colors">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/');
          }}
          className="text-left group cursor-pointer shrink-0"
          aria-label="L'ATELIER SARTORIAL Home"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917] group-hover:text-[#9A3412] transition-colors whitespace-nowrap">
            L'ATELIER SARTORIAL
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#57534E]">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
          >
            All Articles
          </a>
          <a
            href="/category/Trends"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Trends');
            }}
            className={`hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b ${
              currentCategory === 'Trends' ? 'text-[#1C1917] border-[#1C1917] font-semibold' : 'border-transparent hover:border-[#1C1917]'
            }`}
          >
            2026 Trends
          </a>
          <a
            href="/category/Wardrobe Essentials"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Wardrobe Essentials');
            }}
            className={`hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b ${
              currentCategory === 'Wardrobe Essentials' ? 'text-[#1C1917] border-[#1C1917] font-semibold' : 'border-transparent hover:border-[#1C1917]'
            }`}
          >
            Capsule Wardrobe
          </a>
          <a
            href="/category/Fabrics & Care"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Fabrics & Care');
            }}
            className={`hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b ${
              currentCategory === 'Fabrics & Care' ? 'text-[#1C1917] border-[#1C1917] font-semibold' : 'border-transparent hover:border-[#1C1917]'
            }`}
          >
            Fabrics & Care
          </a>
          <a
            href="/category/Sustainability"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Sustainability');
            }}
            className={`hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b ${
              currentCategory === 'Sustainability' ? 'text-[#1C1917] border-[#1C1917] font-semibold' : 'border-transparent hover:border-[#1C1917]'
            }`}
          >
            Sustainable Fashion
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F4F1EA] rounded-full transition-colors cursor-pointer"
              title="Search articles"
              aria-label="Search articles"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenReadingList}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#1C1917] bg-[#F4F1EA] hover:bg-[#EBE6DF] border border-[#E5DFD5] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="View Saved Reading List"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reading List</span>
            {savedSlugs.length > 0 && (
              <span className="text-xs font-semibold tabular-nums ml-0.5 text-[#9A3412]">
                ({savedSlugs.length})
              </span>
            )}
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#57534E] hover:text-[#1C1917] cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F5] border-b border-[#E5DFD5] px-4 pt-3 pb-6 space-y-3">
          <div className="text-xs tracking-wider uppercase text-[#78716C] font-mono px-2 pt-1">
            Department Sections
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            All 10 In-Depth Articles
          </a>
          <a
            href="/category/Trends"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Trends');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            2026 Runway & Outfit Trends
          </a>
          <a
            href="/category/Wardrobe Essentials"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Wardrobe Essentials');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            Capsule Wardrobe on a Budget
          </a>
          <a
            href="/category/Outfit Guides"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Outfit Guides');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            Everyday Outfits & Comfort
          </a>
          <a
            href="/category/Fabrics & Care"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Fabrics & Care');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            Summer Fabrics & Garment Care
          </a>
          <a
            href="/category/Styling Advice"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Styling Advice');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            Color Matching & Harmony
          </a>
          <a
            href="/category/Dress Codes"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Dress Codes');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            Casual vs. Formal Dress Codes
          </a>
          <a
            href="/category/Accessories"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Accessories');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            10 Fashion Accessories
          </a>
          <a
            href="/category/Smart Shopping"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Smart Shopping');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            Online Size & Fit Guide
          </a>
          <a
            href="/category/Sustainability"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/category/Sustainability');
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F4F1EA] rounded-md"
          >
            Fast Fashion vs. Sustainable
          </a>
          
          <div className="pt-2 border-t border-[#E5DFD5]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch?.();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#1C1917] bg-[#F4F1EA] rounded-md"
            >
              <span>Instant Search</span>
              <Search className="w-4 h-4 text-[#57534E]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
