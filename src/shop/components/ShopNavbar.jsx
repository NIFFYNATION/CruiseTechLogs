import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isUserLoggedIn } from '../../controllers/userController';
import { useUser } from '../../contexts/UserContext';
import { useSidebar } from '../../contexts/SidebarContext'; // Import sidebar context
import { useShopData } from '../hooks/useShopData';
import { shopApi } from '../services/api';

const ShopNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const { categories } = useShopData();
  const { isCollapsed, toggleSidebar } = useSidebar(); // Use context
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check both controller logic and context state
    setLoggedIn(isUserLoggedIn() || (user && user.email));
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        if (!isUserLoggedIn()) {
          setCartCount(0);
          return;
        }
        const res = await shopApi.getCart();
        if (res.status === 'success') {
          const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
          setCartCount(items.length || 0);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, [location.pathname]);

  const SidebarContent = ({ forceExpanded = false }) => {
    const effectiveCollapsed = forceExpanded ? false : isCollapsed;

    return (
      <div className="flex flex-col h-full bg-white/80 backdrop-blur-2xl border-r border-white/20 shadow-2xl lg:shadow-none lg:bg-transparent lg:backdrop-blur-none lg:border-none">
        {/* Logo Area */}
        <div className={`p-6 ${effectiveCollapsed ? 'lg:p-4 justify-center' : 'lg:p-8'} flex items-center gap-3 transition-all duration-300`}>
          <div className="flex items-center justify-center size-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ff4081] text-white shadow-lg shadow-orange-500/20">
            <span className="material-symbols-outlined text-[24px] text-white font-bold">redeem</span>
          </div>
          {!effectiveCollapsed && (
            <span className="text-xl font-black tracking-tight text-[#0f1115] whitespace-nowrap overflow-hidden transition-all duration-300">
              Cruise Gifts
            </span>
          )}
        </div>

        {/* Main Navigation */}
        <div className={`flex-1 overflow-y-auto ${effectiveCollapsed ? 'px-2' : 'px-4 lg:px-6'} py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]`}>
          <div className="space-y-1 mb-8">
            {!effectiveCollapsed && <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 transition-opacity">Menu</p>}
            <NavLink to="/shop" icon="home" text="Home" active={location.pathname === '/shop'} isCollapsed={effectiveCollapsed} />
            <NavLink to="/shop/products" icon="inventory_2" text="All Products" active={location.pathname === '/shop/products' && !location.search.includes('category')} isCollapsed={effectiveCollapsed} />
            <NavLink to="/dashboard" icon="dashboard" text="Switch to CruiseLog Dashboard" isCollapsed={effectiveCollapsed} />
            {/* <NavLink to="#" icon="mail" text="Contact" isCollapsed={effectiveCollapsed} /> */}
          </div>

          {/* Categories */}
          <div className="space-y-1 mb-8">
            {!effectiveCollapsed && <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 transition-opacity">Categories</p>}
            {categories.slice(0, 8).map(cat => (
              <NavLink
                key={cat.id}
                to={`/shop/products?category=${cat.id}`}
                icon="category"
                text={cat.name}
                active={location.search.includes(`category=${cat.id}`)}
                isCategory
                image={cat.image}
                isCollapsed={effectiveCollapsed}
              />
            ))}
            <Link
              to="/shop/categories"
              className={`flex items-center gap-3 ${effectiveCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 hover:text-[#ff6a00] hover:bg-orange-50 group`}
              title="View All"
            >
              <div className="size-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#ff6a00] transition-colors">
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
              {!effectiveCollapsed && <span>View All</span>}
            </Link>
          </div>
        </div>

        {/* User & Cart Footer */}
        <div className={`p-4 ${effectiveCollapsed ? 'lg:p-2' : 'lg:p-6'} border-t border-gray-100/50 bg-white/50 backdrop-blur-sm lg:bg-transparent`}>
          <div className={`flex items-center ${effectiveCollapsed ? 'flex-col justify-center gap-4' : 'justify-between gap-2'}`}>
            <Link
              to="/shop/cart"
              className="relative flex items-center justify-center size-12 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 hover:border-[#ff6a00] transition-all group"
              title="Cart"
            >
              <span className="material-symbols-outlined text-gray-600 group-hover:text-[#ff6a00] transition-colors">shopping_bag</span>
              {cartCount > 0 && <span className="absolute top-0 right-0 size-3 rounded-full bg-[#ff6a00] ring-2 ring-white animate-pulse"></span>}
            </Link>

            <Link
              to={loggedIn ? "/shop/dashboard" : "/login"}
              state={!loggedIn ? { from: location } : undefined}
              className={`flex items-center gap-3 ${effectiveCollapsed ? 'justify-center p-2 rounded-xl bg-white border border-gray-100' : 'flex-1 p-2 pr-4 rounded-full bg-white border border-gray-100'} shadow-sm hover:shadow-md hover:border-[#ff6a00] transition-all group overflow-hidden`}
              title={loggedIn ? 'My Account' : 'Sign In'}
            >
              <div className={`size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[#ff6a00] group-hover:text-white transition-colors flex-shrink-0`}>
                <span className="material-symbols-outlined text-[18px]">{loggedIn ? 'person' : 'login'}</span>
              </div>
              {!effectiveCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-gray-900 truncate group-hover:text-[#ff6a00]">{loggedIn ? (user?.name || 'My Account') : 'Sign In'}</span>
                  <span className="text-[10px] text-gray-500 truncate">{loggedIn ? 'View details' : 'Join now'}</span>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-24 bg-white border border-gray-100 shadow-md rounded-full p-1 text-gray-400 hover:text-[#ff6a00] hover:scale-110 transition-all z-50"
        >
          <span className="material-symbols-outlined text-[18px]">
            {effectiveCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 rounded-lg active:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-[#0f1115]">menu</span>
          </button>
          <span className="text-lg font-black tracking-tight text-[#0f1115]">Cruise Gifts</span>
        </div>
        <Link to="/shop/cart" className="relative p-2 rounded-full hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-[#0f1115]">shopping_bag</span>
          {cartCount > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#ff6a00] ring-2 ring-white"></span>}
        </Link>
      </div>

      {/* Desktop Sidebar (Fixed) */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 bg-white/60 backdrop-blur-2xl border-r border-white/20 z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-72'
          }`}
      >
        <SidebarContent forceExpanded={false} />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        {/* Drawer */}
        <div className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-[#f8f5f2] shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Force expanded state for mobile drawer content */}
          <SidebarContent forceExpanded={true} />
          {/* Close Button */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white text-gray-500 hover:text-red-500 transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Helper wrapper to force isCollapsed=false context for mobile
// Actually we can't easily force context value down without a new provider. 
// A simpler way is to pass `collapsed` prop to SidebarContent.
// Let's refactor SidebarContent to accept `overrideCollapsed` prop.
// Wait, I can't easily change the context value provided to children without a provider.
// But `SidebarContent` is defined INSIDE `ShopNavbar`, so it closes over `isCollapsed`.
// So I can just pass a prop `mobileMode` to `SidebarContent` and use that to ignore `isCollapsed`.

// REDUING SidebarContent slightly to handle mobile force-expand.

const MobileSidebarContentWrapper = ({ children }) => <>{children}</>;

// Helper Component for Links
const NavLink = ({ to, icon, text, active, isCategory, image, isCollapsed }) => (
  <Link
    to={to}
    className={`group flex items-center gap-3 ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative overflow-hidden ${active
      ? 'text-[#ff6a00] bg-white shadow-sm shadow-orange-100 ring-1 ring-orange-100'
      : 'text-gray-600 hover:text-[#0f1115] hover:bg-white/50'
      }`}
    title={isCollapsed ? text : ''}
  >
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#ff6a00] rounded-r-full"></div>}

    {isCategory && image ? (
      <div className={`size-6 rounded-lg bg-gray-100 bg-cover bg-center shrink-0 ring-1 ${active ? 'ring-orange-200' : 'ring-gray-200 group-hover:ring-gray-300'}`} style={{ backgroundImage: `url('${image}')` }}></div>
    ) : (
      <span className={`material-symbols-outlined text-[20px] ${active ? 'text-[#ff6a00]' : 'text-gray-400 group-hover:text-[#ff6a00]'}`}>{icon}</span>
    )}
    <span className={`truncate transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>{text}</span>
  </Link>
);

export default ShopNavbar;
