export const shopConfig = {
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8072',
        imageBaseUrl: import.meta.env.VITE_IMAGE_BASE || 'http://localhost/cruise/app/',
    },
    currency: {
        symbol: '₦',
        code: 'NGN',
        name: 'Naira'
    },
    company: {
        name: 'CruiseTech',
        contactEmail: 'support@cruisetech.com'
    },
    products: {
        defaultSort: 'featured',
        itemsPerPage: 12
    }
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
};

export const cleanDescription = (text) => {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .replace(/&amp;/g, '&')  // Replace &amp; with &
        .replace(/&quot;/g, '"') // Replace &quot; with "
        .replace(/&apos;/g, "'") // Replace &apos; with '
        .replace(/&lt;/g, '<')   // Replace &lt; with <
        .replace(/&gt;/g, '>')   // Replace &gt; with >
        .trim();
};
