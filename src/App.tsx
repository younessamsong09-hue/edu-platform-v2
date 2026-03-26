import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'

function Navbar() {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  return (
    <nav style={{
      background: '#1f2937',
      padding: '15px 30px',
      display: 'flex',
      gap: '30px',
      justifyContent: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <Link to="/" style={{
        color: isActive('/') ? '#667eea' : 'white',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: isActive('/') ? 'bold' : 'normal',
        transition: 'color 0.3s'
      }}>
        🏠 الرئيسية
      </Link>
      <Link to="/courses" style={{
        color: isActive('/courses') ? '#667eea' : 'white',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: isActive('/courses') ? 'bold' : 'normal',
        transition: 'color 0.3s'
      }}>
        📚 الدروس
      </Link>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
