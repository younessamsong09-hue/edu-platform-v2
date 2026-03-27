import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import NotificationBell from './components/NotificationBell'
import UserLevel from './components/UserLevel'
import Wellness from './components/Wellness'
import DeepWorkZone from './components/DeepWorkZone'
import StudyRadar from './components/StudyRadar'
import MobileMenu from './components/MobileMenu'
import ScrollToTop from './components/ScrollToTop'
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
import Library from './pages/Library'
import BookAssistant from './pages/BookAssistant'
import About from './pages/About'
import NationalExams from './pages/NationalExams'
import NeighborhoodLeaderboard from './pages/NeighborhoodLeaderboard'
import PeerHelp from './pages/PeerHelp'
import CommonMistakes from './pages/CommonMistakes'
import GradeCalculator from './pages/GradeCalculator'
import CareerGuidance from './pages/CareerGuidance'
import VisualMistakes from './pages/VisualMistakes'
import './dark-mode.css'
import './mobile.css'

function DesktopNavbar() {
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
  
  const linkStyle = (path: string) => ({
    color: isActive(path) ? '#667eea' : (theme === 'dark' ? '#f3f4f6' : 'white'),
    textDecoration: 'none',
    fontSize: '11px',
    padding: '4px 6px',
    transition: 'color 0.3s',
    whiteSpace: 'nowrap' as const
  })
  
  return (
    <nav style={{
      background: theme === 'dark' ? '#111827' : 'rgba(31, 41, 55, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '8px 10px',
      display: 'flex',
      gap: '6px',
      justifyContent: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <Link to="/" style={linkStyle('/')}>🏠 الرئيسية</Link>
      <Link to="/courses" style={linkStyle('/courses')}>📚 الدروس</Link>
      <Link to="/exams" style={linkStyle('/exams')}>📝 الامتحانات</Link>
      <Link to="/games" style={linkStyle('/games')}>🎮 ألعاب</Link>
      <Link to="/competitions" style={linkStyle('/competitions')}>🏆 مسابقات</Link>
      <Link to="/leaderboard" style={linkStyle('/leaderboard')}>🏅 التصنيف</Link>
      <Link to="/grade-calculator" style={linkStyle('/grade-calculator')}>📊 المعدل</Link>
      <Link to="/ai-darija" style={linkStyle('/ai-darija')}>🗣️ مدرس بالدارجة</Link>
      <Link to="/about" style={linkStyle('/about')}>📖 عن المنصة</Link>
      {user ? (
        <Link to="/profile" style={linkStyle('/profile')}>👤 ملفي</Link>
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
      <DesktopNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<SubjectDetail />} />
        <Route path="/courses/lesson/:id" element={<LessonDetail />} />
        <Route path="/exercises/:lessonId" element={<Exercises />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/national-exams" element={<NationalExams />} />
        <Route path="/games" element={<Games />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:id" element={<BookAssistant />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/neighborhood-leaderboard" element={<NeighborhoodLeaderboard />} />
        <Route path="/peer-help" element={<PeerHelp />} />
        <Route path="/common-mistakes" element={<CommonMistakes />} />
        <Route path="/visual-mistakes" element={<VisualMistakes />} />
        <Route path="/grade-calculator" element={<GradeCalculator />} />
        <Route path="/career-guidance" element={<CareerGuidance />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/english-tips" element={<EnglishTips />} />
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/ai-darija" element={<AITutorDarija />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-stats" element={<AdminStats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Wellness />
      <DeepWorkZone />
      <StudyRadar />
      <MobileMenu />
      <ScrollToTop />
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
