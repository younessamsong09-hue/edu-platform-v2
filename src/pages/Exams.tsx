import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Exam {
  id: number
  title: string
  title_ar: string
  year: number
  session: string
  level: string
  file_url: string
  correction_url: string
  description: string
  views: number
  downloads: number
  subject_id: number
}

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExams()
  }, [])

  async function fetchExams() {
    const { data } = await supabase
      .from('exams')
      .select('*')
      .eq('is_published', true)
      .order('year', { ascending: false })
    
    if (data) setExams(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>جاري تحميل الامتحانات...</h2>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', color: '#333', marginBottom: '10px' }}>
        📝 الامتحانات الوطنية
      </h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        امتحانات سابقة مع التصحيح لجميع المواد
      </p>

      {exams.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '15px' }}>
          <p>لا توجد امتحانات متاحة حالياً. سيتم إضافتها قريباً.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {exams.map(exam => (
            <div key={exam.id} style={{
              background: 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{exam.title_ar}</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                {exam.description}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={exam.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px',
                    background: '#10b981',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px'
                  }}
                >
                  📄 تحميل الامتحان
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/courses">
        <button style={{
          marginTop: '40px',
          width: '100%',
          padding: '15px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer'
        }}>
          ← العودة إلى الدروس
        </button>
      </Link>
    </div>
  )
}
