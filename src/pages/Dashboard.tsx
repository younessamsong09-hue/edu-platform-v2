import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ completed: 0, total: 0, points: 0, streak: 0 })
  const [recentLessons, setRecentLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      await fetchStats(user.id)
      await fetchRecentLessons(user.id)
    }
    setLoading(false)
  }

  async function fetchStats(userId: string) {
    const { count: completed } = await supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_completed', true)
    const { count: total } = await supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('is_published', true)
    const { data: pointsData } = await supabase.from('user_points').select('total_points').eq('user_id', userId).single()
    setStats({ completed: completed || 0, total: total || 0, points: pointsData?.total_points || 0, streak: 0 })
  }

  async function fetchRecentLessons(userId: string) {
    const { data } = await supabase
      .from('user_progress')
      .select('*, lessons(title_ar, subject_id)')
      .eq('user_id', userId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false })
      .limit(5)
    if (data) setRecentLessons(data)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>
  if (!user) return <div style={{ textAlign: 'center', padding: '100px' }}><Link to="/login">سجل دخولك</Link> لرؤية لوحة التحكم</div>

  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>📊 لوحة التحكم</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>مرحباً {user.email?.split('@')[0]}! إليك ملخص تقدمك</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '15px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{stats.completed}</div>
          <div>دروس مكتملة</div>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '15px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{stats.points}</div>
          <div>نقاط</div>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '15px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{stats.streak}</div>
          <div>أيام متتالية</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '15px', padding: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>📊 تقدمك العام</span>
          <span>{stats.completed}/{stats.total} درس</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: '#667eea', height: '100%', transition: 'width 0.5s' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <Link to="/courses" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px' }}>📚</div>
            <div>استكشف الدروس</div>
          </div>
        </Link>
        <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px' }}>🏆</div>
            <div>لوحة التصنيف</div>
          </div>
        </Link>
      </div>

      <h2 style={{ marginBottom: '15px' }}>📖 آخر الدروس المكتملة</h2>
      {recentLessons.length === 0 ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center', color: '#666' }}>
          لم تكمل أي درس بعد. ابدأ التعلم الآن!
        </div>
      ) : (
        recentLessons.map(lesson => (
          <Link key={lesson.id} to={`/courses/lesson/${lesson.lesson_id}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', borderRight: '3px solid #10b981' }}>
              <div style={{ fontWeight: 'bold' }}>{lesson.lessons?.title_ar}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>تم الإكمال في {new Date(lesson.completed_at).toLocaleDateString('ar-MA')}</div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
