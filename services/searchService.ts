import { apiService } from "./apiService";

// ==========================================
// TIPAGENS
// ==========================================

export type SearchResultType = "event" | "organization";

export interface SearchResult {
  id:        string;
  type:      SearchResultType;
  title:     string;
  subtitle?: string;
  imageUrl?: string;
  slug:      string;
}

export interface SearchResponse {
  results: SearchResult[];
}

// ==========================================
// SERVICE
// ==========================================

export const searchService = {
  search: (q: string): Promise<SearchResponse> =>
    apiService.get<SearchResponse>(`/client/search?q=${encodeURIComponent(q)}`),
};


import { useState, useEffect } from "react";

export function useSearch(query: string) {
  const [results, setResults]   = useState<SearchResult[]>([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await searchService.search(query.trim());
        setResults(data.results);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}