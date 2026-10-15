import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { useBookmarks } from '../utils/bookmarks';
import { navigateTo } from '../utils/router';

interface ReadingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadingListDrawer: React.FC<ReadingListDrawerProps> = ({ isOpen, onClose }) => {
  const { savedSlugs, toggle } = useBookmarks();

  if (!isOpen) return null;

  const savedArticles = BLOG_ARTICLES.filter((a) => savedSlugs.includes(a.slug));

  const handleSelectArticle = (slug: string) => {
    onClose();
    navigateTo(`/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E5DFD5] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E5DFD5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#9A3412]" />
              <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                Saved Reading List
              </h3>
              <span className="text-xs text-[#78716C] font-mono tabular-nums">
                ({savedArticles.length})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#57534E] hover:text-[#1C1917] rounded-full hover:bg-[#F4F1EA] transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedArticles.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <BookOpen className="w-10 h-10 text-[#A8A29E] mx-auto stroke-1" />
                <h4 className="font-serif text-lg text-[#1C1917] font-medium">Your Reading List is Empty</h4>
                <p className="text-xs text-[#78716C] max-w-xs mx-auto leading-relaxed">
                  Click the bookmark icon on any guide or article to save it for offline reference or quiet reading later.
                </p>
              </div>
            ) : (
              savedArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-4 bg-[#F4F1EA] border border-[#E5DFD5] rounded-xl hover:border-[#1C1917] transition-all group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#78716C]">
                      <span className="uppercase tracking-wider font-mono text-[#9A3412]">
                        {art.category}
                      </span>
                      <span>{art.readTime}</span>
                    </div>

                    <h4 className="font-serif text-base font-semibold text-[#1C1917] hover:text-[#9A3412] line-clamp-2 transition-colors">
                      <a
                        href={`/${art.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectArticle(art.slug);
                        }}
                        className="hover:underline"
                      >
                        {art.title}
                      </a>
                    </h4>

                    <p className="text-xs text-[#57534E] line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E5DFD5] flex items-center justify-between text-xs">
                    <a
                      href={`/${art.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectArticle(art.slug);
                      }}
                      className="font-medium text-[#1C1917] inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => toggle(art.slug)}
                      className="text-[#78716C] hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {savedArticles.length > 0 && (
            <div className="p-4 border-t border-[#E5DFD5] bg-[#FAF9F5] text-xs text-[#78716C] text-center">
              Articles remain saved in your browser's private local storage.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
