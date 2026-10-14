import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { navigateTo } from '../utils/router';
import { BLOG_ARTICLES } from '../data/blogArticles';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#1C1917] text-[#E7E5E4] pt-16 pb-12 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Dispatch Ribbon */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-[#292524] items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A8A29E] font-mono">
              The Sartorial Gazette
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF9F5] leading-tight">
              Curated Style Wisdom Delivered to Your Inbox
            </h3>
            <p className="text-sm text-[#A8A29E] max-w-lg leading-relaxed">
              Bi-weekly essays on garment craft, seasonal textile science, capsule wardrobe mathematics, and honest brand reviews. Zero spam, unsubscribe anytime.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="flex items-center gap-3 p-4 bg-[#292524] rounded-lg border border-[#44403C]">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-sm text-[#FAF9F5]">
                  Thank you for subscribing to L'Atelier Sartorial. Your welcome edition is en route.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-3 bg-[#292524] border border-[#44403C] rounded-md text-sm text-[#FAF9F5] placeholder-[#78716C] focus:outline-none focus:border-[#FAF9F5] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#FAF9F5] hover:bg-[#E7E5E4] text-[#1C1917] font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {error && <p className="text-xs text-rose-400">{error}</p>}
                <p className="text-xs text-[#78716C]">
                  By subscribing, you agree to our privacy standards and editorial guidelines.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12 border-b border-[#292524]">
          
          {/* Brand Manifesto */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-[#FAF9F5] font-semibold tracking-wide">
              L'ATELIER SARTORIAL
            </h4>
            <p className="text-xs text-[#A8A29E] leading-relaxed">
              An independent digital journal dedicated to modern clothing construction, capsule wardrobe longevity, and thoughtful consumption. Published with curatorial rigor.
            </p>
            <div className="text-xs text-[#78716C] font-mono space-y-1">
              <p>VOL. 2026 · ISSUE IV</p>
              <p>PARIS · MILAN · NEW YORK</p>
            </div>
          </div>

          {/* Department Directories */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-[#FAF9F5] font-mono">
              Key Guides
            </h5>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li>
                <button
                  onClick={() => navigateTo('/category/Trends')}
                  className="hover:text-[#FAF9F5] transition-colors text-left"
                >
                  2026 Runway & Trend Forecasts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/Wardrobe Essentials')}
                  className="hover:text-[#FAF9F5] transition-colors text-left"
                >
                  Capsule Wardrobe on a Budget
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/Outfit Guides')}
                  className="hover:text-[#FAF9F5] transition-colors text-left"
                >
                  Comfort & Everyday Dressing
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/Fabrics & Care')}
                  className="hover:text-[#FAF9F5] transition-colors text-left"
                >
                  Breathable Textiles & Garment Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/Sustainability')}
                  className="hover:text-[#FAF9F5] transition-colors text-left"
                >
                  Fast Fashion vs. Sustainable
                </button>
              </li>
            </ul>
          </div>

          {/* Popular In-Depth Articles */}
          <div className="space-y-3 lg:col-span-2">
            <h5 className="text-xs uppercase tracking-widest text-[#FAF9F5] font-mono">
              The 10 Comprehensive Guides
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#A8A29E]">
              {BLOG_ARTICLES.map((art, idx) => (
                <button
                  key={art.id}
                  onClick={() => navigateTo(`/blog/${art.slug}`)}
                  className="text-left hover:text-[#FAF9F5] transition-colors truncate"
                  title={art.title}
                >
                  <span className="font-mono text-[#78716C] mr-1.5">{String(idx + 1).padStart(2, '0')}.</span>
                  {art.title.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Credits & Integrity */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <p>© 2026 L'Atelier Sartorial. All rights reserved. Original editorial publications.</p>
          <div className="flex items-center gap-6">
            <span>Independent Editorial Standards</span>
            <span>·</span>
            <span>Zero Fast-Fashion Sponsorship</span>
            <span>·</span>
            <span>Curated Craftsmanship</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
