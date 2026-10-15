import { useEffect, useState } from 'react';

export type RouteState = 
  | { view: 'home'; searchParam?: string; categoryParam?: string }
  | { view: 'article'; slug: string }
  | { view: 'category'; category: string };

export function parseCurrentRoute(): RouteState {
  const hash = window.location.hash;
  const path = window.location.pathname;

  // Clean path without hashes or redundant slashes
  let effectivePath = path;
  if (hash.startsWith('#/')) {
    effectivePath = hash.slice(1);
  } else if (hash.startsWith('#')) {
    effectivePath = hash.slice(1);
  }

  // Strip leading and trailing slashes
  const clean = effectivePath.replace(/^\/+|\/+$/g, '');

  // Root homepage
  if (!clean) {
    const urlParams = new URLSearchParams(window.location.search);
    return { 
      view: 'home', 
      searchParam: urlParams.get('q') || undefined, 
      categoryParam: urlParams.get('cat') || undefined 
    };
  }

  // Category view: /category/:cat
  const catMatch = clean.match(/^category\/(.+)$/i);
  if (catMatch && catMatch[1]) {
    return { view: 'category', category: decodeURIComponent(catMatch[1]) };
  }

  // /blog/:slug view (supported for legacy/external links)
  const blogMatch = clean.match(/^blog\/(.+)$/i);
  if (blogMatch && blogMatch[1]) {
    return { view: 'article', slug: blogMatch[1] };
  }

  // Clean top-level direct slug (e.g., /fashion-trends-2026-style-guide)
  return { view: 'article', slug: clean };
}

export function navigateTo(path: string, options?: { replace?: boolean }) {
  try {
    if (options?.replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
  } catch {
    // If pushState is restricted by iframe sandboxing, fall back to hash
    window.location.hash = path.startsWith('/') ? path : '/' + path;
  }
  
  // Dispatch custom event to notify all components
  window.dispatchEvent(new Event('applet-navigate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useAppRouter() {
  const [route, setRoute] = useState<RouteState>(parseCurrentRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(parseCurrentRoute());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('applet-navigate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('applet-navigate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  return { route, navigateTo };
}
