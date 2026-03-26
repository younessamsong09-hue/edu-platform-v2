import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'

function App() {
  return (
    <BrowserRouter>
      <nav style={{
        background: '#1f2937',
        padding: '15px 30px',
        display: 'flex',
        gap: '30px',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 الرئيسية</Link>
        <Link to="/courses" style={{ color: 'white', textDecoration: 'none' }}>📚 الدروس</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
