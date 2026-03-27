import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function About() {
  const [stats, setStats] = useState({
    students: 0,
    lessons: 0,
    subjects: 0,
    teachers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const { count: studentsCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    const { count: lessonsCount } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
    
    const { count: subjectsCount } = await supabase
      .from('subjects')
      .select('*', { count: 'exact', head: true })
    
    setStats({
      students: studentsCount || 0,
      lessons: lessonsCount || 0,
      subjects: subjectsCount || 0,
      teachers: 12
    })
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '30px',
        padding: '50px 30px',
        textAlign: 'center',
        color: 'white',
        marginBottom: '40px'
      }}>
        <div style={{ fontSize: '70px', marginBottom: '20px' }}>🎓</div>
        <h1 style={{ fontSize: '40px', marginBottom: '15px' }}>بوابة المعرفة المغربية</h1>
        <p style={{ fontSize: '18px', opacity: 0.95 }}>
          أول منصة تعليمية مغربية شاملة
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '50px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderTop: '5px solid #667eea'
        }}>
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎯</div>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#333' }}>رؤيتنا</h2>
          <p style={{ lineHeight: '1.8', color: '#666' }}>
            أن نصبح المرجع الأول للتعليم الرقمي في المغرب
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderTop: '5px solid #10b981'
        }}>
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>🚀</div>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#333' }}>رسالتنا</h2>
          <p style={{ lineHeight: '1.8', color: '#666' }}>
            تقديم محتوى تعليمي متميز بالدارجة المغربية
          </p>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '50px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>📊 إحصائيات المنصة</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '30px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.subjects}+
            </div>
            <div>مواد دراسية</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.lessons}+
            </div>
            <div>دروس تفاعلية</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.students}+
            </div>
            <div>طالب مسجل</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.teachers}+
            </div>
            <div>أستاذ متميز</div>
          </div>
        </div>
      </div>

      <Link to="/">
        <button style={{
          marginTop: '30px',
          width: '100%',
          padding: '12px',
          background: '#f3f4f6',
          color: '#333',
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
