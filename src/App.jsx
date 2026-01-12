import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/common/ThemeToggle'
import Tabs from './components/MobileTab'
import { UserProvider } from './contexts/UserContext';
import { SidebarProvider } from './contexts/SidebarContext';
import PageSpinner from './components/dashboard/PageSpinner';
import { isUserLoggedIn } from './controllers/userController';


// ScrollToTop component to handle scrolling to top on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate initial loading (replace with real data loading if needed)
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <PageSpinner />;
  }

  return (
    
    <UserProvider>
      <SidebarProvider>
        <ThemeProvider>
          <div className="min-h-screen">
            {/* Fixed position theme toggle */}
            <div className="fixed bottom-20 right-4 z-50">
              <ThemeToggle />
            </div>
            <ScrollToTop />

            <Outlet />
            {/* Mobile Tab Navigation */}
            <div className="md:hidden pt-32">
              {isUserLoggedIn() && <Tabs />}
            </div>
          </div>
        </ThemeProvider>
      </SidebarProvider>
    </UserProvider>
  )
}

export default App
