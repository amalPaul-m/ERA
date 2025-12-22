import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, Search, Shield, LogOut, User, RefreshCcw } from 'lucide-react';
import { useFamilies } from '../context/FamilyContext';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/logo.png';
import InstallPWA from '../components/InstallPWA';

export default function Layout() {
    const { user, logout } = useAuth();
    const { refreshData } = useFamilies();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 md:pb-0">
            {/* PWA Install Popup */}
            <InstallPWA />
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        {/* <span className="bg-blue-600 text-white p-1 rounded-md text-sm">ERA</span>
                        Residents */}
                        <img src={Logo} alt="ERA Logo" height="80" width="80" />
                    </Link>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link to={`/family/${user.familyId}`} className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1">
                                    <User size={18} />
                                    <span className="hidden sm:inline">{user.name}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Family Login
                            </Link>
                        )}
                        <Link to="/admin" className="text-gray-400 hover:text-blue-600 transition-colors" title="Admin Panel">
                            <Shield size={20} />
                        </Link>
                        <button
                            onClick={refreshData}
                            className="text-gray-500 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-6">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
                <div className="flex justify-around items-center p-3">
                    <Link to="/" className="flex flex-col items-center text-blue-600">
                        <Home size={24} />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <button className="flex flex-col items-center text-gray-400" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <Search size={24} />
                        <span className="text-xs mt-1">Search</span>
                    </button>
                </div>
            </nav>
        </div >
    );
}
