import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShopDashboard from '../ShopDashboard';
import { shopApi } from '../../services/api';
import { UserProvider } from '../../../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';

// Mock the API methods
vi.mock('../../services/api', () => ({
    shopApi: {
        getOrders: vi.fn(),
        getProducts: vi.fn(),
        getCart: vi.fn(),
        getImageUrl: vi.fn((url) => url),
    }
}));

// Mock the User Context
// We can wrap the component in the real provider or mock the hook.
// For simplicity, we'll wrap with a mock user in the provider if possible, 
// but since UserProvider fetches data, we might want to mock the useUser hook instead.
vi.mock('../../../contexts/UserContext', () => ({
    useUser: () => ({
        user: { name: 'Test User', email: 'test@example.com' },
        loading: false
    }),
    UserProvider: ({ children }) => <div>{children}</div>
}));

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
        p: ({ children, ...props }) => <p {...props}>{children}</p>,
        button: ({ children, ...props }) => <button {...props}>{children}</button>,
    }
}));

describe('ShopDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        shopApi.getOrders.mockImplementation(() => new Promise(() => {})); // Never resolves
        shopApi.getProducts.mockImplementation(() => new Promise(() => {}));
        shopApi.getCart.mockImplementation(() => new Promise(() => {}));

        render(
            <MemoryRouter>
                <ShopDashboard />
            </MemoryRouter>
        );

        // Check for skeleton loader or loading indicator
        // In our code, we use a div with animate-pulse
        const loaders = document.getElementsByClassName('animate-pulse');
        expect(loaders.length).toBeGreaterThan(0);
    });

    it('renders dashboard with data successfully', async () => {
        const mockOrders = {
            status: 'success',
            data: [
                { id: '1', order_id: 'ORD-1', amount: 5000, status: 'processing', created_at: '2023-01-01' }
            ]
        };
        const mockProducts = {
            status: 'success',
            data: [
                { ID: '101', title: 'Test Product', amount: 1000, cover_image: 'test.jpg' }
            ]
        };
        const mockCart = {
            status: 'success',
            data: {
                items: [{ productID: '101', quantity: 2 }]
            }
        };

        shopApi.getOrders.mockResolvedValue(mockOrders);
        shopApi.getProducts.mockResolvedValue(mockProducts);
        shopApi.getCart.mockResolvedValue(mockCart);

        await act(async () => {
            render(
                <MemoryRouter>
                    <ShopDashboard />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Welcome back, Test!')).toBeInTheDocument();
            expect(screen.getByText('ORD-1')).toBeInTheDocument();
            expect(screen.getByText('Test Product')).toBeInTheDocument();
            // Check stats
            // Total Spent: 5000 -> formatted
            // Active Orders: 1
            expect(screen.getByText('1')).toBeInTheDocument(); // Active Orders count
        });
    });

    it('handles error state gracefully', async () => {
        shopApi.getOrders.mockRejectedValue(new Error('API Error'));
        shopApi.getProducts.mockResolvedValue({ status: 'success', data: [] });
        shopApi.getCart.mockResolvedValue({ status: 'success', data: {} });

        await act(async () => {
            render(
                <MemoryRouter>
                    <ShopDashboard />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
            expect(screen.getByText('Failed to load dashboard data. Please try refreshing.')).toBeInTheDocument();
        });
    });
});
