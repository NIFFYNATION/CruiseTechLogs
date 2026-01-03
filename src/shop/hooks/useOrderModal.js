import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { shopApi } from '../services/api';
import { isUserLoggedIn } from '../../controllers/userController';

export const useOrderModal = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [buyStep, setBuyStep] = useState('overview');

    const [customFieldValues, setCustomFieldValues] = useState({});

    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [orderProcessing, setOrderProcessing] = useState(false);

    const [newAddress, setNewAddress] = useState({
        full_name: '',
        phone_number: '',
        address_line1: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''
    });

    // Helper to get parsed custom fields
    const getCustomFields = () => {
        // Debug log
        console.log('getCustomFields - product:', product);

        if (!product?.custom_fields) {
            console.log('getCustomFields - no custom_fields field found');
            return [];
        }

        try {
            const fields = typeof product.custom_fields === 'string'
                ? JSON.parse(product.custom_fields)
                : product.custom_fields;
            console.log('getCustomFields - parsed fields:', fields);
            return fields;
        } catch (e) {
            console.error("Error parsing custom fields", e);
            return [];
        }
    };

    const fetchAddresses = async () => {
        // ... existing fetchAddresses logic ...
        setAddressLoading(true);
        try {
            const res = await shopApi.getAddresses();
            if (res.status === 'success') {
                setShippingAddresses(res.data);
                if (res.data.length > 0 && !selectedAddressId) {
                    setSelectedAddressId(res.data[0].ID);
                }
            }
        } catch (err) {
            console.error("Failed to fetch addresses", err);
        } finally {
            setAddressLoading(false);
        }
    };

    const openModal = (productToBuy, initialQuantity = 1) => {
        if (!isUserLoggedIn()) {
            navigate('/login', { state: { from: location } });
            return;
        }
        setProduct(productToBuy);
        setQuantity(initialQuantity);
        setOpen(true);
        setBuyStep('overview');
        setCustomFieldValues({}); // Reset custom fields
        fetchAddresses();
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleAddAddress = async (e) => {
        // ... existing handleAddAddress logic ...
        e.preventDefault();
        setAddressLoading(true);
        try {
            const res = await shopApi.addAddress(newAddress);
            if (res.status === 'success') {
                setIsAddingAddress(false);
                fetchAddresses();
                setNewAddress({
                    full_name: '',
                    phone_number: '',
                    address_line1: '',
                    city: '',
                    state: '',
                    country: '',
                    postal_code: ''
                });
            }
        } catch (err) {
            console.error("Failed to add address", err);
        } finally {
            setAddressLoading(false);
        }
    };

    const handleProceedToShipping = () => {
        setBuyStep('shipping');
    };

    const handleProceedFromShipping = () => {
        if (!selectedAddressId) {
            alert('Please select a shipping address.');
            return;
        }

        const fields = getCustomFields();
        console.log('handleProceedFromShipping - fields found:', fields);

        if (fields && fields.length > 0) {
            console.log('Transitioning to custom_fields step');
            setBuyStep('custom_fields');
        } else {
            console.log('Proceeding directly to addToCart');
            handleAddToCartAction();
        }
    };

    const handleAddToCartAction = async () => {
        if (!selectedAddressId) {
            alert('Please select a shipping address.');
            return;
        }

        if (!product || !product.id) {
            alert('Internal Error: Product ID missing.');
            return;
        }

        setOrderProcessing(true);
        try {
            const addToCartPayload = {
                productID: String(product.id),
                quantity: quantity,
                shipping_id: selectedAddressId,
                custom_datas: customFieldValues
            };

            const addToCartRes = await shopApi.addToCart(addToCartPayload);

            if (addToCartRes.status === 'success') {
                setBuyStep('added');
            } else {
                alert('Failed to add item to cart. Please try again.');
            }
        } catch (err) {
            console.error("Failed to add to cart", err);
            alert('An error occurred while adding to cart.');
        } finally {
            setOrderProcessing(false);
        }
    };

    return {
        open,
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
        customFieldValues,
        setCustomFieldValues,
        getCustomFields,
        openModal,
        closeModal,
        handleAddAddress,
        handleProceedToShipping,
        handleProceedFromShipping,
        handleAddToCartAction
    };
};
