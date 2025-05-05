import { Outlet } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/common/ThemeToggle'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-secondary">
          {/* Fixed position theme toggle */}
          <div className="fixed bottom-4 right-4 z-50">
                    <ThemeToggle />
                  </div>
        <Outlet />
      </div>
    </ThemeProvider>
  )
}

export default App
