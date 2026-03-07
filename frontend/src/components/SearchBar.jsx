import { useState, useRef, useCallback } from 'react';
import useSearchSuggestions from '../hooks/useSearchSuggestions';

/**
 * Component Layer – Search input with an autocomplete suggestions dropdown.
 *
 * Responsibilities:
 *  - Renders the controlled text input and the submit button inside a <form>
 *  - Shows a debounced suggestions list as the user types (via useSearchSuggestions)
 *  - Supports full keyboard navigation (↓ ↑ Enter to select, Escape to close)
 *  - Notifies parent of two distinct events: typing (onChange) and committing (onCommit)
 *
 * The parent must keep inputValue and committedSearch as separate states so that
 * typing here never triggers the main product catalogue fetch.
 *
 * @param {Object}   props
 * @param {string}   props.value       - current typed value (controlled by parent)
 * @param {Function} props.onChange    - called with the new string on every keystroke
 * @param {Function} props.onCommit    - called with the committed string on form submit
 *                                       or suggestion selection; triggers the product fetch
 * @param {string}   [props.placeholder]
 */
export default function SearchBar({ value, onChange, onCommit, placeholder = 'Search products…' }) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const { suggestions } = useSearchSuggestions(value);

  const showDropdown = open && suggestions.length > 0;

  // ── Event handlers ──────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setHighlightedIndex(-1);
    setOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      // Prevent form submission — we handle the commit here from the suggestion
      e.preventDefault();
      selectSuggestion(suggestions[highlightedIndex]);
    }
  };

  const selectSuggestion = useCallback((name) => {
    onChange(name);
    setOpen(false);
    setHighlightedIndex(-1);
    onCommit(name);
  }, [onChange, onCommit]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    setHighlightedIndex(-1);
    onCommit(value);
  };

  // Close dropdown when the user clicks outside this component.
  // Using mousedown (fires before blur) lets us register the click on a
  // suggestion item before the input's blur event would hide the list.
  const handleBlur = () => {
    // Small delay so a suggestion mousedown event registers first
    setTimeout(() => setOpen(false), 150);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) setOpen(true);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleFormSubmit} className="relative flex flex-1 gap-2">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="off"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Suggestions dropdown */}
        {showDropdown && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {suggestions.map((name, idx) => (
              <li
                key={name}
                role="option"
                aria-selected={idx === highlightedIndex}
                // mousedown fires before blur so we can capture the click
                onMouseDown={() => selectSuggestion(name)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  idx === highlightedIndex
                    ? 'bg-green-50 text-green-800 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
