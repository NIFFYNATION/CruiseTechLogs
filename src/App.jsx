import { Outlet } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/common/ThemeToggle'
import Tabs from './components/MobileTab'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-secondary">
          {/* Fixed position theme toggle */}
          <div className="fixed bottom-4 right-4 z-50">
                    <ThemeToggle />
                  </div>
        <Outlet />
        {/* Mobile Tab Navigation */}
        <Tabs />
      </div>
    </ThemeProvider>
  )
}

export default App
