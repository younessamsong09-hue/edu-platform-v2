import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import LessonDetail from './pages/LessonDetail'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Exercises from './pages/Exercises'

function Navbar() {
  const location = useLocation()
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])
  
  const isActive = (path: string) => location.pathname === path
  
  return (
    <nav style={{
      background: 'rgba(31, 41, 55, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '15px 30px',
      display: 'flex',
      gap: '30px',
      justifyContent: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      flexWrap: 'wrap'
    }}>
      <Link to="/" style={{
        color: isActive('/') ? '#667eea' : 'white',
        textDecoration: 'none',
        fontSize: '16px'
      }}>
        🏠 الرئيسية
      </Link>
      <Link to="/courses" style={{
        color: isActive('/courses') ? '#667eea' : 'white',
        textDecoration: 'none',
        fontSize: '16px'
      }}>
        📚 الدروس
      </Link>
      {user ? (
        <>
          <Link to="/profile" style={{
            color: isActive('/profile') ? '#667eea' : 'white',
            textDecoration: 'none',
            fontSize: '16px'
          }}>
            👤 ملفي
          </Link>
          {user.email === 'admin@example.com' && (
            <Link to="/admin" style={{
              color: isActive('/admin') ? '#667eea' : 'white',
              textDecoration: 'none',
              fontSize: '16px'
            }}>
              ⚙️ الإدارة
            </Link>
          )}
        </>
      ) : (
        <Link to="/login" style={{
          color: isActive('/login') ? '#667eea' : 'white',
          textDecoration: 'none',
          fontSize: '16px'
        }}>
          🔐 دخول
        </Link>
      )}
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
        <Route path="/courses/:id" element={<LessonDetail />} />
        <Route path="/exercises/:lessonId" element={<Exercises />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
