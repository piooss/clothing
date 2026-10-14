import { useState, useEffect } from 'react';

const STORAGE_KEY = 'latelier_saved_articles_v1';

export function getSavedSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSavedSlug(slug: string): boolean {
  const current = getSavedSlugs();
  let updated: string[];
  let isSaved: boolean;
  if (current.includes(slug)) {
    updated = current.filter(s => s !== slug);
    isSaved = false;
  } else {
    updated = [...current, slug];
    isSaved = true;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('latelier-bookmarks-changed'));
  } catch {
    // ignore
  }
  return isSaved;
}

export function useBookmarks() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>(getSavedSlugs);

  useEffect(() => {
    const update = () => setSavedSlugs(getSavedSlugs());
    window.addEventListener('latelier-bookmarks-changed', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('latelier-bookmarks-changed', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const toggle = (slug: string) => {
    return toggleSavedSlug(slug);
  };

  const isSaved = (slug: string) => savedSlugs.includes(slug);

  return { savedSlugs, toggle, isSaved };
}
