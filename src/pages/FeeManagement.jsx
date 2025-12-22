import React, { useState } from 'react';
import { useFamilies } from '../context/FamilyContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, IndianRupee, FileText, Download, Search } from 'lucide-react';

export default function FeeManagement() {
    const { families, fees, addFee, deleteFee, recordPayment, getFamilyFinances } = useFamilies();
    const navigate = useNavigate();
    const [showNewFee, setShowNewFee] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [activeTab, setActiveTab] = useState('fees'); // 'fees', 'payments', 'reports'
    const [reportSearch, setReportSearch] = useState('');
    const [paymentSearch, setPaymentSearch] = useState('');

    const [newFee, setNewFee] = useState({ title: '', amount: '', category: 'Membership' });

    const handleAddFee = (e) => {
        e.preventDefault();
        addFee({ ...newFee, amount: parseFloat(newFee.amount) });
        setNewFee({ title: '', amount: '', category: 'Membership' });
        setShowNewFee(false);
    };

    const handleRecordPayment = (familyId, feeId, amount) => {
        recordPayment(familyId, feeId, parseFloat(amount));
    };

    // Reports data
    const consolidatedReport = families
        .map(f => {
            const finances = getFamilyFinances(f.id);
            return {
                id: f.id,
                name: f.primary_member.name.en,
                totalPaid: finances.totalPaid,
                totalBalance: finances.totalBalance,
                detail: finances.detail
            };
        })
        .filter(r =>
            r.name.toLowerCase().includes(reportSearch.toLowerCase()) ||
            r.id.toLowerCase().includes(reportSearch.toLowerCase())
        );

    return (
        <div className="pb-10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/admin/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('fees')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'fees' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Fees
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Mark Payments
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Reports
                    </button>
                </div>
            </div>

            {/* Fees Tab */}
            {activeTab === 'fees' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Defined Fees</h2>
                        <button
                            onClick={() => setShowNewFee(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={18} /> New Fee
                        </button>
                    </div>

                    {showNewFee && (
                        <form onSubmit={handleAddFee} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900">Create New Fee</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <input
                                    required
                                    type="text"
                                    placeholder="Fee Title (e.g. Yearly 2025)"
                                    className="p-2 border rounded-lg"
                                    value={newFee.title}
                                    onChange={e => setNewFee({ ...newFee, title: e.target.value })}
                                />
                                <input
                                    required
                                    type="number"
                                    placeholder="Amount"
                                    className="p-2 border rounded-lg"
                                    value={newFee.amount}
                                    onChange={e => setNewFee({ ...newFee, amount: e.target.value })}
                                />
                                <select
                                    className="p-2 border rounded-lg"
                                    value={newFee.category}
                                    onChange={e => setNewFee({ ...newFee, category: e.target.value })}
                                >
                                    <option>Membership</option>
                                    <option>Celebration</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowNewFee(false)} className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Fee</button>
                            </div>
                        </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fees.map(fee => (
                            <div key={fee.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{fee.category}</span>
                                    <button onClick={() => deleteFee(fee.id)} className="text-gray-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">{fee.title}</h3>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                                        <IndianRupee size={20} className="text-gray-400" />
                                        {fee.amount}
                                    </div>
                                    <button
                                        onClick={() => { setSelectedFee(fee); setActiveTab('payments'); }}
                                        className="text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                        Mark Payments
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Record Payments</h2>
                            <p className="text-sm text-gray-500">Select a fee and enter paid amounts for families.</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search family..."
                                    className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                                    value={paymentSearch}
                                    onChange={(e) => setPaymentSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className="p-2 border rounded-lg bg-white min-w-[200px]"
                                value={selectedFee?.id || ''}
                                onChange={e => setSelectedFee(fees.find(f => f.id === e.target.value))}
                            >
                                <option value="">Select a Fee...</option>
                                {fees.map(f => <option key={f.id} value={f.id}>{f.title} (₹{f.amount})</option>)}
                            </select>
                        </div>
                    </div>

                    {selectedFee ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {families
                                        .filter(f =>
                                            f.primary_member.name.en.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                                            f.id.toLowerCase().includes(paymentSearch.toLowerCase())
                                        )
                                        .map(family => {
                                            const finances = getFamilyFinances(family.id);
                                            const feeStatus = finances.detail.find(d => d.id === selectedFee.id);
                                            return (
                                                <tr key={family.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{family.primary_member.name.en}</div>
                                                        <div className="text-xs text-gray-500">{family.id}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${feeStatus?.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                            feeStatus?.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {feeStatus?.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <input
                                                            type="number"
                                                            className="w-24 p-1 border rounded text-right"
                                                            defaultValue={feeStatus?.paid || ''}
                                                            onBlur={(e) => handleRecordPayment(family.id, selectedFee.id, e.target.value)}
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <IndianRupee size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Please select a fee to start recording payments</p>
                        </div>
                    )}
                </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Consolidated Financial Report</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search family..."
                                    className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                                    value={reportSearch}
                                    onChange={(e) => setReportSearch(e.target.value)}
                                />
                            </div>
                            <button className="flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                                <Download size={18} /> Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Expected</p>
                            <p className="text-3xl font-bold text-gray-900">₹{consolidatedReport.reduce((sum, r) => sum + (r.totalPaid + r.totalBalance), 0)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-green-500">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Collected</p>
                            <p className="text-3xl font-bold text-green-600">₹{consolidatedReport.reduce((sum, r) => sum + r.totalPaid, 0)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-red-500">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Outstanding</p>
                            <p className="text-3xl font-bold text-red-600">₹{consolidatedReport.reduce((sum, r) => sum + r.totalBalance, 0)}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
                                        {fees.map(f => (
                                            <th key={f.id} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{f.title}</th>
                                        ))}
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">Total Paid</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-red-600 uppercase tracking-wider">Pending</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {consolidatedReport.map(report => (
                                        <tr key={report.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{report.name}</div>
                                                <div className="text-xs text-gray-500">{report.id}</div>
                                            </td>
                                            {fees.map(f => {
                                                const feeData = report.detail.find(d => d.id === f.id);
                                                return (
                                                    <td key={f.id} className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                        <span className={feeData?.paid > 0 ? 'text-green-600 font-bold' : 'text-gray-300'}>
                                                            {feeData?.paid > 0 ? `₹${feeData.paid}` : '-'}
                                                        </span>
                                                        {feeData?.balance > 0 && (
                                                            <div className="text-[10px] text-red-400 italic">(-₹{feeData.balance})</div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                                ₹{report.totalPaid}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-red-600">
                                                ₹{report.totalBalance}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
