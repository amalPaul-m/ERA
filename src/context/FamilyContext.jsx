import React, { createContext, useContext, useState, useEffect } from 'react';
import initialFamiliesData from '../data/families.json';
import initialFeesData from '../data/fees.json';
import initialPaymentsData from '../data/payments.json';

const FamilyContext = createContext();

export const useFamilies = () => {
    const context = useContext(FamilyContext);
    if (!context) {
        throw new Error('useFamilies must be used within a FamilyProvider');
    }
    return context;
};

export const FamilyProvider = ({ children }) => {
    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fees, setFees] = useState([]);
    const [payments, setPayments] = useState([]);

    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Load data from localStorage or use initial JSON
        const loadData = () => {
            const storedData = localStorage.getItem('era_families_v1');
            if (storedData) {
                setFamilies(JSON.parse(storedData));
            } else {
                setFamilies(initialFamiliesData);
                localStorage.setItem('era_families_v1', JSON.stringify(initialFamiliesData));
            }

            // Load fees and payments
            const storedFees = localStorage.getItem('era_fees_v1');
            if (storedFees) {
                setFees(JSON.parse(storedFees));
            } else {
                setFees(initialFeesData);
                localStorage.setItem('era_fees_v1', JSON.stringify(initialFeesData));
            }

            const storedPayments = localStorage.getItem('era_payments_v1');
            if (storedPayments) {
                setPayments(JSON.parse(storedPayments));
            } else {
                setPayments(initialPaymentsData);
                localStorage.setItem('era_payments_v1', JSON.stringify(initialPaymentsData));
            }

            setLoading(false);
        };

        loadData();
    }, []);

    const addFamily = (newFamily) => {
        // Add validation or simple ID generation if needed, but assuming unique ERA ID is provided
        const updatedFamilies = [...families, newFamily];
        setFamilies(updatedFamilies);
        localStorage.setItem('era_families_v1', JSON.stringify(updatedFamilies));
    };

    const updateFamily = (id, updatedData) => {
        const updatedFamilies = families.map(fam =>
            fam.id === id ? { ...fam, ...updatedData } : fam
        );
        setFamilies(updatedFamilies);
        localStorage.setItem('era_families_v1', JSON.stringify(updatedFamilies));
    };

    const getFamily = (id) => {
        return families.find(f => f.id === id);
    };

    const deleteFamily = (id) => {
        const updatedFamilies = families.filter(fam => fam.id !== id);
        setFamilies(updatedFamilies);
        localStorage.setItem('era_families_v1', JSON.stringify(updatedFamilies));
    };

    const updateNotification = (text) => {
        setNotification(text);
        if (text) {
            localStorage.setItem('era_notification', text);
        } else {
            localStorage.removeItem('era_notification');
        }
    };

    // Fee Management
    const addFee = (newFee) => {
        const updatedFees = [...fees, { ...newFee, id: Date.now().toString() }];
        setFees(updatedFees);
        localStorage.setItem('era_fees_v1', JSON.stringify(updatedFees));
    };

    const deleteFee = (feeId) => {
        const updatedFees = fees.filter(f => f.id !== feeId);
        setFees(updatedFees);
        localStorage.setItem('era_fees_v1', JSON.stringify(updatedFees));
        // Also clean up payments for this fee
        const updatedPayments = payments.filter(p => p.feeId !== feeId);
        setPayments(updatedPayments);
        localStorage.setItem('era_payments_v1', JSON.stringify(updatedPayments));
    };

    // Payment Management
    const recordPayment = (familyId, feeId, amount) => {
        // Find existing payment or create new
        const existingIdx = payments.findIndex(p => p.familyId === familyId && p.feeId === feeId);
        let updatedPayments;
        if (existingIdx >= 0) {
            updatedPayments = [...payments];
            updatedPayments[existingIdx] = { ...updatedPayments[existingIdx], amount, date: new Date().toISOString() };
        } else {
            updatedPayments = [...payments, { familyId, feeId, amount, date: new Date().toISOString() }];
        }
        setPayments(updatedPayments);
        localStorage.setItem('era_payments_v1', JSON.stringify(updatedPayments));
    };

    const getFamilyFinances = (familyId) => {
        const familyPayments = payments.filter(p => p.familyId === familyId);

        // No priority sorting - just use defined fees order
        const detail = fees.map(fee => {
            // Find specific payment for this fee
            const paymentRecord = familyPayments.find(p => p.feeId === fee.id);
            const paidAmount = paymentRecord ? paymentRecord.amount : 0;

            return {
                ...fee,
                paid: paidAmount,
                balance: fee.amount - paidAmount,
                status: paidAmount >= fee.amount ? 'Paid' : (paidAmount > 0 ? 'Partial' : 'Pending')
            };
        });

        const totalPaid = familyPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);

        return {
            detail,
            totalPaid,
            totalAmount,
            totalBalance: totalAmount - totalPaid
        };
    };

    const searchFamilies = (query) => {
        if (!query) return families;
        const lowerQuery = query.toLowerCase();

        return families.filter(family => {
            const pm = family.primary_member;
            const address = family.address;
            const houseName = address?.house_name;

            // Primary Member Name
            const pmNameEn = pm?.name?.en?.toLowerCase() || '';
            const pmNameMl = pm?.name?.ml || '';
            const nameMatch = pmNameEn.includes(lowerQuery) || pmNameMl.includes(query);

            // ID Match
            const idMatch = family.id?.toLowerCase().includes(lowerQuery) || false;

            // Phone Match
            const phoneMatch = Array.isArray(pm?.phone) && pm.phone.some(p => p.includes(query));

            // Blood Group Match
            const bloodMatch = pm?.blood_group?.toLowerCase().includes(lowerQuery) || false;

            // House Name Match
            const houseEn = houseName?.en?.toLowerCase() || '';
            const houseMl = houseName?.ml || '';
            const houseMatch = houseEn.includes(lowerQuery) || houseMl.includes(query);

            // Family Members Match
            const membersMatch = Array.isArray(family.family_members) && family.family_members.some(member => {
                const mNameEn = member?.name?.en?.toLowerCase() || '';
                const mNameMl = member?.name?.ml || '';
                const mBloodMatch = member?.blood_group?.toLowerCase().includes(lowerQuery) || false;
                return mNameEn.includes(lowerQuery) || mNameMl.includes(query) || mBloodMatch;
            });

            return nameMatch || idMatch || phoneMatch || bloodMatch || houseMatch || membersMatch;
        });
    };

    const refreshData = () => {
        setLoading(true);
        const storedData = localStorage.getItem('era_families_v1');
        if (storedData) {
            setFamilies(JSON.parse(storedData));
        } else {
            setFamilies(initialFamiliesData);
        }

        const storedFees = localStorage.getItem('era_fees_v1');
        if (storedFees) {
            setFees(JSON.parse(storedFees));
        } else {
            setFees(initialFeesData);
        }

        const storedPayments = localStorage.getItem('era_payments_v1');
        if (storedPayments) {
            setPayments(JSON.parse(storedPayments));
        } else {
            setPayments(initialPaymentsData);
        }

        const storedNotif = localStorage.getItem('era_notification');
        if (storedNotif) {
            setNotification(storedNotif);
        } else {
            setNotification('');
        }

        setTimeout(() => setLoading(false), 500); // Slight delay for visual feedback
    };

    return (
        <FamilyContext.Provider value={{
            families,
            loading,
            notification,
            addFamily,
            updateFamily,
            getFamily,
            deleteFamily,
            updateNotification,
            searchFamilies,
            fees,
            payments,
            addFee,
            deleteFee,
            recordPayment,
            getFamilyFinances,
            refreshData
        }}>
            {children}
        </FamilyContext.Provider>
    );
};
