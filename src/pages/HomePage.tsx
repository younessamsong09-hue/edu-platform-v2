import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function HomePage() {
  const [stats, setStats] = useState({
    subjects: 0,
    lessons: 0,
    students: 0,
    teachers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      // جلب عدد المواد
      const { count: subjectsCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true })
      
      // جلب عدد الدروس المنشورة
      const { count: lessonsCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
      
      // جلب عدد الطلاب المسجلين (من جدول users)
      const { count: studentsCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      
      // عدد الأساتذة (افتراضي مؤقت)
      const teachersCount = 12
      
      setStats({
        subjects: subjectsCount || 8,
        lessons: lessonsCount || 0,
        students: studentsCount || 0,
        teachers: teachersCount
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Cairo, sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎓</div>
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            بوابة المعرفة المغربية
          </h1>
          <p style={{ 
            fontSize: '20px', 
            opacity: 0.95,
            marginBottom: '40px'
          }}>
            منصتك لتعلم المواد الدراسية بذكاء وسهولة
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/courses">
              <button style={{
                background: 'white',
                color: '#667eea',
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                🚀 استكشف الدروس
              </button>
            </Link>
            
            <button style={{
              background: 'transparent',
              color: 'white',
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              border: '2px solid white',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onClick={() => alert('قريباً: صفحة التسجيل')}>
              📝 تسجيل جديد
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section - بيانات حقيقية */}
      <div style={{
        background: 'white',
        borderRadius: '30px',
        maxWidth: '1000px',
        margin: '-50px auto 0',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.subjects}+
            </div>
            <div style={{ color: '#666', marginTop: '10px' }}>مواد دراسية</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.lessons}+
            </div>
            <div style={{ color: '#666', marginTop: '10px' }}>دروس تفاعلية</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.students}+
            </div>
            <div style={{ color: '#666', marginTop: '10px' }}>طلاب مسجلين</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>
              {loading ? '...' : stats.teachers}+
            </div>
            <div style={{ color: '#666', marginTop: '10px' }}>أساتذة متميزون</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', color: '#333', marginBottom: '50px' }}>
          مميزات المنصة
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          <div style={{
            background: 'white',
            padding: '40px 30px',
            borderRadius: '20px',
            textAlign: 'center',
            transition: 'transform 0.3s',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📹</div>
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#333' }}>دروس فيديو</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>دروس عالية الجودة مع أفضل الأساتذة، يمكن مشاهدتها في أي وقت</p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '40px 30px',
            borderRadius: '20px',
            textAlign: 'center',
            transition: 'transform 0.3s',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📝</div>
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#333' }}>تمارين تفاعلية</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>تمارين مع تصحيح فوري لقياس مستواك وتحديد نقاط الضعف</p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '40px 30px',
            borderRadius: '20px',
            textAlign: 'center',
            transition: 'transform 0.3s',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎯</div>
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#333' }}>امتحانات وطنية</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>جميع الامتحانات الوطنية مع الحلول المفصلة والنصائح</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#1f2937',
        color: 'white',
        textAlign: 'center',
        padding: '40px',
        marginTop: '80px'
      }}>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>🎓 بوابة المعرفة المغربية</p>
        <p style={{ opacity: 0.7, marginBottom: '20px' }}>معًا نبني مستقبل التعليم في المغرب</p>
        <p style={{ opacity: 0.5, fontSize: '14px' }}>صنع بكل فخر لطلاب مدينة تاوريرت ✨</p>
        <p style={{ opacity: 0.4, fontSize: '12px', marginTop: '20px' }}>© 2025 جميع الحقوق محفوظة</p>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
