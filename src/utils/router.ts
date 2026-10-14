import { useEffect, useState } from 'react';

export type RouteState = 
  | { view: 'home'; searchParam?: string; categoryParam?: string }
  | { view: 'article'; slug: string }
  | { view: 'category'; category: string };

export function parseCurrentRoute(): RouteState {
  const hash = window.location.hash;
  const path = window.location.pathname;

  // Check hash-based routing first (common in preview iframes) or standard pathname
  let effectivePath = path;
  if (hash.startsWith('#/')) {
    effectivePath = hash.slice(1);
  } else if (hash.startsWith('#')) {
    effectivePath = hash.slice(1);
  }

  // Check /blog/:slug
  const blogMatch = effectivePath.match(/^\/?blog\/([a-zA-Z0-9_-]+)/);
  if (blogMatch && blogMatch[1]) {
    return { view: 'article', slug: blogMatch[1] };
  }

  // Check /category/:cat
  const catMatch = effectivePath.match(/^\/?category\/([a-zA-Z0-9_-]+)/);
  if (catMatch && catMatch[1]) {
    return { view: 'category', category: decodeURIComponent(catMatch[1]) };
  }

  // Check query params if any
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q') || undefined;
  const cat = urlParams.get('cat') || undefined;

  return { view: 'home', searchParam: q, categoryParam: cat };
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
