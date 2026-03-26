import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link } from 'react-router-dom'

interface LeaderboardUser {
  id: string
  username: string
  avatar: string
  total_points: number
  level: number
  lessons_completed: number
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState<'all' | 'weekly' | 'monthly'>('all')

  useEffect(() => {
    fetchLeaderboard()
    getCurrentUser()
  }, [timeFrame])

  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  async function fetchLeaderboard() {
    setLoading(true)
    
    let query = supabase
      .from('leaderboard')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(50)

    const { data, error } = await query
    
    if (!error && data) {
      setUsers(data)
    }
    setLoading(false)
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}`
  }

  const getAvatarBg = (index: number) => {
    if (index === 0) return 'linear-gradient(135deg, #ffd700, #ffb700)'
    if (index === 1) return 'linear-gradient(135deg, #c0c0c0, #a0a0a0)'
    if (index === 2) return 'linear-gradient(135deg, #cd7f32, #b87333)'
    return '#667eea'
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🏆</div>
        <h2>جاري تحميل التصنيف...</h2>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>
          🏆 لوحة الشرف
        </h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          أفضل الطلاب في منصة بوابة المعرفة المغربية
        </p>
      </div>

      {/* Top 3 Cards */}
      {users.length >= 3 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '50px'
        }}>
          {/* المركز الثاني */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            transform: 'translateY(20px)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🥈</div>
            <div style={{
              width: '80px',
              height: '80px',
              background: getAvatarBg(1),
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              margin: '0 auto 15px'
            }}>
              {users[1]?.avatar || '👨‍🎓'}
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '5px' }}>{users[1]?.username}</h3>
            <p style={{ color: '#667eea', fontWeight: 'bold', fontSize: '24px' }}>
              {users[1]?.total_points || 0}
            </p>
            <p style={{ color: '#666', fontSize: '12px' }}>مستوى {users[1]?.level}</p>
          </div>

          {/* المركز الأول */}
          <div style={{
            background: 'linear-gradient(135deg, #ffd700, #ffb700)',
            borderRadius: '20px',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
            transform: 'scale(1.05)'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '10px' }}>👑</div>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              margin: '0 auto 15px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
            }}>
              {users[0]?.avatar || '👨‍🎓'}
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '5px', color: '#333' }}>
              {users[0]?.username}
            </h3>
            <p style={{ fontWeight: 'bold', fontSize: '32px', color: '#333' }}>
              {users[0]?.total_points || 0}
            </p>
            <p style={{ color: '#666', fontSize: '14px' }}>مستوى {users[0]?.level}</p>
            <p style={{ background: 'rgba(0,0,0,0.1)', padding: '5px', borderRadius: '20px', marginTop: '10px', fontSize: '12px' }}>
              🏆 البطل 🏆
            </p>
          </div>

          {/* المركز الثالث */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            transform: 'translateY(20px)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🥉</div>
            <div style={{
              width: '80px',
              height: '80px',
              background: getAvatarBg(2),
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              margin: '0 auto 15px'
            }}>
              {users[2]?.avatar || '👨‍🎓'}
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '5px' }}>{users[2]?.username}</h3>
            <p style={{ color: '#667eea', fontWeight: 'bold', fontSize: '24px' }}>
              {users[2]?.total_points || 0}
            </p>
            <p style={{ color: '#666', fontSize: '12px' }}>مستوى {users[2]?.level}</p>
          </div>
        </div>
      )}

      {/* القائمة الكاملة */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          padding: '15px 20px',
          color: 'white',
          display: 'grid',
          gridTemplateColumns: '80px 1fr 100px 100px 120px',
          fontWeight: 'bold'
        }}>
          <div>الترتيب</div>
          <div>الطالب</div>
          <div>المستوى</div>
          <div>النقاط</div>
          <div>الدروس</div>
        </div>

        {users.map((user, index) => {
          const isCurrentUser = currentUser && user.id === currentUser.id
          return (
            <div
              key={user.id}
              style={{
                padding: '15px 20px',
                display: 'grid',
                gridTemplateColumns: '80px 1fr 100px 100px 120px',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                background: isCurrentUser ? '#e3f2fd' : 'white',
                transition: 'background 0.3s'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {index < 3 ? getRankIcon(index) : `#${index + 1}`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{user.avatar}</span>
                <span style={{ fontWeight: isCurrentUser ? 'bold' : 'normal' }}>
                  {user.username}
                  {isCurrentUser && <span style={{ fontSize: '12px', color: '#667eea', marginLeft: '5px' }}>(أنت)</span>}
                </span>
              </div>
              <div>مستوى {user.level}</div>
              <div style={{ fontWeight: 'bold', color: '#667eea', fontSize: '18px' }}>
                {user.total_points}
              </div>
              <div style={{ color: '#666' }}>{user.lessons_completed} درس</div>
            </div>
          )
        })}
      </div>

      {/* تشجيع */}
      {currentUser && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea20, #764ba220)',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <p>✨ كلما أكملت المزيد من الدروس، ترتفع نقاطك وتصعد في التصنيف! ✨</p>
          <Link to="/courses">
            <button style={{
              marginTop: '15px',
              padding: '10px 30px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer'
            }}>
              🚀 ابدأ التعلم الآن
            </button>
          </Link>
        </div>
      )}

      <Link to="/profile">
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
          ← العودة إلى الملف الشخصي
        </button>
      </Link>
    </div>
  )
}
