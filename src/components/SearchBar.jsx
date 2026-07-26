// Note: AI was used for knowledge purposes only and treated as per knowledge.
import { useState, useEffect, useCallback, useRef } from 'react';
import { searchLocations } from '../services/weatherApi';
import { debounce } from '../utils/helpers';

export default function SearchBar({ onLocationSelect, onUseMyLocation, isLoading }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (q) => {
      if (q.trim().length < 2) {
        setResults([]);
        setShowDropdown(false);
        setSearching(false);
        return;
      }
      try {
        setSearching(true);
        setSearchError('');
        const locations = await searchLocations(q);
        setResults(locations);
        setShowDropdown(true);
        setHighlightIndex(-1);
        if (locations.length === 0) {
          setSearchError(`No results found for "${q}"`);
        }
      } catch (err) {
        setSearchError('Search failed. Please try again.');
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350),
    []
  );

  function handleInputChange(e) {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }

  function handleSelect(location) {
    setQuery(location.name);
    setShowDropdown(false);
    setResults([]);
    onLocationSelect(location);
  }

  function handleKeyDown(e) {
    if (!showDropdown || results.length === 0) {
      if (e.key === 'Enter' && query.trim().length >= 2) {
        debouncedSearch.cancel?.();
        debouncedSearch(query);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (results.length > 0 && highlightIndex >= 0) {
      handleSelect(results[highlightIndex]);
    } else if (results.length > 0) {
      handleSelect(results[0]);
    }
  }

  return (
    <div className="search-bar" ref={wrapperRef}>
      <form className="search-bar__form" onSubmit={handleFormSubmit}>
        <div className="search-bar__input-wrapper">
          <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            className="search-bar__input"
            placeholder="Search city, zip code, landmark..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            autoComplete="off"
            aria-label="Search for a location"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          {searching && <div className="search-bar__spinner" aria-label="Searching" />}
        </div>
        <button
          type="button"
          className="search-bar__location-btn"
          onClick={onUseMyLocation}
          disabled={isLoading}
          title="Use my current location"
          aria-label="Use my current location"
          id="use-location-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
          <span className="search-bar__location-text">My Location</span>
        </button>
      </form>

      {showDropdown && (
        <ul className="search-bar__dropdown" id="search-results" role="listbox">
          {searchError && results.length === 0 ? (
            <li className="search-bar__dropdown-empty">{searchError}</li>
          ) : (
            results.map((loc, idx) => (
              <li
                key={loc.id}
                className={`search-bar__dropdown-item ${idx === highlightIndex ? 'search-bar__dropdown-item--highlighted' : ''}`}
                onClick={() => handleSelect(loc)}
                onMouseEnter={() => setHighlightIndex(idx)}
                role="option"
                aria-selected={idx === highlightIndex}
              >
                <svg className="search-bar__dropdown-pin" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div className="search-bar__dropdown-info">
                  <span className="search-bar__dropdown-name">{loc.name}</span>
                  <span className="search-bar__dropdown-detail">
                    {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                  </span>
                </div>
                {loc.countryCode && (
                  <span className="search-bar__dropdown-code">{loc.countryCode}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
