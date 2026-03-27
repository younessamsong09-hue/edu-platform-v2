import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ completed: 0, total: 0, points: 0, streak: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/login'); return }
    setUser(user)
    await fetchStats(user.id)
    setLoading(false)
  }

  async function fetchStats(userId: string) {
    const { count: completed } = await supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_completed', true)
    const { count: total } = await supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('is_published', true)
    const { data: pointsData } = await supabase.from('user_points').select('total_points').eq('user_id', userId).single()
    setStats({ completed: completed || 0, total: total || 0, points: pointsData?.total_points || 0, streak: 0 })
  }

  async function handleLogout() { await supabase.auth.signOut(); navigate('/') }

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>

  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>👤 ملفي الشخصي</h1>

      {/* إحصائيات سريعة */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{stats.completed}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>دروس مكتملة</div>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{stats.points}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>نقاط</div>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{stats.streak}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>أيام متتالية</div>
        </div>
      </div>

      {/* شريط التقدم */}
      <div style={{ background: 'white', borderRadius: '15px', padding: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>📊 تقدمك في المنصة</span>
          <span>{stats.completed}/{stats.total} درس</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: '#667eea', height: '100%', transition: 'width 0.5s' }} />
        </div>
        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#666' }}>{Math.round(progress)}% من الدروس مكتملة</p>
      </div>

      <div style={{ background: 'white', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
        <p><strong>البريد الإلكتروني:</strong> {user?.email}</p>
        <p><strong>عضو منذ:</strong> {new Date(user?.created_at).toLocaleDateString('ar-MA')}</p>
      </div>

      <Link to="/leaderboard"><button style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer' }}>🏆 لوحة التصنيف</button></Link>
      <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>تسجيل الخروج</button>
    </div>
  )
}
