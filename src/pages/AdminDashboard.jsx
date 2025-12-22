import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFamilies } from '../context/FamilyContext';
import { Plus, Edit2, Trash2, LogOut, IndianRupee, RefreshCcw } from 'lucide-react';

export default function AdminDashboard() {
    const { families, deleteFamily, updateNotification, notification, refreshData } = useFamilies();
    const navigate = useNavigate();
    const [notifText, setNotifText] = React.useState('');

    useEffect(() => {
        const isAuth = localStorage.getItem('era_admin_auth');
        if (!isAuth) {
            navigate('/admin');
        }
    }, [navigate]);

    useEffect(() => {
        setNotifText(notification || '');
    }, [notification]);

    const handleUpdateNotification = () => {
        updateNotification(notifText);
        alert('Notification updated!');
    };

    const handleClearNotification = () => {
        setNotifText('');
        updateNotification('');
        alert('Notification cleared!');
    };

    const handleLogout = () => {
        localStorage.removeItem('era_admin_auth');
        navigate('/admin');
    };

    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete family ${id}?`)) {
            deleteFamily(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex gap-3">
                    <Link
                        to="/admin/fees"
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        <IndianRupee size={18} /> Fees Mapping
                    </Link>
                    <Link
                        to="/admin/family/new"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={18} /> New Family
                    </Link>
                    <button
                        onClick={refreshData}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                        title="Refresh Data"
                    >
                        <RefreshCcw size={18} /> Refresh
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>



            {/* Notification Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Notification Management</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={notifText}
                        onChange={(e) => setNotifText(e.target.value)}
                        placeholder="Enter notification text here..."
                        className="flex-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                        onClick={handleUpdateNotification}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Update
                    </button>
                    <button
                        onClick={handleClearNotification}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {families.map((family) => (
                                <tr key={family.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {family.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="font-medium text-gray-900">{family.primary_member.name.en}</div>
                                        <div className="text-xs">{family.primary_member.phone[0]}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {family.address.house_name.en}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            <Link to={`/admin/family/edit/${family.id}`} className="text-blue-600 hover:text-blue-900">
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(family.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
