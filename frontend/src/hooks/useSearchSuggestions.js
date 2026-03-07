import { useState, useEffect } from 'react';
import { getProductSuggestions } from '../services/productService';

/**
 * Custom hook that returns debounced autocomplete suggestions for a search query.
 *
 * Debouncing prevents a request on every keystroke; instead, a request is only
 * sent when the user pauses typing for {@code delay} milliseconds. Queries shorter
 * than 2 characters skip the network entirely.
 *
 * All state updates happen inside the async timer callback (not the effect body),
 * so the hook satisfies the React "avoid synchronous setState in effects" rule.
 *
 * This hook calls GET /api/products/suggestions — a lightweight endpoint separate
 * from the main product catalogue fetch — so suggestions never trigger a grid reload.
 *
 * @param {string} query - the current value of the search input
 * @param {number} [delay=300] - debounce delay in milliseconds
 * @returns {{ suggestions: string[] }}
 */
export default function useSearchSuggestions(query, delay = 300) {
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);

  useEffect(() => {
    const trimmed = query.trim();
    // Do not fetch for very short queries — results would be too broad
    if (trimmed.length < 2) return;

    const timer = setTimeout(() => {
      // setState is called inside an async callback, not in the effect body itself
      getProductSuggestions(trimmed)
        .then(setFetchedSuggestions)
        .catch(() => setFetchedSuggestions([]));
    }, delay);

    // Cancel the pending timer when the query changes before the delay fires
    return () => clearTimeout(timer);
  }, [query, delay]);

  // Suppress stale results inline when the query is too short to have fetched.
  // This avoids calling setState in the effect body just to clear state.
  const trimmed = query.trim();
  return { suggestions: trimmed.length >= 2 ? fetchedSuggestions : [] };
}
