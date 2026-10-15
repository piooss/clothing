import React, { useState } from 'react';
import { useAppRouter, navigateTo } from './utils/router';
import { BLOG_ARTICLES } from './data/blogArticles';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ArticleDetail } from './components/ArticleDetail';
import { ReadingListDrawer } from './components/ReadingListDrawer';
import { SearchModal } from './components/SearchModal';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function App() {
  const { route } = useAppRouter();
  const [readingListOpen, setReadingListOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Determine current active article if on /blog/:slug
  let currentArticle = null;
  let is404 = false;

  if (route.view === 'article') {
    const cleanSlug = route.slug.toLowerCase().trim().replace(/^\/+|\/+$/g, '');
    currentArticle = BLOG_ARTICLES.find(
      (a) => a.slug.toLowerCase() === cleanSlug || a.aliases?.some((alias) => alias.toLowerCase() === cleanSlug)
    );
    if (!currentArticle) {
      // Fallback matching for partial clean keyword slugs
      currentArticle = BLOG_ARTICLES.find(
        (a) => a.slug.toLowerCase().includes(cleanSlug) || cleanSlug.includes(a.slug.toLowerCase())
      );
    }
    if (!currentArticle) {
      is404 = true;
    }
  }

  const currentCategory =
    route.view === 'category'
      ? route.category
      : currentArticle
      ? currentArticle.category
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1C1917] font-sans antialiased selection:bg-[#E5DFD5]">
      
      {/* Top Bar Header */}
      <Header
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenReadingList={() => setReadingListOpen(true)}
        currentCategory={currentCategory}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {route.view === 'article' ? (
          is404 ? (
            <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-[#78716C] mx-auto stroke-1" />
              <h1 className="font-serif text-3xl font-semibold text-[#1C1917]">
                Article Not Found
              </h1>
              <p className="text-sm text-[#57534E]">
                The editorial guide you requested cannot be located. It may have been updated or moved.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => navigateTo('/')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-[#FAF9F5] text-xs font-medium rounded-md hover:bg-[#292524] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Journal Home</span>
                </button>
              </div>
            </div>
          ) : (
            currentArticle && <ArticleDetail article={currentArticle} />
          )
        ) : route.view === 'category' ? (
          <HomePage initialCategory={route.category} />
        ) : (
          <HomePage
            initialCategory={route.categoryParam || 'All'}
            initialSearch={route.searchParam || ''}
          />
        )}
      </main>

      {/* Curatorial Footer */}
      <Footer />

      {/* Slide-over Reading List Drawer */}
      <ReadingListDrawer
        isOpen={readingListOpen}
        onClose={() => setReadingListOpen(false)}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

    </div>
  );
}
