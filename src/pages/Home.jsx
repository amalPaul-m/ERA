import React, { useState, useEffect } from 'react';
import { useFamilies } from '../context/FamilyContext';
import SearchBar from '../components/SearchBar';
import FamilyCard from '../components/FamilyCard';
import { RefreshCcw } from 'lucide-react';

export default function Home() {
    const { searchFamilies, loading, notification, refreshData } = useFamilies();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        setResults(searchFamilies(query));
    }, [query, searchFamilies]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            {notification && (
                <div className="w-full bg-yellow-100 text-yellow-800 border-b border-yellow-200 py-3 overflow-hidden whitespace-nowrap mb-6">
                    <div className="animate-marquee inline-block font-semibold">
                        {notification}
                    </div>
                </div>
            )}
            <div className="text-center mb-8 pt-4">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Find Your Neighbors
                </h1>
                <p className="text-gray-500">
                    Search by name, ERA number, phone, or blood group
                </p>
            </div>

            <SearchBar value={query} onChange={setQuery} />

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {query ? `Found ${results.length} families` : 'All Families'}
                    </h2>
                    <button
                        onClick={refreshData}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCcw size={18} />
                    </button>
                </div>

                {results.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No families found matching matches "{query}"</p>
                        <button
                            onClick={() => setQuery('')}
                            className="mt-2 text-blue-600 font-medium hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {results.map((family, index) => (
                            <FamilyCard key={family.id} family={family} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
