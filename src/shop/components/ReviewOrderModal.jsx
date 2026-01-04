import React from 'react';
import { Link } from 'react-router-dom';
import CustomModal from '../../components/common/CustomModal';
import { formatPrice } from '../shop.config';

const ReviewOrderModal = ({
    open,
    onClose,
    product,
    quantity,
    setQuantity,
    buyStep,
    shippingAddresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddingAddress,
    setIsAddingAddress,
    newAddress,
    setNewAddress,
    addressLoading,
    orderProcessing,
    handleAddAddress,
    handleProceedToShipping,
    handleAddToCartAction,
    // New Props for Custom Fields
    customFieldValues,
    setCustomFieldValues,
    getCustomFields,
    handleProceedFromShipping,
    handleBack
}) => {

    // Helper to render individual form fields
    const renderFieldInput = (field) => {
        const value = customFieldValues?.[field.label] || '';
        const handleChange = (val) => {
            // If setCustomFieldValues is not provided (legacy usage), ignore or handle gracefully
            if (setCustomFieldValues) {
                setCustomFieldValues(prev => ({ ...prev, [field.label]: val }));
            }
        };

        switch (field.type) {
            case 'select':
                return (
                    <select
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        required={field.required}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options && field.options.split(',').map(opt => (
                            <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                        ))}
                    </select>
                );
            case 'checkbox':
                // Checkbox can have multiple options, but usually 'checkbox' type in simplified schemas 
                // might act as proper multi-select or single boolean if no options.
                // Based on "Render multiple checkboxes from options", we need an array.
                const currentValues = Array.isArray(value) ? value : [];
                const toggleOption = (opt) => {
                    let newValues;
                    if (currentValues.includes(opt)) {
                        newValues = currentValues.filter(v => v !== opt);
                    } else {
                        newValues = [...currentValues, opt];
                    }
                    handleChange(newValues);
                };

                if (!field.options) return null;

                return (
                    <div className="flex flex-wrap gap-2">
                        {field.options.split(',').map(opt => {
                            const trimmedOpt = opt.trim();
                            const isChecked = currentValues.includes(trimmedOpt);
                            return (
                                <label key={trimmedOpt} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${isChecked ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-700'}`}>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isChecked}
                                        onChange={() => toggleOption(trimmedOpt)}
                                    />
                                    <span className="text-sm font-medium">{trimmedOpt}</span>
                                </label>
                            );
                        })}
                    </div>
                );
            case 'textarea':
                return (
                    <textarea
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115] min-h-[100px]"
                        placeholder={field.description || `Enter ${field.label}`}
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        required={field.required}
                    />
                );
            case 'link':
                return (
                    <input
                        type="url"
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                        placeholder="https://example.com"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        required={field.required}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        required={field.required}
                    />
                );
            default: // text, number
                return (
                    <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                        placeholder={field.description || `Enter ${field.label}`}
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        required={field.required}
                    />
                );
        }
    };

    const isCustomFieldsValid = () => {
        if (!product || !getCustomFields) return true;
        const fields = getCustomFields();
        if (!fields) return true;

        for (const field of fields) {
            const val = customFieldValues?.[field.label];
            if (field.required) {
                if (!val || (Array.isArray(val) && val.length === 0)) {
                    return false;
                }
            }
            if (field.type === 'link' && val) {
                // Basic URL validation if not empty
                if (!val.match(/^https?:\/\/.+/)) {
                    return false;
                }
            }
        }
        return true;
    };

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title={buyStep === 'overview' ? 'Order Overview' : buyStep === 'shipping' ? 'Shipping Details' : buyStep === 'custom_fields' ? 'Customize Product' : 'Order Confirmed'}
            className="w-full max-w-lg bg-white"
        >
            {buyStep === 'overview' && product && (
                <div className="p-4">
                    <div className="flex gap-4 mb-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 line-clamp-2">{product.title}</h3>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-sm text-black">Quantity:</span>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                    <button
                                        onClick={() => setQuantity && setQuantity(Math.max(1, quantity - 1))}
                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#ff6a00]"
                                        disabled={!setQuantity}
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity && setQuantity(quantity + 1)}
                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#ff6a00]"
                                        disabled={!setQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <p className="text-[#0f1115] font-black text-lg mt-2">{formatPrice(product.price * quantity)}</p>
                        </div>
                    </div>

                    <div className="space-y-3 py-4 border-t border-gray-100 mb-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">Shipping</span>
                            <span className="text-green-600 font-bold uppercase tracking-tight flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">local_shipping</span>
                                Free
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                            <span className="font-semibold text-gray-600">Total Amount</span>
                            <span className="font-black text-2xl text-[#0f1115]">{formatPrice(product.price * quantity)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleProceedToShipping}
                            className="flex-[2] bg-[#0f1115] text-white h-12 rounded-xl font-bold hover:bg-[#ff6a00] transition-colors"
                        >
                            Shipping Address
                        </button>
                    </div>
                </div>
            )}

            {buyStep === 'shipping' && (
                <div className="p-4">
                    {!isAddingAddress ? (
                        <>
                            <div className="mb-6 max-h-60 overflow-y-auto">
                                {addressLoading ? (
                                    <div className="text-center py-4 text-gray-500">Loading addresses...</div>
                                ) : shippingAddresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {shippingAddresses.map((addr) => (
                                            <div
                                                key={addr.ID}
                                                onClick={() => setSelectedAddressId(addr.ID)}
                                                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.ID
                                                    ? 'border-[#0f1115] bg-gray-50'
                                                    : 'border-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-black-900">{addr.full_name}</p>
                                                        <p className="text-sm text-black-600">{addr.address_line1}, {addr.city}</p>
                                                        <p className="text-xs text-black-500">{addr.country}, {addr.postal_code}</p>
                                                    </div>
                                                    {selectedAddressId === addr.ID && (
                                                        <span className="material-symbols-outlined text-[#0f1115]">check_circle</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">No shipping addresses found.</div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsAddingAddress(true)}
                                className="w-full py-3 mb-4 text-[#0f1115] font-bold border-2 border-dashed border-gray-200 rounded-xl hover:border-[#0f1115] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Add New Address
                            </button>

                            <div className="mb-4">
                                <div className="flex items-center justify-center gap-2 py-2 bg-green-50 rounded-xl border border-green-100">
                                    <span className="material-symbols-outlined text-green-500 text-sm">local_shipping</span>
                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Free Shipping on this order</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleBack}
                                    className="flex-1 px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleProceedFromShipping || handleAddToCartAction}
                                    disabled={!selectedAddressId || orderProcessing}
                                    className="flex-[2] bg-[#0f1115] text-white h-12 rounded-xl font-bold hover:bg-[#ff6a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {orderProcessing ? (
                                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    ) : (
                                        <>
                                            {getCustomFields && getCustomFields().length > 0 ? 'Continue' : 'Add to Cart'}
                                            <span className="material-symbols-outlined">{getCustomFields && getCustomFields().length > 0 ? 'arrow_forward' : 'shopping_cart'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleAddAddress} className="space-y-3">
                            <input
                                placeholder="Full Name"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                                value={newAddress.full_name}
                                onChange={e => setNewAddress({ ...newAddress, full_name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Phone Number"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                                value={newAddress.phone_number}
                                onChange={e => setNewAddress({ ...newAddress, phone_number: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Address Line 1"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                                value={newAddress.address_line1}
                                onChange={e => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    placeholder="City"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="State"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                                    value={newAddress.state}
                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    placeholder="Country"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                                    value={newAddress.country}
                                    onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Postal Code"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0f1115]"
                                    value={newAddress.postal_code}
                                    onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingAddress(false)}
                                    className="flex-1 py-3 font-bold text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addressLoading}
                                    className="flex-1 bg-[#0f1115] text-white rounded-xl font-bold hover:bg-[#ff6a00] transition-colors"
                                >
                                    {addressLoading ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {buyStep === 'custom_fields' && (
                <div className="p-4">
                    <div className="mb-2">
                        <p className="text-gray-500 text-sm">Please provide the following details for your order.</p>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddToCartAction(); }} className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto px-1">
                        {getCustomFields && getCustomFields().map((field, index) => (
                            <div key={index} className="space-y-1">
                                <label className="block text-sm font-bold text-gray-700">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {field.description && <p className="text-xs text-gray-500 mb-1">{field.description}</p>}
                                {renderFieldInput(field)}
                            </div>
                        ))}

                        <div className="mb-4 mt-2">
                            <div className="flex items-center justify-center gap-2 py-2 bg-green-50 rounded-xl border border-green-100">
                                <span className="material-symbols-outlined text-green-500 text-sm">local_shipping</span>
                                <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Free Shipping on this order</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!isCustomFieldsValid() || orderProcessing}
                                className="flex-[2] bg-[#0f1115] text-white h-12 rounded-xl font-bold hover:bg-[#ff6a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {orderProcessing ? (
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                ) : (
                                    <>
                                        Add to Cart
                                        <span className="material-symbols-outlined">shopping_cart</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {buyStep === 'added' && (
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-5xl">shopping_cart_checkout</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0f1115] mb-2">Added to Cart!</h3>
                    <p className="text-gray-500 mb-8">Item has been added to your cart successfully.</p>
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/shop/cart"
                            className="w-full py-3 bg-[#ff6a00] text-white rounded-xl font-bold hover:bg-[#e65f00] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                        >
                            Checkout Now
                            <span className="material-symbols-outlined">payments</span>
                        </Link>
                        <Link
                            to="/shop/cart"
                            className="w-full py-3 bg-[#0f1115] text-white rounded-xl font-bold hover:bg-[#ff6a00] transition-colors"
                        >
                            View Cart
                        </Link>
                        <button
                            onClick={onClose}
                            className="w-full py-3 text-gray-500 font-bold hover:text-gray-900"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </CustomModal>
    );
};

export default ReviewOrderModal;
