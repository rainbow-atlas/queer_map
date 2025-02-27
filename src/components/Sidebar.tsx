import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Globe, Search, X, Filter, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.svg';

interface Location {
  id: number;
  name: string;
  position: [number, number];
  description?: string;
  website: string;
  tags?: string[];
  image: string;
}

interface LocationData {
  [category: string]: Location[];
}

interface SidebarProps {
  locationData: LocationData;
  onLocationSelect: (location: [number, number]) => void;
  isCollapsed: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

interface VisibilitySettings {
  descriptions: boolean;
  tags: boolean;
}

// Function to generate pastel colors based on index and total count
const getPastelColor = (index: number, total: number) => {
  // Calculate hue based on position in the rainbow (0 to 360 degrees)
  const hue = (index / total) * 360;
  // Use very high lightness and low saturation for ultra-subtle pastel effect
  return `hsl(${hue}, 35%, 97%)`;
};

// Function to create hover color
const getHoverColor = (baseColor: string) => {
  const hue = baseColor.match(/\d+/)?.[0];
  return `hsl(${hue}, 40%, 95%)`;
};

const Sidebar: React.FC<SidebarProps> = ({ 
  locationData, 
  onLocationSelect,
  isCollapsed,
  searchTerm,
  onSearchChange,
  allTags,
  selectedTags,
  onTagsChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibility, setVisibility] = useState<VisibilitySettings>({
    descriptions: true,
    tags: true
  });
  const filterRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Generate colors for categories
  const categoryColors = useMemo(() => {
    const categories = Object.keys(locationData);
    return categories.reduce((acc, category, index) => {
      acc[category] = getPastelColor(index, categories.length);
      return acc;
    }, {} as Record<string, string>);
  }, [locationData]);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current && 
        !filterRef.current.contains(event.target as Node) &&
        !filterButtonRef.current?.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedCategory && !locationData[selectedCategory]) {
      setSelectedCategory('');
    }
  }, [locationData, selectedCategory]);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleVisibilityChange = (setting: keyof VisibilitySettings) => {
    setVisibility(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // If sidebar is collapsed and not in mobile view, render nothing but maintain hooks
  if (isCollapsed && !isMobileView) {
    return <div className="hidden" />;
  }

  const categories = Object.keys(locationData);
  const hasLocations = categories.length > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header Section */}
      <div className={`flex-none px-4 pt-4 ${isMobileView ? 'pb-4' : ''}`}>
        {/* Category Selector */}
        <div className="mb-4">
          <div className="relative">
            <select 
              className="w-full pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 bg-white/50 backdrop-blur appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Search Bar with Filter Button */}
        <div className="mb-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200 bg-white/50 backdrop-blur"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              ref={filterButtonRef}
              onClick={toggleFilter}
              className={`
                p-2 rounded-lg border transition-all relative
                ${isFilterOpen || selectedTags.length > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                  : 'bg-white/50 backdrop-blur border-gray-200 text-gray-600 hover:bg-gray-50'
                }
                ${isFilterOpen ? 'ring-2 ring-blue-200' : ''}
              `}
              aria-pressed={isFilterOpen}
              aria-expanded={isFilterOpen}
              aria-label="Toggle filters"
            >
              <Filter className="w-4 h-4" />
              {selectedTags.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">
                  {selectedTags.length}
                </span>
              )}
            </button>

            {/* Filter Popup */}
            {isFilterOpen && (
              <div 
                ref={filterRef}
                className={`
                  absolute bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50
                  ${isMobileView 
                    ? 'fixed inset-x-4 top-24'
                    : 'left-1/2 -translate-x-1/2 top-12 w-[308px]'
                  }
                `}
              >
                {/* Visibility Settings */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Display Settings</h3>
                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        Show descriptions
                      </span>
                      <div className="relative">
                        <button
                          role="switch"
                          aria-checked={visibility.descriptions}
                          onClick={() => handleVisibilityChange('descriptions')}
                          className={`
                            relative inline-flex h-5 w-8 items-center rounded-full
                            transition-colors duration-200 ease-in-out focus:outline-none
                            focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-50
                            ${visibility.descriptions 
                              ? 'bg-blue-400' 
                              : 'bg-gray-200'
                            }
                          `}
                        >
                          <span
                            className={`
                              inline-block h-3.5 w-3.5 transform rounded-full bg-white
                              transition-transform duration-200 ease-in-out
                              ${visibility.descriptions 
                                ? 'translate-x-4' 
                                : 'translate-x-0.5'
                              }
                            `}
                          />
                        </button>
                      </div>
                    </label>
                    <label className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        Show tags
                      </span>
                      <div className="relative">
                        <button
                          role="switch"
                          aria-checked={visibility.tags}
                          onClick={() => handleVisibilityChange('tags')}
                          className={`
                            relative inline-flex h-5 w-8 items-center rounded-full
                            transition-colors duration-200 ease-in-out focus:outline-none
                            focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-50
                            ${visibility.tags 
                              ? 'bg-blue-400' 
                              : 'bg-gray-200'
                            }
                          `}
                        >
                          <span
                            className={`
                              inline-block h-3.5 w-3.5 transform rounded-full bg-white
                              transition-transform duration-200 ease-in-out
                              ${visibility.tags 
                                ? 'translate-x-4' 
                                : 'translate-x-0.5'
                              }
                            `}
                          />
                        </button>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="h-px bg-gray-200 -mx-3 mb-3" />

                {/* Tags Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Filter by Tags</h3>
                    <button
                      onClick={() => onTagsChange([])}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`
                          px-1.5 py-0.5 text-xs rounded transition-colors
                          ${selectedTags.includes(tag)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className={`
        flex-1 overflow-y-auto min-h-0 px-4 
        ${isMobileView ? 'pb-20' : 'pb-4'}
      `}>
        {!hasLocations ? (
          <div className="text-center text-gray-500 mt-4">
            <p>No locations found</p>
            {(searchTerm || selectedTags.length > 0) && (
              <button
                onClick={() => {
                  onSearchChange('');
                  onTagsChange([]);
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {(selectedCategory ? [selectedCategory] : categories).map((category: string) => (
              locationData[category]?.map((location) => (
                <div 
                  key={location.id} 
                  onClick={() => onLocationSelect(location.position)}
                  className={`
                    p-3 rounded-lg border border-gray-100 transition-all duration-200 cursor-pointer
                    ${isMobileView ? 'active:bg-gray-50' : 'hover:bg-gray-50'}
                  `}
                  style={{
                    background: categoryColors[category],
                    '--hover-bg': getHoverColor(categoryColors[category])
                  } as React.CSSProperties}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200">
                      <img 
                        src={location.image} 
                        alt={location.name}
                        className="w-full h-full object-contain p-0.5"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.parentElement!.style.backgroundColor = '#f3f4f6';
                          img.src = logo;
                          img.onerror = null; // Prevent infinite error loop
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{location.name}</h4>
                      {visibility.descriptions && location.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{location.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-3">
                    {visibility.tags && location.tags && location.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {location.tags.map(tag => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagToggle(tag);
                            }}
                            className={`
                              px-1.5 py-0.5 text-xs rounded transition-colors
                              ${selectedTags.includes(tag)
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-white/80 text-gray-600 hover:bg-white'
                              }
                            `}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLocationSelect(location.position);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-gray-700 rounded-md hover:bg-white transition-colors"
                      >
                        <MapPin className="w-3 h-3" />
                        View on map
                      </button>
                      <a
                        href={location.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-gray-700 rounded-md hover:bg-white transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        Website
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

export { Sidebar };