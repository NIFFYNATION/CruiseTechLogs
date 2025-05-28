import { Outlet } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/common/ThemeToggle'
import Tabs from './components/MobileTab'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
          {/* Fixed position theme toggle */}
          <div className="fixed bottom-20 right-4 z-50">
                    <ThemeToggle />
                  </div>
        <Outlet />
        {/* Mobile Tab Navigation */}
        <div className="md:hidden pt-32">
          <Tabs />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
