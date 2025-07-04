import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FiX } from 'react-icons/fi';

import { searchPath } from '../../utils/routes';

export default function SearchBar() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(searchPath(searchValue.trim()));
      setSearchValue('');
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  return (
    <div className="w-full">
      <div className="relative rounded-lg sm:rounded-md">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3 flex items-center pointer-events-none">
          <AiOutlineSearch className="h-4 w-4 sm:h-5 sm:w-5 text-theme-text/60 dark:text-theme-text-dark/60" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="block w-full pl-9 sm:pl-10 pr-20 sm:pr-4 py-2.5 sm:py-2 text-sm sm:text-sm border border-theme-border/50 dark:border-theme-border-dark/50 rounded-lg sm:rounded-md bg-white dark:bg-secondary-dark text-theme-text dark:text-theme-text-dark placeholder:text-theme-text/50 placeholder:dark:text-theme-text-dark/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-dark/20 focus:border-primary dark:focus:border-primary-dark shadow-sm transition-all duration-200"
          placeholder="Search resources, tools, guides..."
          onKeyUp={handleKeyUp}
        />
        {/* Mobile buttons container */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:hidden">
          {searchValue && (
            <button
              onClick={clearSearch}
              className="text-theme-text/40 dark:text-theme-text-dark/40 hover:text-theme-text dark:hover:text-theme-text-dark transition-colors mr-2"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={!searchValue.trim()}
            className="bg-primary dark:bg-primary-dark text-white rounded-md px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-all duration-200"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
