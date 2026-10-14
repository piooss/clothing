export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface CalloutBox {
  title: string;
  text: string;
  type?: 'tip' | 'quote' | 'formula';
}

export interface ContentSection {
  id: string;
  heading?: string;
  level?: 2 | 3;
  paragraphs: string[];
  callout?: CalloutBox;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  brandOrCategory: string;
  priceRange: string;
  image: string;
  description: string;
  pros: string[];
  bestFor: string;
  affiliateTag?: string;
}

export interface ProsAndCons {
  subject: string;
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Trends' | 'Wardrobe Essentials' | 'Outfit Guides' | 'Fabrics & Care' | 'Styling Advice' | 'Dress Codes' | 'Accessories' | 'Smart Shopping' | 'Sustainability';
  publishedDate: string;
  readTime: string;
  author: Author;
  featuredImage: string;
  imageAlt: string;
  imageCaption: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  toc: TocItem[];
  sections: ContentSection[];
  prosAndCons: ProsAndCons;
  productRecommendations: ProductRecommendation[];
  faqs: FAQItem[];
  relatedSlugs: string[];
}
