import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Exam {
  id: number
  subject_id: number
  year: number
  session: string
  level: string
  exam_url: string
  correction_url: string
  description: string
  views: number
  downloads: number
}

export default function NationalExams() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExams()
  }, [])

  async function fetchExams() {
    const { data } = await supabase
      .from('national_exams')
      .select('*')
      .order('year', { ascending: false })
    
    if (data) setExams(data)
    setLoading(false)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري تحميل الامتحانات...</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '10px' }}>
        📝 الامتحانات الوطنية
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        امتحانات البكالوريا مع التصحيح
      </p>

      {exams.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p>لا توجد امتحانات حالياً</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {exams.map(exam => (
            <div key={exam.id} style={{
              background: 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <h3>{exam.description}</h3>
              <p>السنة: {exam.year}</p>
              <p>الدورة: {exam.session === 'normale' ? 'عادية' : 'استدراكية'}</p>
            </div>
          ))}
        </div>
      )}

      <Link to="/">
        <button style={{
          marginTop: '40px',
          width: '100%',
          padding: '12px',
          background: '#f3f4f6',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}>
          ← العودة للرئيسية
        </button>
      </Link>
    </div>
  )
}
