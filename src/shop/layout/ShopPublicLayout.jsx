import React from 'react';
import { Outlet } from 'react-router-dom';
import ShopNavbar from '../components/ShopNavbar';
import ShopFooter from '../components/ShopFooter'; // Assuming most pages need footer, or leave it in pages?
// ShopLandingPage and ShopProducts have ShopFooter. ShopCart probably does too.
// If I put ShopFooter here, I should remove it from pages too.
import { useSidebar } from '../../contexts/SidebarContext';

const ShopPublicLayout = () => {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen w-full flex flex-col font-['Inter',sans-serif] text-[#0f1115] antialiased selection:bg-[#ff6a00] selection:text-white overflow-x-hidden bg-white">
            <ShopNavbar />

            {/* Main Content Wrapper - Dynamic Padding */}
            <div
                className={`flex-grow pt-16 lg:pt-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-24' : 'lg:pl-72'
                    }`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default ShopPublicLayout;
