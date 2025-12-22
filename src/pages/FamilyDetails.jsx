import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFamilies } from '../context/FamilyContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Phone, MapPin, Users, Droplets, Edit3, IndianRupee, PieChart } from 'lucide-react';

export default function FamilyDetails() {
    const { id } = useParams();
    const { getFamily, loading, getFamilyFinances } = useFamilies();
    const { user } = useAuth();
    const navigate = useNavigate();

    const family = getFamily(id);
    const isOwnFamily = user && user.familyId === id;
    const finances = getFamilyFinances(id);

    useEffect(() => {
        if (!loading && !family) {
            navigate('/');
        }
    }, [loading, family, navigate]);

    if (loading || !family) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    const { primary_member, address, family_members } = family;

    return (
        <div
            className="pb-10 animate-fade-in"
        >
            {/* Header */}
            <div className="flex items-center mb-6">
                <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <span className="ml-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Family Profile
                </span>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Cover / Primary Info */}
                <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white p-6 sm:p-8">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">{primary_member.name.en}</h1>
                                    <p className="text-blue-100 text-lg font-ml opacity-90">{primary_member.name.ml}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-mono text-sm font-bold border border-white/10">
                                        {family.id}
                                    </span>
                                    {isOwnFamily && (
                                        <Link
                                            to={`/admin/family/edit/${id}`}
                                            className="flex items-center gap-2 bg-white text-blue-600 px-3 py-1.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm"
                                        >
                                            <Edit3 size={16} />
                                            <span>Edit Details</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <a href={`tel:${primary_member.phone[0]}`} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium">
                            <Phone size={18} />
                            {primary_member.phone[0]}
                        </a>
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm">
                            <Droplets size={18} className="text-red-200" />
                            <span>{primary_member.blood_group}</span>
                        </div>
                        {address.google_maps_url && (
                            <a
                                href={address.google_maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm transition-colors"
                            >
                                <MapPin size={18} />
                                <span>Open in Maps</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">

                    {/* Left Column: Address & Members */}
                    <div className="p-6 sm:p-8 space-y-8">

                        {/* Address */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <MapPin size={16} /> Location
                            </h3>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <p className="font-bold text-gray-900 text-lg">{address.house_name.en}</p>
                                <p className="text-gray-600 font-ml mb-2">{address.house_name.ml}</p>
                                <p className="text-gray-500 text-sm">{address.location.en}</p>
                                <p className="text-gray-500 text-sm font-ml">{address.location.ml}</p>
                            </div>
                        </section>

                        {/* Family Members */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Users size={16} /> Family Members
                            </h3>
                            <div className="space-y-3">
                                {family_members && family_members.length > 0 ? (
                                    family_members.map((member, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                            <div>
                                                <p className="font-semibold text-gray-800">{member.name.en}</p>
                                                <p className="text-xs text-gray-500 font-ml">{member.name.ml}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-0.5 rounded-full block mb-1">
                                                    {member.blood_group}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {member.age} yrs
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm italic">No details added.</p>
                                )}
                            </div>
                        </section>
                        {/* Financial Summary - Only for logged in family */}
                        {isOwnFamily && (
                            <section className="animate-slide-up">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <IndianRupee size={16} /> Financial Summary
                                </h3>
                                <div className="bg-white border-2 border-blue-50 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="bg-blue-50/50 p-4 border-b border-blue-50">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Total Balance Pending</p>
                                                <p className="text-3xl font-black text-blue-900">₹{finances.totalBalance}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                                <p className="text-xl font-bold text-green-600">₹{finances.totalPaid}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-gray-50">
                                        {finances.detail.map((fee, idx) => (
                                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-xl ${fee.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-400'}`}>
                                                        <PieChart size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm">{fee.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{fee.category}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-black ${fee.balance === 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                        {fee.balance === 0 ? 'PAID' : `₹${fee.balance} Pending`}
                                                    </p>
                                                    {fee.paid > 0 && fee.balance > 0 && (
                                                        <p className="text-[10px] text-gray-400">₹{fee.paid} paid of ₹{fee.amount}</p>
                                                    )}
                                                    {fee.paid === 0 && (
                                                        <p className="text-[10px] text-gray-400">Total ₹{fee.amount}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {finances.detail.length === 0 && (
                                            <div className="p-8 text-center text-gray-400 italic text-sm">
                                                No fees mapped to your account yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Map */}
                    <div className="min-h-[300px] bg-gray-50 relative">
                        <iframe
                            title="Location Map"
                            width="100%"
                            height="100%"
                            className="absolute inset-0 w-full h-full border-0"
                            src={`https://maps.google.com/maps?q=${address.geo.lat},${address.geo.lng}&z=17&output=embed`}
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>

                </div>
            </div>
        </div>
    );
}
