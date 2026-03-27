import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Pathfinder from '../components/Pathfinder'
import StudyBuddy from '../components/StudyBuddy'

export default function HomePage() {
  const [stats, setStats] = useState({ subjects: 0, lessons: 0, students: 0, teachers: 0 })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchStats()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function fetchStats() {
    const { count: subjectsCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true })
    const { count: lessonsCount } = await supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('is_published', true)
    const { count: studentsCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
    setStats({ subjects: subjectsCount || 8, lessons: lessonsCount || 0, students: studentsCount || 0, teachers: 12 })
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '80px' }}>🎓</div>
        <h1 style={{ fontSize: '48px' }}>بوابة المعرفة المغربية</h1>
        <p style={{ fontSize: '20px', marginBottom: '40px' }}>منصتك لتعلم المواد الدراسية بذكاء وسهولة</p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/courses"><button style={{ background: 'white', color: '#667eea', padding: '15px 40px', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>🚀 استكشف الدروس</button></Link>
          <Link to="/login"><button style={{ background: '#10b981', color: 'white', padding: '15px 40px', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>📝 تسجيل جديد</button></Link>
        </div>

        {/* رسالة ترحيب للمستخدم الجديد */}
        {!user && (
          <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '15px', marginTop: '30px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            🎉 مرحباً بك! سجل دخولك لتتمكن من حفظ تقدمك والحصول على شهادات.
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '-30px auto 0', padding: '0 20px' }}>
        <Pathfinder />
        <StudyBuddy />
      </div>

      <div style={{ background: 'white', borderRadius: '30px', maxWidth: '1000px', margin: '40px auto', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
          <div><div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>{loading ? '...' : stats.subjects}+</div><div>مواد دراسية</div></div>
          <div><div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>{loading ? '...' : stats.lessons}+</div><div>دروس تفاعلية</div></div>
          <div><div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>{loading ? '...' : stats.students}+</div><div>طلاب مسجلين</div></div>
          <div><div style={{ fontSize: '40px', fontWeight: 'bold', color: '#667eea' }}>{loading ? '...' : stats.teachers}+</div><div>أساتذة متميزون</div></div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', color: '#333' }}>مميزات المنصة</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center' }}><div style={{ fontSize: '60px' }}>📝</div><h3>تمارين تفاعلية</h3><p>تمارين مع تصحيح فوري</p></div>
          <div style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center' }}><div style={{ fontSize: '60px' }}>📹</div><h3>دروس فيديو</h3><p>دروس عالية الجودة</p></div>
          <div style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center' }}><div style={{ fontSize: '60px' }}>🎯</div><h3>امتحانات وطنية</h3><p>مع الحلول المفصلة</p></div>
        </div>
      </div>

      <footer style={{ background: '#1f2937', color: 'white', textAlign: 'center', padding: '40px' }}>
        <p>🎓 بوابة المعرفة المغربية</p>
        <p>صنع بكل فخر لطلاب مدينة تاوريرت ✨</p>
        <p>© 2025 جميع الحقوق محفوظة</p>
      </footer>
    </div>
  )
}
