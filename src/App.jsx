import { Outlet } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/common/ThemeToggle'
import Tabs from './components/MobileTab'
import ProtectedRoute from './routes/ProtectedRoute'
import { UserProvider } from './contexts/UserContext';
import { SidebarProvider } from './contexts/SidebarContext';

function App() {
  return (
    <UserProvider>
      <SidebarProvider>
        <ThemeProvider>
          <div className="min-h-screen">
            {/* Fixed position theme toggle */}
            <div className="fixed bottom-20 right-4 z-50">
              <ThemeToggle />
            </div>
            <Outlet />
            {/* Mobile Tab Navigation */}
            <ProtectedRoute>
              <div className="md:hidden pt-32">
                <Tabs />
              </div>
            </ProtectedRoute>
          </div>
        </ThemeProvider>
      </SidebarProvider>
    </UserProvider>
  )
}

export default App
