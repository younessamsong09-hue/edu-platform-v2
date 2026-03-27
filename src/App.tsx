import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import NotificationBell from './components/NotificationBell'
import UserLevel from './components/UserLevel'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import SubjectDetail from './pages/SubjectDetail'
import LessonDetail from './pages/LessonDetail'
import AdminPanel from './pages/AdminPanel'
import AdminDashboard from './pages/AdminDashboard'
import AdminStats from './pages/AdminStats'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Exercises from './pages/Exercises'
import Exams from './pages/Exams'
import EnglishTips from './pages/EnglishTips'
import Leaderboard from './pages/Leaderboard'
import AITutor from './pages/AITutor'
import AITutorDarija from './pages/AITutorDarija'
import Games from './pages/Games'
import Competitions from './pages/Competitions'
import Recommendations from './pages/Recommendations'
import './dark-mode.css'

function Navbar() {
  const location = useLocation()
  const [user, setUser] = useState<any>(null)
  const { theme } = useTheme()
  
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
  
  const navStyle = {
    background: theme === 'dark' ? '#111827' : 'rgba(31, 41, 55, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '8px 10px',
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    flexWrap: 'wrap' as const,
    alignItems: 'center'
  }
  
  const linkStyle = (path: string) => ({
    color: isActive(path) ? '#667eea' : (theme === 'dark' ? '#f3f4f6' : 'white'),
    textDecoration: 'none',
    fontSize: '11px',
    padding: '4px 6px',
    transition: 'color 0.3s',
    whiteSpace: 'nowrap' as const
  })
  
  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle('/')}>🏠 الرئيسية</Link>
      <Link to="/courses" style={linkStyle('/courses')}>📚 الدروس</Link>
      <Link to="/exams" style={linkStyle('/exams')}>📝 الامتحانات</Link>
      <Link to="/games" style={linkStyle('/games')}>🎮 ألعاب</Link>
      <Link to="/competitions" style={linkStyle('/competitions')}>🏆 مسابقات</Link>
      <Link to="/leaderboard" style={linkStyle('/leaderboard')}>🏅 التصنيف</Link>
      <Link to="/recommendations" style={linkStyle('/recommendations')}>🤖 توصيات</Link>
      <Link to="/ai-tutor" style={linkStyle('/ai-tutor')}>🤖 مدرس AI</Link>
      <Link to="/ai-darija" style={linkStyle('/ai-darija')}>🗣️ مدرس بالدارجة</Link>
      <Link to="/english-tips" style={linkStyle('/english-tips')}>💡 نصائح</Link>
      {user ? (
        <>
          <Link to="/profile" style={linkStyle('/profile')}>👤 ملفي</Link>
          {user.email === 'admin@example.com' && (
            <>
              <Link to="/admin" style={linkStyle('/admin')}>⚙️ إضافة درس</Link>
              <Link to="/admin-dashboard" style={linkStyle('/admin-dashboard')}>📋 لوحة التحكم</Link>
              <Link to="/admin-stats" style={linkStyle('/admin-stats')}>📊 الإحصائيات</Link>
            </>
          )}
        </>
      ) : (
        <Link to="/login" style={linkStyle('/login')}>🔐 دخول</Link>
      )}
      <NotificationBell />
      <UserLevel />
      <ThemeToggle />
    </nav>
  )
}

function AppContent() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<SubjectDetail />} />
        <Route path="/courses/lesson/:id" element={<LessonDetail />} />
        <Route path="/exercises/:lessonId" element={<Exercises />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/games" element={<Games />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/english-tips" element={<EnglishTips />} />
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/ai-darija" element={<AITutorDarija />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-stats" element={<AdminStats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
