import { BlogPost } from '../types/blog';

export function updateMetaTags(article?: BlogPost) {
  const defaultTitle = "L'ATELIER SARTORIAL – The Modern Clothing & Style Journal";
  const defaultDesc = "An elegant, editorial clothing and fashion publication featuring comprehensive style guides, capsule wardrobe blueprints, fabric care, outfit inspirations, and sustainable fashion insights.";

  const title = article ? article.metaTitle : defaultTitle;
  const desc = article ? article.metaDescription : defaultDesc;
  const url = window.location.href;
  const image = article ? (window.location.origin + article.featuredImage) : '';

  // Update document title
  document.title = title;

  // Helper to set or create meta tag
  const setMeta = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.querySelector(`meta[${nameAttr}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('name', 'description', desc);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:url', url);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', desc);

  if (image) {
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:image', image);
  }

  // Update JSON-LD structured data
  let scriptEl = document.querySelector('script#dynamic-jsonld') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'dynamic-jsonld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  if (article) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.metaDescription,
      "image": image,
      "datePublished": article.publishedDate,
      "author": {
        "@type": "Person",
        "name": article.author.name,
        "jobTitle": article.author.role
      },
      "publisher": {
        "@type": "Organization",
        "name": "L'ATELIER SARTORIAL",
        "url": window.location.origin
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "keywords": article.keywords.join(', ')
    };
    scriptEl.textContent = JSON.stringify(jsonLd);
  } else {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "L'ATELIER SARTORIAL Journal",
      "description": defaultDesc,
      "url": window.location.origin
    };
    scriptEl.textContent = JSON.stringify(jsonLd);
  }
}
