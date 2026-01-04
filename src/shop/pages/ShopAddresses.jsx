import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shopApi } from '../services/api';
import CustomModal from '../../components/common/CustomModal';
import { FiMapPin, FiPlus, FiPhone, FiUser, FiTrash2, FiEdit2, FiCheck, FiHome } from 'react-icons/fi';

const AddressCard = ({ address, onEdit, onDelete, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 relative overflow-hidden "
    >
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
            <button
                onClick={() => onEdit(address)}
                className="p-2 bg-white text-blue-500 rounded-lg shadow-sm hover:bg-blue-50 transition-colors border border-gray-100"
                title="Edit Address"
            >
                <FiEdit2 size={14} />
            </button>
            <button
                onClick={() => onDelete(address.ID || address.id)}
                className="p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 transition-colors border border-gray-100"
                title="Delete Address"
            >
                <FiTrash2 size={14} />
            </button>
        </div>

        <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FiHome className="text-xl" />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    {address.full_name}
                    {address.is_default && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide border border-green-200">
                            Default
                        </span>
                    )}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <FiPhone size={12} />
                    <span>{address.phone_number}</span>
                </div>
            </div>
        </div>

        <div className="space-y-1 text-gray-600 text-sm pl-16 border-l-2 border-gray-50 ml-6 py-1">
            <p className="font-medium text-gray-900">{address.address_line1}</p>
            <p>{address.city}, {address.state} {address.postal_code}</p>
            <p>{address.country}</p>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 -z-0" />
    </motion.div>
);

const ShopAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        full_name: '',
        phone_number: '',
        address_line1: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''
    });
    const [processing, setProcessing] = useState(false);

    const fetchAddresses = async () => {
        try {
            const res = await shopApi.getAddresses();
            if (res.status === 'success') {
                setAddresses(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch addresses", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const closeModal = () => {
        setShowAddModal(false);
        setEditingId(null);
        setNewAddress({
            full_name: '',
            phone_number: '',
            address_line1: '',
            city: '',
            state: '',
            country: '',
            postal_code: ''
        });
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setProcessing(true);
        console.log('Saving address...', newAddress, 'Editing ID:', editingId);
        try {
            let res;
            if (editingId) {
                const payload = { ...newAddress, ID: editingId };
                console.log('Sending Edit Payload:', payload);
                res = await shopApi.editAddress(payload);
            } else {
                console.log('Sending Add Payload:', newAddress);
                res = await shopApi.addAddress(newAddress);
            }

            console.log('API Response:', res);

            if (res && (res.status === 'success' || res.code === 200)) {
                console.log('Operation successful, refreshing...');
                await fetchAddresses();
                closeModal();
                alert(editingId ? 'Address updated successfully!' : 'Address added successfully!');
            } else {
                console.warn('Operation failed or status not success:', res);
                alert('Operation failed. ' + (res?.message || 'Unknown error'));
            }
        } catch (err) {
            console.error("Failed to save address", err);
            alert('Failed to save address. ' + (err.message || 'Please try again.'));
        } finally {
            setProcessing(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (addr) => {
        console.log('Opening edit modal for:', addr);
        setNewAddress({
            full_name: addr.full_name || '',
            phone_number: addr.phone_number || '',
            address_line1: addr.address_line1 || '',
            city: addr.city || '',
            state: addr.state || '',
            country: addr.country || '',
            postal_code: addr.postal_code || ''
        });
        const idToEdit = addr.ID || addr.id;
        console.log('ID to edit:', idToEdit);
        setEditingId(idToEdit);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        console.log('Deleting address with ID:', id);
        try {
            const res = await shopApi.deleteAddress(id);
            console.log('Delete response:', res);
            if (res && (res.status === 'success' || res.code === 200)) {
                await fetchAddresses();
                alert('Address deleted successfully');
            } else {
                alert('Failed to delete address: ' + (res?.message || 'Unknown error'));
            }
        } catch (err) {
            console.error("Failed to delete address", err);
            alert('Failed to delete address. ' + (err.message || 'Please try again.'));
        }
    };

    return (
        <div className="font-['Inter',sans-serif] text-[#0f1115] min-h-[80vh] max-w-7xl mx-auto flex flex-col gap-8 pb-12 px-4 lg:pt-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Addresses</h1>
                    <p className="text-gray-500 text-lg">Manage your shipping locations for faster checkout.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0f1115] text-white rounded-xl font-bold hover:bg-[#ff6a00] transition-all hover:shadow-lg hover:shadow-orange-500/20 group"
                >
                    <div className="bg-white/20 p-1 rounded-lg group-hover:scale-110 transition-transform">
                        <FiPlus className="text-lg" />
                    </div>
                    Add New Address
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : addresses.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center"
                >
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiMapPin className="text-4xl text-[#ff6a00]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No addresses found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        You haven't added any shipping addresses yet. Add one now to speed up your checkout process.
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="text-[#ff6a00] font-bold hover:text-[#e55f00] flex items-center justify-center gap-2 mx-auto"
                    >
                        <FiPlus /> Add your first address
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addresses.map((addr, idx) => (
                        <AddressCard
                            key={addr.id || idx}
                            address={addr}
                            index={idx}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}

                    {/* Add New Placeholder Card */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: addresses.length * 0.1 }}
                        onClick={() => setShowAddModal(true)}
                        className="group border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-[#ff6a00] hover:text-[#ff6a00] hover:bg-orange-50/10 transition-all min-h-[200px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-[#ff6a00] group-hover:text-white transition-colors">
                            <FiPlus className="text-2xl" />
                        </div>
                        <span className="font-bold">Add Another Address</span>
                    </motion.button>
                </div>
            )}

            {/* Add Address Modal */}
            <CustomModal
                open={showAddModal}
                onClose={closeModal}
                title={editingId ? "Edit Address" : "Add New Address"}
                className="max-w-2xl"
            >
                <form onSubmit={handleSaveAddress} className="space-y-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    name="full_name"
                                    value={newAddress.full_name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-3.5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={newAddress.phone_number}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address Line 1</label>
                        <div className="relative">
                            <FiMapPin className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="address_line1"
                                value={newAddress.address_line1}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="123 Main St, Apt 4B"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                            <input
                                type="text"
                                name="city"
                                value={newAddress.city}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="New York"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State / Province</label>
                            <input
                                type="text"
                                name="state"
                                value={newAddress.state}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="NY"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={newAddress.country}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="United States"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Postal Code</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={newAddress.postal_code}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="10001"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-[#ff6a00] text-white font-bold py-3.5 rounded-xl hover:bg-[#e55f00] transition-all hover:shadow-lg hover:shadow-[#ff6a00]/30 disabled:opacity-70 flex justify-center items-center gap-2"
                        >
                            {processing ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <FiCheck /> Save Address
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </CustomModal>
        </div>
    );
};

export default ShopAddresses;
