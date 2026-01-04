import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import shopApi from '../services/api';
import { cleanDescription } from '../shop.config';
import cacheService from '../services/cacheService';

// Global registry to prevent redundant fetches within the same minute or across components
const activeFetches = {
    categories: null,
    tags: null,
    products: {}
};

export const useShopData = () => {
    const [rawProducts, setRawProducts] = useState(() => cacheService.get('products') || []);
    const [categories, setCategories] = useState(() => cacheService.get('categories') || []);
    const [tags, setTags] = useState(() => cacheService.get('tags') || []);
    const [sections, setSections] = useState(() => cacheService.get('sections') || []);
    const [loading, setLoading] = useState(() => {
        // Start loading if we have NO products cached at all
        const cached = cacheService.get('products');
        return !cached || cached.length === 0;
    });
    const [error, setError] = useState(null);

    // Initial loading state if no cache
    const isFirstLoad = useRef(true);
    const initialSyncDone = useRef(false);

    const fetchTags = useCallback(async (force = false) => {
        if (!force && !cacheService.isStale('tags')) return;

        if (activeFetches.tags) {
            await activeFetches.tags;
            setTags(cacheService.get('tags') || []);
            return;
        }

        activeFetches.tags = (async () => {
            try {
                const response = await shopApi.getTags();
                if (response.status === 'success') {
                    setTags(response.data);
                    cacheService.save('tags', response.data);
                }
            } catch (err) {
                console.error('Error fetching tags:', err);
            } finally {
                activeFetches.tags = null;
            }
        })();

        return activeFetches.tags;
    }, []);

    const fetchCategories = useCallback(async (force = false) => {
        if (!force && !cacheService.isStale('categories')) return;

        if (activeFetches.categories) {
            await activeFetches.categories;
            setCategories(cacheService.get('categories') || []);
            return;
        }

        activeFetches.categories = (async () => {
            try {
                const response = await shopApi.getCategories();
                if (response.status === 'success') {
                    const formattedCategories = [
                        { id: 'all', name: 'All Categories', image: '' },
                        ...response.data.map(cat => ({
                            id: cat.ID,
                            name: cat.name,
                            image: shopApi.getImageUrl(cat.cover_image)
                        }))
                    ];
                    setCategories(formattedCategories);
                    cacheService.save('categories', formattedCategories);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            } finally {
                activeFetches.categories = null;
            }
        })();

        return activeFetches.categories;
    }, []);

    const fetchSections = useCallback(async (force = false) => {
        if (!force && !cacheService.isStale('sections')) return;

        if (activeFetches.sections) {
            await activeFetches.sections;
            setSections(cacheService.get('sections') || []);
            return;
        }

        activeFetches.sections = (async () => {
            try {
                const response = await shopApi.getSections();
                if (response.status === 'success') {
                    setSections(response.data);
                    cacheService.save('sections', response.data);
                }
            } catch (err) {
                console.error('Error fetching sections:', err);
            } finally {
                activeFetches.sections = null;
            }
        })();

        return activeFetches.sections;
    }, []);

    const fetchSectionDetail = useCallback(async (id, force = false) => {
        const cacheKey = `section_detail_${id} `;
        const cached = cacheService.get(cacheKey);

        if (cached && !force && !cacheService.isStale(cacheKey)) {
            return cached;
        }

        try {
            const response = await shopApi.getSectionDetail(id);
            if (response.status === 'success') {
                cacheService.save(cacheKey, response.data);
                return response.data;
            }
        } catch (err) {
            console.error(`Error fetching section ${id}: `, err);
        }
        return cached || null;
    }, []);

    const fetchProducts = useCallback(async (filters = {}, force = false) => {
        const filterKey = JSON.stringify(filters);
        const cacheKey = `products_${filterKey} `;

        // Only show loader if we have absolutely no data (not even generic products)
        // or if it's the very first request for these specific filters
        const cached = cacheService.get(cacheKey) || (Object.keys(filters).length === 0 ? cacheService.get('products') : null);

        if (cached) {
            setRawProducts(cached);
        }

        if (activeFetches.products[cacheKey]) {
            await activeFetches.products[cacheKey];
            const refreshed = cacheService.get(cacheKey);
            if (refreshed) setRawProducts(refreshed);
            setLoading(false);
            return;
        }

        const stale = force || cacheService.isStale(cacheKey) || (Object.keys(filters).length === 0 && cacheService.isStale('products'));

        if (!stale) {
            setLoading(false);
            return;
        }

        if (!cached) setLoading(true);
        setError(null);

        activeFetches.products[cacheKey] = (async () => {
            try {
                const response = await shopApi.getProducts(filters);
                if (response.status === 'success') {
                    const productsData = Array.isArray(response.data) ? response.data : (response.data.products || []);
                    setRawProducts(productsData);
                    cacheService.save(cacheKey, productsData);
                    // Also save to generic "products" if no filters for faster global entry
                    if (Object.keys(filters).length === 0) {
                        cacheService.save('products', productsData);
                    }
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                delete activeFetches.products[cacheKey];
                setLoading(false);
                initialSyncDone.current = true;
            }
        })();
    }, []);

    const products = useMemo(() => {
        return rawProducts.map(product => {
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

            const mappedTags = productTagIds.map(id => {
                const tagObj = tags.find(t => String(t.ID) === String(id));
                return (tagObj && tagObj.name) ? { id: String(tagObj.ID), name: tagObj.name } : null;
            }).filter(Boolean);

            const hasTag = (tagName) => mappedTags.some(t => t.name === tagName);

            return {
                id: product.ID,
                title: product.title,
                description: product.description ? product.description.replace(/<[^>]*>/g, '') : '',
                price: Number(product.amount),
                oldPrice: null,
                category: product.category_id,
                tags: mappedTags,
                image: shopApi.getImageUrl(product.cover_image),
                custom_fields: product.custom_fields,
                delivery_range: product.delivery_range,
                badge: hasTag('Featured') ? 'Featured' : hasTag('New') ? 'New' : hasTag('Sale') ? 'Sale' : null
            };
        });
    }, [rawProducts, tags]);

    useEffect(() => {
        if (isFirstLoad.current) {
            fetchCategories();
            fetchTags();
            fetchSections();
            isFirstLoad.current = false;
        }
    }, [fetchCategories, fetchTags, fetchSections]);

    return {
        products,
        categories,
        tags,
        sections,
        loading,
        error,
        isInitialSyncDone: initialSyncDone.current,
        fetchProducts,
        fetchSectionDetail,
        refresh: useCallback(() => {
            fetchCategories(true);
            fetchTags(true);
            fetchSections(true);
        }, [fetchCategories, fetchTags, fetchSections])
    };
};


