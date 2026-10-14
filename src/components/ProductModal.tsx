import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { ProductRecommendation } from '../types/blog';

interface ProductModalProps {
  product: ProductRecommendation | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [inquired, setInquired] = useState(false);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF9F5] border border-[#E5DFD5] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#57534E] hover:text-[#1C1917] bg-[#FAF9F5]/90 hover:bg-[#FAF9F5] rounded-full border border-[#E5DFD5] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 max-h-[85vh] overflow-y-auto">
          {/* Product Image */}
          <div className="md:col-span-5 bg-[#F4F1EA] relative">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover min-h-[260px] md:min-h-full"
            />
            {product.affiliateTag && (
              <span className="absolute top-4 left-4 text-xs font-mono tracking-wider uppercase bg-[#1C1917] text-[#FAF9F5] px-2.5 py-1 rounded">
                {product.affiliateTag}
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-5 bg-[#FAF9F5]">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#78716C] font-mono">
                {product.brandOrCategory}
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#1C1917] mt-1">
                {product.name}
              </h3>
              <p className="text-base font-semibold text-[#9A3412] mt-1 tabular-nums">
                {product.priceRange}
              </p>
            </div>

            <p className="text-xs text-[#57534E] leading-relaxed">
              {product.description}
            </p>

            {/* Curated Pros */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Why Our Editors Recommend This:
              </span>
              <ul className="space-y-1.5">
                {product.pros.map((p, i) => (
                  <li key={i} className="text-xs text-[#57534E] flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best For Tag */}
            <div className="p-3 bg-[#F4F1EA] rounded-lg border border-[#E5DFD5] text-xs">
              <span className="font-semibold text-[#1C1917]">Best Recommended For: </span>
              <span className="text-[#57534E]">{product.bestFor}</span>
            </div>

            {/* Sizing selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1C1917]">Select Sizing:</span>
                <span className="text-[#78716C]">Standard EU / US Sizing</span>
              </div>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917]'
                        : 'bg-[#FAF9F5] text-[#57534E] border-[#E5DFD5] hover:border-[#1C1917]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#E5DFD5]">
              {inquired ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Item added to your seasonal wishlist (Size {selectedSize}).</span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setInquired(true)}
                    className="flex-1 py-2.5 px-4 bg-[#1C1917] hover:bg-[#292524] text-[#FAF9F5] rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Save to Wardrobe Wishlist</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="py-2.5 px-4 bg-[#F4F1EA] hover:bg-[#EBE6DF] text-[#1C1917] rounded-md text-xs font-medium transition-colors border border-[#E5DFD5] cursor-pointer"
                  >
                    Back to Article
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
