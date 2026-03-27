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

  const team = [
    { name: 'فريق التطوير', role: 'التقنيون', icon: '💻', desc: 'يطورون المنصة باستمرار' },
    { name: 'فريق المحتوى', role: 'الأساتذة', icon: '📚', desc: 'يعدون الدروس والتمارين' },
    { name: 'فريق الدعم', role: 'الدعم الفني', icon: '🤝', desc: 'يساعدون الطلاب 24/7' }
  ]

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Hero Section */}
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
        <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '600px', margin: '0 auto' }}>
          أول منصة تعليمية مغربية شاملة تجمع بين التكنولوجيا والتربية
        </p>
      </div>

      {/* Vision & Mission */}
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
            "أن نصبح المرجع الأول للتعليم الرقمي في المغرب، ونمكّن كل طالب من الوصول إلى تعليم 
            عالي الجودة بغض النظر عن موقعه الجغرافي أو وضعه الاجتماعي."
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
            "تقديم محتوى تعليمي متميز بالدارجة المغربية والعربية، باستخدام أحدث التقنيات، 
            لمساعدة الطلاب على التفوق في دراستهم وتحقيق أحلامهم."
          </p>
        </div>
      </div>

      {/* Stats */}
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
            <div style={{ color: '#666', marginTop: '5px' }}>مواد دراسية</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.lessons}+
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>درس تفاعلي</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.students}+
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>طالب مسجل</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.teachers}+
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>أستاذ متميز</div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '50px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>👥 من صنع المنصة؟</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px'
        }}>
          {team.map((member, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '50px', marginBottom: '10px' }}>{member.icon}</div>
              <h3 style={{ fontSize: '20px', marginBottom: '5px', color: '#333' }}>{member.name}</h3>
              <p style={{ color: '#667eea', fontWeight: 'bold', marginBottom: '10px' }}>{member.role}</p>
              <p style={{ color: '#666', fontSize: '14px' }}>{member.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '30px' }}>🌟 قيمنا</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '30px' }}>📖</div>
            <div>الجودة</div>
          </div>
          <div>
            <div style={{ fontSize: '30px' }}">🤝</div>
            <div>الشمولية</div>
          </div>
          <div>
            <div style={{ fontSize: '30px' }}>💡</div>
            <div>الابتكار</div>
          </div>
          <div>
            <div style={{ fontSize: '30px' }}>🎯</div>
            <div>التميز</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ marginBottom: '15px', color: '#333' }}>🌟 انضم إلى آلاف الطلاب</h2>
        <p style={{ marginBottom: '25px', color: '#666' }}>ابدأ رحلتك التعليمية مع بوابة المعرفة المغربية</p>
        <Link to="/login">
          <button style={{
            background: '#667eea',
            color: 'white',
            padding: '12px 35px',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            سجل الآن مجاناً
          </button>
        </Link>
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
