import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Users } from 'lucide-react';

export default function FamilyCard({ family }) {
    const { id, primary_member, address, family_members } = family;

    return (
        <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
            <Link to={`/family/${id}`} className="block p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {primary_member.name.en}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium mt-0.5 font-ml">
                            {primary_member.name.ml}
                        </p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                        {id}
                    </span>
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-start text-gray-600 text-sm">
                        <MapPin size={16} className="mt-0.5 mr-2 flex-shrink-0 text-blue-400" />
                        <span className="line-clamp-1">{address.house_name.en}, {address.location.en}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                        <Phone size={16} className="mr-2 flex-shrink-0 text-blue-400" />
                        <span>{primary_member.phone[0]}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-xs mt-4 pt-3 border-t border-gray-50">
                        <Users size={14} className="mr-1.5" />
                        <span>{1 + (family_members?.length || 0)} Members</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="font-medium text-red-500 bg-red-50 px-1.5 rounded">{primary_member.blood_group}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
