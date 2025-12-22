import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
    return (
        <div className="relative w-full max-w-lg mx-auto mb-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                    placeholder="Search name, ERA ID, phone..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
            <div className="flex gap-2 mt-2 px-1">
                <span className="text-xs text-gray-400 font-medium">Try "ERA-7"</span>
                <span className="text-xs text-gray-400 font-medium">or "Prakash"</span>
                <span className="text-xs text-gray-400 font-medium">or "O +ve"</span>
            </div>
        </div>
    );
}
