import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

interface Progress {
  lesson_id: number
  lesson_title: string
  completed_at: string
}

interface Favorite {
  lesson_id: number
  lesson_title: string
}

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<Progress[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [stats, setStats] = useState({ completed: 0, total: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
      return
    }
    setUser(user)
    await fetchStats()
    await fetchProgress()
    await fetchFavorites()
    setLoading(false)
  }

  async function fetchStats() {
    const { count: completed } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_completed', true)

    const { count: total } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)

    setStats({ completed: completed || 0, total: total || 0 })
  }

  async function fetchProgress() {
    const { data } = await supabase
      .from('user_progress')
      .select('lesson_id, completed_at, lessons(title_ar)')
      .eq('user_id', user.id)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false })

    if (data) {
      setProgress(data.map(p => ({
        lesson_id: p.lesson_id,
        lesson_title: p.lessons?.title_ar || 'درس',
        completed_at: p.completed_at
      })))
    }
  }

  async function fetchFavorites() {
    const { data } = await supabase
      .from('favorites')
      .select('lesson_id, lessons(title_ar)')
      .eq('user_id', user.id)

    if (data) {
      setFavorites(data.map(f => ({
        lesson_id: f.lesson_id,
        lesson_title: f.lessons?.title_ar || 'درس'
      })))
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>
  }

  const percentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>👤 ملفي الشخصي</h1>
      
      {/* معلومات المستخدم */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <div style={{ fontSize: '60px', textAlign: 'center', marginBottom: '20px' }}>👨‍🎓</div>
        <div style={{ marginBottom: '15px' }}>
          <strong>البريد الإلكتروني:</strong> {user.email}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>عضو منذ:</strong> {new Date(user.created_at).toLocaleDateString('ar-MA')}
        </div>
        
        {/* شريط التقدم */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>تقدمك في المنصة</span>
            <span>{stats.completed} / {stats.total} درس</span>
          </div>
          <div style={{
            background: '#e5e7eb',
            borderRadius: '10px',
            height: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${percentage}%`,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              height: '100%',
              transition: 'width 0.5s'
            }} />
          </div>
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
            {Math.round(percentage)}% من الدروس مكتملة
          </p>
        </div>
      </div>

      {/* الدروس المكتملة */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>✅ الدروس المكتملة</h2>
        {progress.length === 0 ? (
          <p style={{ color: '#666' }}>لم تكمل أي درس بعد. ابدأ التعلم الآن!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {progress.map((p, i) => (
              <li key={i} style={{
                padding: '10px 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Link to={`/courses/${p.lesson_id}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                  {p.lesson_title}
                </Link>
                <span style={{ color: '#999', fontSize: '12px' }}>
                  {new Date(p.completed_at).toLocaleDateString('ar-MA')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* الدروس المفضلة */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>⭐ الدروس المفضلة</h2>
        {favorites.length === 0 ? (
          <p style={{ color: '#666' }}>لا توجد دروس مفضلة. أضف دروساً إلى المفضلة!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {favorites.map((f, i) => (
              <li key={i} style={{
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <Link to={`/courses/${f.lesson_id}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                  ⭐ {f.lesson_title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '15px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        تسجيل الخروج
      </button>
    </div>
  )
}
