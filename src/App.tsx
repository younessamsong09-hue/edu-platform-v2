import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#667eea' }}>🎓 بوابة المعرفة المغربية</h1>
      <p style={{ fontSize: '18px', marginTop: '10px' }}>أول منصة تعليمية مغربية شاملة للجميع</p>
      <Link to="/courses">
        <button style={{ 
          background: '#667eea', 
          color: 'white', 
          padding: '12px 30px', 
          border: 'none', 
          borderRadius: '8px', 
          fontSize: '16px',
          marginTop: '20px',
          cursor: 'pointer'
        }}>
          استكشف الدروس →
        </button>
      </Link>
    </div>
  )
}

function CoursesPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('order_num')
    
    if (!error && data) {
      setSubjects(data)
    }
    setLoading(false)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>جاري التحميل...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#667eea' }}>📚 المواد الدراسية</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {subjects.map((subject) => (
          <div key={subject.id} style={{
            background: subject.color || '#667eea',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            color: 'white',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '50px' }}>{subject.icon}</div>
            <h3>{subject.name_ar}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <nav style={{ 
        background: '#1f2937', 
        padding: '15px', 
        display: 'flex', 
        gap: '30px', 
        justifyContent: 'center',
        fontFamily: 'sans-serif'
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
