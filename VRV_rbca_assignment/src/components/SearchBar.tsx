import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { spellTypes } from '@/utils/types';

interface Filter {
  id: string;
  label: string;
  options: string[];
}

interface Spell {
    id: string;
    name: string;
    date_of_creation: string;
    created_by: string;
    type: string;
    description: string;
    steps: string[];
    difficulty_level: string;
  }

type ActiveFilters = {
    count: number;
    filters: Record<string, string[]>; // Changed to store arrays of values
}

interface SearchBarProps {
    spells: Spell[]; // Pass all spells as prop
    onFilteredSpellsChange: (spells: Spell[]) => void;
}

const SearchBar = ({ spells, onFilteredSpellsChange }: SearchBarProps) => {
  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    count: 0,
    filters: {
      type: [],
      difficulty: []
    }
  });

  const searchFields = [
    { value: 'name', label: 'Name' },
    { value: 'created_by', label: 'Created By' },
    { value: 'date_of_creation', label: 'Date of Creation' }
  ];

  const filters: Filter[] = [
    {
      id: 'type',
      label: 'Type',
      options: Object.entries(spellTypes).map(([key, value]) => `${key} ${value}`)
    },
    {
      id: 'difficulty', 
      label: 'Difficulty',
      options: ['Easy', 'Medium', 'Hard', 'Very Hard']
    }
  ];

  const filterSpells = () => {
    return spells.filter(spell => {
      // Search field filtering
      const searchTermMatch = searchValue.toLowerCase().trim() === '' || 
        spell[searchField as keyof Spell]?.toString().toLowerCase().includes(searchValue.toLowerCase());

      // Filter type filtering
      const typeFilters = activeFilters.filters.type;
      const typeMatch = typeFilters.length === 0 || 
        typeFilters.some(filter => `${spell.type} ${spellTypes[spell.type]}` === filter);

      // Difficulty filtering
      const difficultyFilters = activeFilters.filters.difficulty;
      const difficultyMatch = difficultyFilters.length === 0 || 
        difficultyFilters.includes(spell.difficulty_level);

      return searchTermMatch && typeMatch && difficultyMatch;
    });
  };

  const handleFilterChange = (filterId: string, value: string) => {
    if (!value) return; // Skip empty selections

    setActiveFilters(prev => {
      const currentFilters = prev.filters[filterId] || [];
      const newFilters = {
        ...prev.filters,
        [filterId]: [...currentFilters, value]
      };

      // Calculate total count of all filters
      const totalCount = Object.values(newFilters)
        .reduce((sum, arr) => sum + arr.length, 0);

      return {
        count: totalCount,
        filters: newFilters
      };
    });
  };

  const removeFilter = (filterId: string, value: string) => {
    setActiveFilters(prev => {
      const currentFilters = prev.filters[filterId] || [];
      const newFilters = {
        ...prev.filters,
        [filterId]: currentFilters.filter(v => v !== value)
      };

      // Calculate total count of all filters
      const totalCount = Object.values(newFilters)
        .reduce((sum, arr) => sum + arr.length, 0);

      return {
        count: totalCount,
        filters: newFilters
      };
    });
  };

  useEffect(() => {
    const filteredSpells = filterSpells();
    onFilteredSpellsChange(filteredSpells);
  }, [searchField, searchValue, activeFilters]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-2">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border-r border-gray-300 pr-2 outline-none bg-transparent text-center p-1"
          >
            {searchFields.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          <Search size={20} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="flex-1 outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          {filters.map(filter => (
            <div key={filter.id} className='flex flex-col relative'>
              <span className='text-gray-600 text-xs font-semibold ml-2 absolute top-[-15px]'>{filter.id}</span>
              <select
                value="" // Always reset to empty after selection
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg outline-none hover:bg-gray-50 min-w-32"
              >
                <option value="">Add {filter.label}</option>
                {filter.options.filter(option => 
                  !(activeFilters.filters[filter.id] || []).includes(option)
                ).map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.count > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-600">Active filters:</span>
          {Object.entries(activeFilters.filters).map(([filterId, values]) => (
            values.map(value => (
              <div
                key={`${filterId}-${value}`}
                className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm flex items-center gap-2"
              >
                <span>{filters.find(f => f.id === filterId)?.label}: {value}</span>
                <button 
                  onClick={() => removeFilter(filterId, value)}
                  className="hover:bg-indigo-100 rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;