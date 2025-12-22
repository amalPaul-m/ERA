import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFamilies } from '../context/FamilyContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, Trash, Plus } from 'lucide-react';

export default function FamilyForm() {
    const { id } = useParams(); // If ID exists, we are editing
    const { getFamily, addFamily, updateFamily } = useFamilies();
    const { user } = useAuth();
    const navigate = useNavigate();
    const isEditing = !!id;
    const isAdmin = user && user.role === 'admin'; // Assuming admin role logic if any

    // For simplicity, if not admin, check if user is editing their own family
    const canEdit = isAdmin || (user && user.familyId === id);

    const initialFormState = {
        id: `ERA-${Math.floor(Math.random() * 1000)}`, // Auto-generate ID logic for new
        primary_member: {
            name: { ml: '', en: '' },
            age: '',
            blood_group: '',
            phone: ['']
        },
        address: {
            house_name: { ml: '', en: '' },
            location: { ml: '', en: '' },
            geo: { lat: '', lng: '' }
        },
        family_members: []
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isEditing) {
            const family = getFamily(id);
            if (family) {
                // Security check: if not admin and not their own family, redirect
                if (user && user.role !== 'admin' && user.familyId !== id) {
                    navigate('/');
                    return;
                }
                setFormData(family);
            } else {
                alert('Family not found');
                navigate(user?.role === 'admin' ? '/admin/dashboard' : '/');
            }
        }
    }, [id, isEditing, getFamily, navigate, user]);

    const handleChange = (section, field, value, subField = null) => {
        setFormData(prev => {
            if (section === 'root') {
                return { ...prev, [field]: value };
            }
            if (subField) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: {
                            ...prev[section][field],
                            [subField]: value
                        }
                    }
                };
            }
            // Arrays or simple fields in nested obj
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            };
        });
    };

    const handleMemberChange = (index, field, value, subField = null) => {
        const updatedMembers = [...formData.family_members];
        if (subField) {
            updatedMembers[index][field][subField] = value;
        } else {
            updatedMembers[index][field] = value;
        }
        setFormData(prev => ({ ...prev, family_members: updatedMembers }));
    };

    const addMember = () => {
        setFormData(prev => ({
            ...prev,
            family_members: [...prev.family_members, { name: { ml: '', en: '' }, age: '', blood_group: '' }]
        }));
    };

    const removeMember = (index) => {
        const updatedMembers = formData.family_members.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, family_members: updatedMembers }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateFamily(formData.id, formData);
        } else {
            addFamily(formData);
        }

        if (user && user.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate(`/family/${formData.id}`);
        }
    };

    return (
        <div className="pb-20">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <span className="ml-2 text-lg font-bold text-gray-900">
                    {isEditing ? `Edit Family ${id}` : 'Add New Family'}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Info */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Primary Info</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {!isEditing && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">ERA ID</label>
                                <input type="text" required value={formData.id} onChange={(e) => handleChange('root', 'id', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name (English)</label>
                            <input type="text" required value={formData.primary_member.name.en} onChange={(e) => handleChange('primary_member', 'name', e.target.value, 'en')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name (Malayalam)</label>
                            <input type="text" value={formData.primary_member.name.ml} onChange={(e) => handleChange('primary_member', 'name', e.target.value, 'ml')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="text" required value={formData.primary_member.phone[0]} onChange={(e) => {
                                const newPhones = [...formData.primary_member.phone];
                                newPhones[0] = e.target.value;
                                handleChange('primary_member', 'phone', newPhones);
                            }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                            <input type="text" value={formData.primary_member.blood_group} onChange={(e) => handleChange('primary_member', 'blood_group', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Address & Location</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">House Name (En)</label>
                            <input type="text" value={formData.address.house_name.en} onChange={(e) => handleChange('address', 'house_name', e.target.value, 'en')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">House Name (Ml)</label>
                            <input type="text" value={formData.address.house_name.ml} onChange={(e) => handleChange('address', 'house_name', e.target.value, 'ml')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location (En)</label>
                            <input type="text" value={formData.address.location.en} onChange={(e) => handleChange('address', 'location', e.target.value, 'en')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lat</label>
                                <input type="text" value={formData.address.geo.lat} onChange={(e) => handleChange('address', 'geo', e.target.value, 'lat')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lng</label>
                                <input type="text" value={formData.address.geo.lng} onChange={(e) => handleChange('address', 'geo', e.target.value, 'lng')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Google Maps Link (Optional)</label>
                            <input type="text" value={formData.address.google_maps_url || ''} onChange={(e) => handleChange('address', 'google_maps_url', e.target.value)} placeholder="https://maps.google.com/..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                    </div>
                </div>

                {/* Family Members */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase">Family Members</h3>
                        <button type="button" onClick={addMember} className="text-sm text-blue-600 flex items-center gap-1 font-medium"><Plus size={16} /> Add Member</button>
                    </div>

                    <div className="space-y-4">
                        {formData.family_members.map((member, idx) => (
                            <div key={idx} className="flex gap-2 items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-grow">
                                    <input placeholder="Name (En)" value={member.name.en} onChange={(e) => handleMemberChange(idx, 'name', e.target.value, 'en')} className="border border-gray-300 rounded-md p-2 text-sm" />
                                    <input placeholder="Name (Ml)" value={member.name.ml} onChange={(e) => handleMemberChange(idx, 'name', e.target.value, 'ml')} className="border border-gray-300 rounded-md p-2 text-sm" />
                                    <input placeholder="Age" value={member.age} onChange={(e) => handleMemberChange(idx, 'age', e.target.value)} className="border border-gray-300 rounded-md p-2 text-sm w-20" />
                                    <input placeholder="Blood Group" value={member.blood_group} onChange={(e) => handleMemberChange(idx, 'blood_group', e.target.value)} className="border border-gray-300 rounded-md p-2 text-sm" />
                                </div>
                                <button type="button" onClick={() => removeMember(idx)} className="text-red-500 p-2"><Trash size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Save size={18} className="mr-2" />
                    Save Family Details
                </button>

            </form>
        </div>
    );
}
