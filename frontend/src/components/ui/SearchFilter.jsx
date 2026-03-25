import { Filter, ChevronDown } from 'lucide-react';

const SearchFilter = ({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    filters = [],
    activeFilter,
    onFilterChange,
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 group">
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="input-premium pl-4 py-3"
                />
            </div>

            {filters.length > 0 && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => onFilterChange(f.value)}
                            className={`px-3.5 py-2 rounded-lg text-[11px] font-bold tracking-wide transition-all whitespace-nowrap ${activeFilter === f.value
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchFilter;
