import React, { useState, useEffect, useRef } from 'react';
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
            {address.address_line2 && <p className="font-medium text-gray-900">{address.address_line2}</p>}
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
        address_line2: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''
    });
    const [processing, setProcessing] = useState(false);
    
    // Replace with your actual Google Maps API Key or set VITE_GOOGLE_MAPS_API_KEY in .env
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";

    // Manually load Google Maps script to ensure it's available
    const [isMapsLoaded, setIsMapsLoaded] = useState(false);
    const searchInputRef = useRef(null);
    const autoCompleteRef = useRef(null);
    const cityInputRef = useRef(null);
    const cityAutoCompleteRef = useRef(null);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                console.log("✅ Google Maps Places API is already loaded.");
                setIsMapsLoaded(true);
                return;
            }

            const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
            if (existingScript) {
                console.log("⏳ Google Maps script already in DOM, waiting for load...");
                existingScript.addEventListener('load', () => setIsMapsLoaded(true));
                return;
            }

            console.log("🚀 Loading Google Maps API script...");
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log("✅ Google Maps Script Loaded Successfully");
                setIsMapsLoaded(true);
            };
            script.onerror = (err) => console.error("❌ Google Maps Script Load Error:", err);
            document.head.appendChild(script);
        };

        if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY") {
             loadGoogleMapsScript();
        } else {
            console.error("❌ Google Maps API Key is missing or invalid.");
        }
    }, [GOOGLE_MAPS_API_KEY]);

    // Initialize Autocomplete when script is loaded and modal is shown
    useEffect(() => {
        if (!isMapsLoaded) {
            console.log("⏳ Waiting for Maps to load...");
            return;
        }
        
        // Wait for modal transition/render
        if (!showAddModal) {
             console.log("🙈 Modal is closed, skipping Autocomplete init.");
             return;
        }

        // Slight delay to ensure DOM is ready
        const initTimer = setTimeout(() => {
            if (!searchInputRef.current) {
                console.warn("⚠️ Search input ref is NULL. Retrying in 500ms...");
                // Retry once
                setTimeout(() => {
                    if (searchInputRef.current && window.google) {
                        initAutocomplete();
                    } else {
                        console.error("❌ Search input ref is STILL NULL after retry. Check conditional rendering.");
                    }
                }, 500);
                return;
            }
            initAutocomplete();
            initCityAutocomplete();
        }, 100);

        return () => clearTimeout(initTimer);

    }, [isMapsLoaded, showAddModal]);

    const initAutocomplete = () => {
         if (!searchInputRef.current || !window.google) return;
         console.log("🛠️ Initializing Google Maps Autocomplete on element:", searchInputRef.current);
        
        try {
            // Clear previous instance listeners if any (though new instance usually handles this)
            if (autoCompleteRef.current) {
                 window.google.maps.event.clearInstanceListeners(autoCompleteRef.current);
            }

            autoCompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current, {
                types: ["address"],
                fields: ["address_components", "geometry", "formatted_address"]
            });

            autoCompleteRef.current.addListener("place_changed", () => {
                const place = autoCompleteRef.current.getPlace();
                console.log("📍 Place Selected:", place);
                
                if (!place || !place.address_components) {
                    console.warn("⚠️ No address components found in place object");
                    return;
                }

                const addressComponents = place.address_components;
                let streetNumber = '';
                let route = '';
                let city = '';
                let state = '';
                let country = '';
                let postalCode = '';
                let subpremise = '';

                addressComponents.forEach(component => {
                    const types = component.types;
                    if (types.includes('street_number')) streetNumber = component.long_name;
                    if (types.includes('route')) route = component.long_name;
                    if (types.includes('locality')) city = component.long_name;
                    if (types.includes('administrative_area_level_1')) state = component.long_name;
                    if (types.includes('country')) country = component.long_name;
                    if (types.includes('postal_code')) postalCode = component.long_name;
                    if (types.includes('subpremise') || types.includes('floor') || types.includes('room')) subpremise = component.long_name;
                });

                // If city is empty, try sublocality or neighborhood
                if (!city) {
                    const sublocality = addressComponents.find(c => c.types.includes('sublocality_level_1'));
                    if (sublocality) city = sublocality.long_name;
                }

                console.log("📝 Auto-filling address:", {
                    address_line1: `${streetNumber} ${route}`.trim(),
                    address_line2: subpremise,
                    city, state, country, postalCode
                });

                setNewAddress(prev => ({
                    ...prev,
                    address_line1: `${streetNumber} ${route}`.trim(),
                    address_line2: subpremise,
                    city: city,
                    state: state,
                    country: country,
                    postal_code: postalCode
                }));
            });
        } catch (error) {
            console.error("❌ Error initializing Autocomplete:", error);
        }
    };

    const initCityAutocomplete = () => {
        if (!cityInputRef.current || !window.google) return;
        console.log("🛠️ Initializing City Autocomplete on element:", cityInputRef.current);

        try {
            if (cityAutoCompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(cityAutoCompleteRef.current);
            }

            cityAutoCompleteRef.current = new window.google.maps.places.Autocomplete(cityInputRef.current, {
                types: ["(cities)"],
                fields: ["address_components", "geometry", "formatted_address"]
            });

            cityAutoCompleteRef.current.addListener("place_changed", () => {
                const place = cityAutoCompleteRef.current.getPlace();
                console.log("📍 City Place Selected:", place);

                if (!place || !place.address_components) return;

                let city = '';
                let state = '';
                let country = '';

                place.address_components.forEach(component => {
                    const types = component.types;
                    if (types.includes('locality')) city = component.long_name;
                    if (types.includes('administrative_area_level_1')) state = component.long_name;
                    if (types.includes('country')) country = component.long_name;
                });

                // If city is empty, try sublocality
                if (!city) {
                    const sublocality = place.address_components.find(c => c.types.includes('sublocality_level_1'));
                    if (sublocality) city = sublocality.long_name;
                }

                setNewAddress(prev => ({
                    ...prev,
                    city: city || prev.city,
                    state: state || prev.state,
                    country: country || prev.country
                }));
            });
        } catch (error) {
             console.error("❌ Error initializing City Autocomplete:", error);
        }
    };

    // Removed the previous useEffect check as we now have a dedicated loader logic above

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
            address_line2: '',
            city: '',
            state: '',
            country: '',
            postal_code: ''
        });
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const requiredFields = [
            ['country', 'Country'],
            ['state', 'State / Province'],
            ['full_name', 'Full Name'],
            ['phone_number', 'Phone Number'],
            ['address_line1', 'Street Address'],
            ['city', 'City'],
            ['postal_code', 'Zip / Postal Code'],
        ];

        const missingFields = requiredFields
            .filter(([key]) => !String(newAddress?.[key] || '').trim())
            .map(([, label]) => label);

        if (missingFields.length > 0) {
            alert(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

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
            address_line2: addr.address_line2 || '',
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
                {/* Fix for Google Places Autocomplete dropdown z-index */}
                <style>{`
                    .pac-container {
                        z-index: 2147483647 !important; /* Max z-index to match modal */
                    }
                `}</style>
                <form onSubmit={handleSaveAddress} className="space-y-6 p-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Address (Auto-fill)</label>
                        <div className="relative">
                            <FiMapPin className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                name="search_address_input"
                                id="search_address_input"
                                autoComplete="new-password"
                                data-lpignore="true"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="Start typing to search address..."
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
                                autoComplete="new-password"
                                data-lpignore="true"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="United States"
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
                                autoComplete="new-password"
                                data-lpignore="true"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="NY"
                            />
                        </div>
                    </div>

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
                                    autoComplete="new-password"
                                    data-lpignore="true"
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
                                    autoComplete="new-password"
                                    data-lpignore="true"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address Line 1 (Street Address)</label>
                        <div className="relative">
                            <FiMapPin className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="address_line1"
                                value={newAddress.address_line1}
                                onChange={handleInputChange}
                                required
                                autoComplete="new-password"
                                data-lpignore="true"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="123 Main St"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address Line 2 (Unit, Suite, etc.)</label>
                        <div className="relative">
                            <FiHome className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="address_line2"
                                value={newAddress.address_line2}
                                onChange={handleInputChange}
                                autoComplete="new-password"
                                data-lpignore="true"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="Apt 4B"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                            <input
                                ref={cityInputRef}
                                type="text"
                                name="city"
                                value={newAddress.city}
                                onChange={handleInputChange}
                                required
                                autoComplete="new-password"
                                data-lpignore="true"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="New York"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Zip / Postal Code</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={newAddress.postal_code}
                                onChange={handleInputChange}
                                required
                                autoComplete="new-password"
                                data-lpignore="true"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 outline-none transition-all font-medium"
                                placeholder="10001"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 py-4 rounded-xl font-bold text-white bg-[#0f1115] hover:bg-[#ff6a00] transition-all shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiCheck className="text-lg" />
                                    Save Address
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
