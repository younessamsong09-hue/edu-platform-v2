import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Subject {
  id: number
  name: string
  name_ar: string
  icon: string
  color: string
  description: string
  level: string
}

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
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
    return (
      <div style={{ textAlign: 'center', padding: '100px', background: '#f3f4f6', minHeight: '100vh' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>⏳</div>
        <h2 style={{ color: '#666' }}>جاري تحميل المواد...</h2>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>📚 المواد الدراسية</h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>اختر المادة التي تريد دراستها</p>
      </div>

      {/* Courses Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {subjects.map((subject) => (
            <Link to={`/courses/${subject.id}`} key={subject.id} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}>
                <div style={{
                  background: subject.color || '#4f46e5',
                  padding: '40px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '70px' }}>{subject.icon}</span>
                </div>
                <div style={{ padding: '25px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#1f2937' }}>{subject.name_ar}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    {subject.description || `دروس شاملة في مادة ${subject.name_ar}`}
                  </p>
                  <button style={{
                    background: subject.color || '#4f46e5',
                    color: 'white',
                    padding: '12px 30px',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    استكشف الدروس →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#1f2937', color: 'white', textAlign: 'center', padding: '30px', marginTop: '40px' }}>
        <p>© 2025 بوابة المعرفة المغربية | صنع بكل فخر لطلاب مدينة تاوريرت ✨</p>
      </footer>
    </div>
  )
}
