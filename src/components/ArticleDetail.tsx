import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Bookmark, Share2, Check, Copy, ChevronDown, ChevronUp, 
  ArrowRight, Clock, Calendar, User, Eye, Sparkles, ShoppingBag, 
  ThumbsUp, ThumbsDown, HelpCircle, Link as LinkIcon, Download, Camera
} from 'lucide-react';
import { BlogPost, ProductRecommendation } from '../types/blog';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { navigateTo } from '../utils/router';
import { useBookmarks } from '../utils/bookmarks';
import { updateMetaTags } from '../utils/seo';
import { ProductModal } from './ProductModal';

interface ArticleDetailProps {
  article: BlogPost;
}

function highlightKeywords(text: string, keywords: string[]): React.ReactNode {
  if (!keywords || keywords.length === 0) return text;

  const valid = keywords
    .filter((k) => k && k.trim().length > 0)
    .sort((a, b) => b.length - a.length);

  if (valid.length === 0) return text;

  const escaped = valid.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isKeyword = valid.some((k) => k.toLowerCase() === part.toLowerCase());
    if (isKeyword) {
      return (
        <mark
          key={index}
          className="bg-[#FAF0E6] text-[#9A3412] font-semibold px-1.5 py-0.5 rounded border border-[#E8D5C4] inline shadow-xs transition-colors hover:bg-[#F3E5D8]"
          title={`Focus Keyword: ${part}`}
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
  const { isSaved, toggle } = useBookmarks();
  const saved = isSaved(article.slug);

  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [readProgress, setReadProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecommendation | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Update SEO meta tags & JSON-LD
  useEffect(() => {
    updateMetaTags(article);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [article]);

  // Track scroll position for reading progress and active TOC section
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadProgress(progress);
      }

      // Check which section is in view
      const sectionElements = article.toc.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 180;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSectionId(article.toc[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'pinterest' | 'copy') => {
    const url = `${window.location.origin}/${article.slug}`;
    const title = article.title;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'pinterest':
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2500);
        });
        break;
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileTocOpen(false);
    }
  };

  // Find related articles
  const relatedArticles = BLOG_ARTICLES.filter(a => 
    article.relatedSlugs.includes(a.slug) || (a.category === article.category && a.id !== article.id)
  ).slice(0, 3);

  // Find adjacent articles for pagination
  const currentIndex = BLOG_ARTICLES.findIndex(a => a.id === article.id);
  const prevArticle = currentIndex > 0 ? BLOG_ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < BLOG_ARTICLES.length - 1 ? BLOG_ARTICLES[currentIndex + 1] : null;

  return (
    <article className="min-h-screen bg-[#FAF9F5] text-[#1C1917]">
      
      {/* Pinned Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-[#9A3412] z-50 transition-all duration-100 ease-out"
        style={{ width: `${readProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Top Breadcrumb & Return Ribbon */}
      <div className="border-b border-[#E5DFD5] bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="flex items-center gap-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Style Guides</span>
          </a>

          {/* Breadcrumb path */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#78716C]">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className="hover:underline hover:text-[#1C1917]"
            >
              L'Atelier Home
            </a>
            <span>/</span>
            <a
              href={`/category/${article.category}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(`/category/${article.category}`);
              }}
              className="hover:underline hover:text-[#1C1917]"
            >
              {article.category} Department
            </a>
            <span>/</span>
            <span className="text-[#1C1917] truncate max-w-xs">{article.title.split(':')[0]}</span>
          </div>

          {/* Quick Bookmark Toggle */}
          <button
            onClick={() => toggle(article.slug)}
            className="flex items-center gap-1.5 text-xs text-[#1C1917] hover:text-[#9A3412] font-medium transition-colors cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#9A3412] text-[#9A3412]' : ''}`} />
            <span>{saved ? 'Saved' : 'Save Article'}</span>
          </button>
        </div>
      </div>

      {/* Article Header & Lead Presentation */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 space-y-6">
        
        {/* Zero-Pill Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#57534E]">
          <a
            href={`/category/${article.category}`}
            onClick={(e) => {
              e.preventDefault();
              navigateTo(`/category/${article.category}`);
            }}
            className="font-semibold tracking-wider uppercase text-[#9A3412] hover:underline"
          >
            {article.category} Guides
          </a>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#78716C]" />
            {article.publishedDate}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#78716C]" />
            {article.readTime}
          </span>
        </div>

        {/* Headline with balanced wrap */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917] leading-tight tracking-tight text-balance">
          {article.title}
        </h1>

        {/* Subtitle / Deck */}
        <p className="text-base sm:text-lg text-[#57534E] leading-relaxed font-sans">
          {article.subtitle}
        </p>

        {/* Author Byline & Social Action Bar */}
        <div className="pt-6 border-t border-[#E5DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-[#E5DFD5]"
            />
            <div>
              <p className="text-sm font-semibold text-[#1C1917]">{article.author.name}</p>
              <p className="text-xs text-[#78716C]">{article.author.role}</p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <span className="text-xs text-[#78716C] mr-1 hidden sm:inline">Share:</span>
            
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F4F1EA] rounded border border-[#E5DFD5] transition-colors text-xs font-mono"
              title="Share on X / Twitter"
              aria-label="Share on X / Twitter"
            >
              X
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F4F1EA] rounded border border-[#E5DFD5] transition-colors text-xs font-mono"
              title="Share on LinkedIn"
              aria-label="Share on LinkedIn"
            >
              in
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F4F1EA] rounded border border-[#E5DFD5] transition-colors text-xs font-mono"
              title="Share on Facebook"
              aria-label="Share on Facebook"
            >
              fb
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center gap-1.5 px-3 py-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F4F1EA] rounded border border-[#E5DFD5] transition-colors text-xs font-medium cursor-pointer"
              title="Copy article link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Core Topic Keywords Index (1 Main, 2 Related Keywords) */}
        {(article.primaryKeyword || (article.relatedKeywords && article.relatedKeywords.length > 0)) && (
          <div className="p-4 bg-[#F4F1EA] border border-[#E5DFD5] rounded-xl space-y-2.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[#78716C] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#9A3412]" />
                Focus Keywords (Highlighted in opening paragraph below):
              </span>
              <span className="text-[11px] text-[#78716C] italic">1 Main &amp; 2 Related</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {article.primaryKeyword && (
                <span className="inline-flex items-center gap-1.5 bg-[#FAF9F5] border border-[#E8D5C4] text-[#9A3412] px-3 py-1.5 rounded-md font-semibold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#9A3412]"></span>
                  <span className="text-[#78716C] font-normal uppercase text-[10px] tracking-wider">Main:</span>
                  {article.primaryKeyword}
                </span>
              )}
              {article.relatedKeywords?.map((kw, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-[#FAF9F5] border border-[#E5DFD5] text-[#292524] px-3 py-1.5 rounded-md font-medium">
                  <span className="text-[#78716C] font-normal uppercase text-[10px] tracking-wider">Related {i + 1}:</span>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

      </header>

      {/* Featured Marquee Image with Artist Attribution & Direct Clean Download */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-[#F4F1EA] border border-[#E5DFD5] shadow-sm group">
          <img
            src={article.featuredImage}
            alt={article.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Artist Watermark Overlay Badge (baked into image + displayed in UI) */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1917]/85 backdrop-blur-md text-[#FAF9F5] text-xs font-medium shadow-sm pointer-events-none">
            <Camera className="w-3.5 h-3.5 text-[#E5DFD5]" />
            <span>Artist: <strong className="text-white">{article.author.name}</strong></span>
          </div>

          {/* Clean File Save Button (under 100kb with proper filename) */}
          <a
            href={article.featuredImage}
            download={article.featuredImage.split('/').pop()}
            title={`Download ${article.featuredImage.split('/').pop()} (<100KB)`}
            className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F5]/90 hover:bg-[#FAF9F5] text-[#1C1917] text-xs font-medium border border-[#E5DFD5] shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#9A3412]" />
            <span className="hidden sm:inline">Save Image</span>
            <span className="text-[10px] text-[#78716C] font-mono">&lt;100KB</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-[#78716C] mt-2.5 px-1 gap-2">
          <p className="font-serif italic text-center sm:text-left">
            {article.imageCaption || `Curated editorial portrait by artist ${article.author.name}`}
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#57534E]">
            <span className="text-[#9A3412] font-semibold">{article.featuredImage.split('/').pop()}</span>
            <span>·</span>
            <span>Artist: {article.author.name}</span>
            <span>·</span>
            <span className="bg-[#E7E5E4] px-1.5 py-0.5 rounded text-[#292524]">&lt;100KB Optimized</span>
          </div>
        </div>
      </div>

      {/* Main Reading Grid: Sticky TOC Sidebar + Longform Article Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              
              <div className="p-5 bg-[#F4F1EA] rounded-xl border border-[#E5DFD5]">
                <h3 className="text-xs uppercase tracking-widest text-[#78716C] font-mono mb-3">
                  Table of Contents
                </h3>
                <nav className="space-y-1.5 text-xs">
                  {article.toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left py-1.5 transition-colors cursor-pointer ${
                        activeSectionId === item.id
                          ? 'text-[#9A3412] font-semibold pl-2 border-l-2 border-[#9A3412]'
                          : 'text-[#57534E] hover:text-[#1C1917] pl-2 border-l-2 border-transparent'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Article Key Metrics */}
              <div className="p-5 bg-[#FAF9F5] border border-[#E5DFD5] rounded-xl space-y-3 text-xs text-[#57534E]">
                <h4 className="font-serif font-semibold text-[#1C1917] text-sm">
                  Guide Summary
                </h4>
                <div className="space-y-2 border-t border-[#E5DFD5] pt-2">
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Estimated Read:</span>
                    <span className="font-mono tabular-nums">{article.readTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Sections:</span>
                    <span className="font-mono tabular-nums">{article.sections.length} Chapters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Curated Picks:</span>
                    <span className="font-mono tabular-nums">{article.productRecommendations.length} Products</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">FAQs:</span>
                    <span className="font-mono tabular-nums">{article.faqs.length} Answers</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* Center/Right: Comprehensive Editorial Body */}
          <main className="lg:col-span-9 max-w-3xl space-y-12">
            
            {/* Mobile Table of Contents Accordion */}
            <div className="lg:hidden p-4 bg-[#F4F1EA] border border-[#E5DFD5] rounded-xl">
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#1C1917]"
              >
                <span>Table of Contents ({article.toc.length} sections)</span>
                {mobileTocOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {mobileTocOpen && (
                <div className="pt-3 mt-3 border-t border-[#E5DFD5] space-y-2 text-xs">
                  {article.toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="block w-full text-left py-1 text-[#57534E] hover:text-[#9A3412]"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Editorial Content Sections */}
            {article.sections.map((section, sIndex) => (
              <section key={section.id} id={section.id} className="space-y-5 scroll-mt-24">
                {section.heading && (
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917] pt-2 border-b border-[#E5DFD5] pb-2">
                    {section.heading}
                  </h2>
                )}

                {section.paragraphs.map((para, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-base sm:text-lg text-[#292524] leading-relaxed font-sans"
                  >
                    {sIndex === 0 && pIndex === 0
                      ? highlightKeywords(para, [article.primaryKeyword, ...(article.relatedKeywords || [])])
                      : para}
                  </p>
                ))}

                {/* Callout box (if any) */}
                {section.callout && (
                  <div className="p-6 my-6 bg-[#F4F1EA] border border-[#E5DFD5] rounded-xl space-y-2">
                    <span className="text-xs uppercase tracking-widest font-mono text-[#9A3412] font-semibold">
                      {section.callout.title}
                    </span>
                    <p className="text-sm font-medium text-[#1C1917] leading-relaxed font-serif italic text-lg">
                      "{section.callout.text}"
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* Contextual Internal Reading Links with descriptive anchor text */}
            {relatedArticles.length > 0 && (
              <div className="p-6 bg-[#F4F1EA] border-l-4 border-[#9A3412] rounded-r-xl space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-[#78716C]">
                  Connected Sartorial Reading
                </div>
                <p className="text-xs text-[#57534E]">
                  Continue exploring related topics and deepen your garment expertise:
                </p>
                <ul className="space-y-2.5">
                  {relatedArticles.map((rel) => (
                    <li key={rel.id}>
                      <a
                        href={`/${rel.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo(`/${rel.slug}`);
                        }}
                        className="text-sm font-medium text-[#1C1917] hover:text-[#9A3412] hover:underline flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-[#9A3412] group-hover:translate-x-1 transition-transform shrink-0" />
                        <span>See full guide: {rel.title.split('|')[0].trim()}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* In-Depth Pros and Cons Module */}
            <section id="pros-cons" className="space-y-6 pt-4 scroll-mt-24">
              <div className="border-t border-[#E5DFD5] pt-8">
                <span className="text-xs uppercase tracking-widest font-mono text-[#78716C]">
                  Editorial Assessment
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917] mt-1">
                  Pros & Cons: {article.prosAndCons.subject}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pros List */}
                <div className="p-6 bg-[#F4F1EA] border border-[#E5DFD5] rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span>Key Advantages</span>
                  </div>
                  <ul className="space-y-2.5">
                    {article.prosAndCons.pros.map((pro, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-[#44403C] flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons List */}
                <div className="p-6 bg-[#F4F1EA] border border-[#E5DFD5] rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                    <ThumbsDown className="w-4 h-4 text-[#9A3412]" />
                    <span>Considerations & Trade-Offs</span>
                  </div>
                  <ul className="space-y-2.5">
                    {article.prosAndCons.cons.map((con, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-[#44403C] flex items-start gap-2.5">
                        <span className="text-[#9A3412] font-bold mt-0.5 shrink-0">·</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Curatorial Verdict */}
              <div className="p-5 bg-[#FAF9F5] border border-[#1C1917] rounded-xl">
                <p className="text-xs uppercase font-mono tracking-widest text-[#78716C] mb-1">
                  Curatorial Verdict
                </p>
                <p className="text-sm text-[#1C1917] font-medium leading-relaxed">
                  {article.prosAndCons.verdict}
                </p>
              </div>
            </section>

            {/* Curated Product Recommendations */}
            <section id="curated-products" className="space-y-6 pt-4 scroll-mt-24">
              <div className="border-t border-[#E5DFD5] pt-8">
                <span className="text-xs uppercase tracking-widest font-mono text-[#78716C]">
                  Curated Catalog
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917] mt-1">
                  Editor-Approved Product Recommendations
                </h2>
                <p className="text-xs text-[#78716C] mt-1">
                  Selected purely for fabric integrity, cut precision, and cost-per-wear value. Click any piece for sizing and fit specs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {article.productRecommendations.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className="group bg-[#FAF9F5] border border-[#E5DFD5] rounded-xl overflow-hidden hover:border-[#1C1917] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-4/3 bg-[#F4F1EA] overflow-hidden">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {prod.affiliateTag && (
                          <span className="absolute top-3 left-3 text-xs font-mono uppercase bg-[#1C1917] text-[#FAF9F5] px-2 py-0.5 rounded">
                            {prod.affiliateTag}
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#78716C]">
                          <span className="uppercase tracking-wider font-mono">{prod.brandOrCategory}</span>
                          <span className="font-semibold text-[#9A3412] tabular-nums">{prod.priceRange}</span>
                        </div>

                        <h3 className="font-serif text-lg font-semibold text-[#1C1917] group-hover:text-[#9A3412] transition-colors">
                          {prod.name}
                        </h3>

                        <p className="text-xs text-[#57534E] line-clamp-2">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between text-xs font-medium text-[#1C1917]">
                        <span>View Specifications & Fit</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Frequently Asked Questions Accordion */}
            <section id="faqs" className="space-y-6 pt-4 scroll-mt-24">
              <div className="border-t border-[#E5DFD5] pt-8">
                <span className="text-xs uppercase tracking-widest font-mono text-[#78716C]">
                  Reader Clarifications
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917] mt-1">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {article.faqs.map((faq, index) => {
                  const isOpen = expandedFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="border border-[#E5DFD5] rounded-xl overflow-hidden bg-[#FAF9F5]"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-medium text-[#1C1917] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="font-serif">{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#9A3412]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-[#78716C]" />}
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#57534E] leading-relaxed border-t border-[#E5DFD5] bg-[#F4F1EA]/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Author Profile Card */}
            <div className="p-6 sm:p-8 bg-[#F4F1EA] border border-[#E5DFD5] rounded-xl flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border border-[#E5DFD5] shrink-0"
              />
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest font-mono text-[#78716C]">
                  Written by
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                  {article.author.name}
                </h3>
                <p className="text-xs text-[#9A3412] font-medium">{article.author.role}</p>
                <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                  Contributing editor at L'Atelier Sartorial with extensive experience across European fashion houses, textile laboratories, and independent runway criticism.
                </p>
              </div>
            </div>

            {/* Prev / Next Article Pagination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#E5DFD5]">
              {prevArticle ? (
                <a
                  href={`/${prevArticle.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(`/${prevArticle.slug}`);
                  }}
                  className="p-4 bg-[#FAF9F5] border border-[#E5DFD5] rounded-xl hover:border-[#1C1917] text-left space-y-1 transition-all group cursor-pointer block"
                >
                  <span className="text-xs text-[#78716C] flex items-center gap-1 font-mono uppercase">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Previous Guide
                  </span>
                  <p className="font-serif text-sm font-semibold text-[#1C1917] group-hover:text-[#9A3412] transition-colors line-clamp-1">
                    {prevArticle.title}
                  </p>
                </a>
              ) : <div />}

              {nextArticle ? (
                <a
                  href={`/${nextArticle.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(`/${nextArticle.slug}`);
                  }}
                  className="p-4 bg-[#FAF9F5] border border-[#E5DFD5] rounded-xl hover:border-[#1C1917] text-right space-y-1 transition-all group cursor-pointer block"
                >
                  <span className="text-xs text-[#78716C] flex items-center justify-end gap-1 font-mono uppercase">
                    Next Guide
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <p className="font-serif text-sm font-semibold text-[#1C1917] group-hover:text-[#9A3412] transition-colors line-clamp-1">
                    {nextArticle.title}
                  </p>
                </a>
              ) : <div />}
            </div>

          </main>

        </div>
      </div>

      {/* Related Articles Section */}
      <section className="bg-[#F4F1EA] border-t border-[#E5DFD5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-[#78716C]">
                Explore Further
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                Related Sartorial Guides
              </h2>
            </div>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className="text-xs font-semibold text-[#1C1917] hover:underline inline-flex items-center gap-1 self-start cursor-pointer"
            >
              <span>Explore All 10 Sartorial Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <a
                key={rel.id}
                href={`/${rel.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(`/${rel.slug}`);
                }}
                className="group cursor-pointer bg-[#FAF9F5] border border-[#E5DFD5] rounded-xl overflow-hidden hover:border-[#1C1917] transition-all flex flex-col justify-between block"
              >
                <div>
                  <div className="aspect-16/10 overflow-hidden bg-[#EBE6DF]">
                    <img
                      src={rel.featuredImage}
                      alt={rel.imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-xs text-[#57534E] flex items-center gap-2">
                      <span className="font-semibold uppercase text-[#9A3412]">{rel.category}</span>
                      <span>·</span>
                      <span>{rel.readTime}</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#1C1917] group-hover:text-[#9A3412] transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1 text-xs text-[#78716C] flex items-center justify-between border-t border-[#E5DFD5]">
                  <span>{rel.publishedDate}</span>
                  <span className="font-medium text-[#1C1917] group-hover:underline">Read →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

    </article>
  );
};
