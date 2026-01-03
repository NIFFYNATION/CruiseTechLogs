import { useState, useEffect, useCallback, useMemo } from 'react';
import shopApi from '../services/api';

export const useShopData = () => {
    const [rawProducts, setRawProducts] = useState([]);
    const [categories, setCategories] = useState(() => {
        const cached = localStorage.getItem('shop_categories');
        return cached ? JSON.parse(cached) : [];
    });
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTags = useCallback(async () => {
        try {
            const response = await shopApi.getTags();
            if (response.status === 'success') {
                setTags(response.data);
            }
        } catch (err) {
            console.error('Error fetching tags:', err);
            setTags([]);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        // Try to load from cache first for immediate display
        const cached = localStorage.getItem('shop_categories');
        if (cached) {
            try {
                setCategories(JSON.parse(cached));
            } catch (e) {
                console.error("Error parsing cached categories", e);
            }
        }

        try {
            const response = await shopApi.getCategories();
            if (response.status === 'success') {
                // Map API categories to UI format
                const formattedCategories = [
                    { id: 'all', name: 'All Categories', image: '' },
                    ...response.data.map(cat => ({
                        id: cat.ID,
                        name: cat.name,
                        image: shopApi.getImageUrl(cat.cover_image)
                    }))
                ];
                setCategories(formattedCategories);
                localStorage.setItem('shop_categories', JSON.stringify(formattedCategories));
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            // If we have no categories (neither cached nor fetched), set fallback
            setCategories(prev => prev.length > 0 ? prev : [{ id: 'all', name: 'All Categories' }]);
        }
    }, []);

    const fetchProducts = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shopApi.getProducts(filters);
            if (response.status === 'success') {
                // Handle both array and object with products field
                const productsData = Array.isArray(response.data) ? response.data : (response.data.products || []);
                setRawProducts(productsData);
            } else {
                setRawProducts([]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
            setRawProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const products = useMemo(() => {
        return rawProducts.map(product => {
            // Parse tags if they are a string
            let productTagIds = [];
            if (Array.isArray(product.tags)) {
                productTagIds = product.tags;
            } else if (typeof product.tags === 'string' && product.tags) {
                try {
                    productTagIds = product.tags.includes('[') ? JSON.parse(product.tags) : product.tags.split(',');
                } catch {
                    productTagIds = [product.tags];
                }
            }

            // Map tag IDs to objects { id, name }
            const mappedTags = productTagIds.map(id => {
                const tagObj = tags.find(t => String(t.ID) === String(id));
                return (tagObj && tagObj.name) ? { id: String(tagObj.ID), name: tagObj.name } : null;
            }).filter(Boolean);

            return {
                id: product.ID,
                title: product.title,
                description: product.description ? product.description.replace(/<[^>]*>/g, '') : '', // Strip HTML
                price: Number(product.amount),
                oldPrice: null,
                category: product.category_id,
                tags: mappedTags,
                image: shopApi.getImageUrl(product.cover_image),
                custom_fields: product.custom_fields,
                badge: mappedTags.includes('Featured') ? 'Featured' : mappedTags.includes('New') ? 'New' : mappedTags.includes('Sale') ? 'Sale' : null
            };
        });
    }, [rawProducts, tags]);

    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, [fetchCategories, fetchTags]);

    return {
        products,
        categories,
        tags,
        loading,
        error,
        fetchProducts
    };
};
