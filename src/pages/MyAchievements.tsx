import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function MyAchievements() {
  const [badges, setBadges] = useState<any[]>([])
  const [userBadges, setUserBadges] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchBadges()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      const { data } = await supabase.from('user_points').select('badges').eq('user_id', user.id).single()
      if (data?.badges) setUserBadges(data.badges)
    }
    setLoading(false)
  }

  async function fetchBadges() {
    const { data } = await supabase.from('badges').select('*').order('id')
    if (data) setBadges(data)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>
  if (!user) return <div style={{ textAlign: 'center', padding: '100px' }}><Link to="/login">سجل دخولك</Link> لرؤية إنجازاتك</div>

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>🏅 إنجازاتي</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>الميداليات والشارات التي حصلت عليها</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {badges.map(badge => {
          const earned = userBadges.includes(badge.name_ar)
          return (
            <div key={badge.id} style={{
              background: earned ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'white',
              borderRadius: '20px',
              padding: '25px',
              textAlign: 'center',
              opacity: earned ? 1 : 0.6,
              transition: 'transform 0.3s'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '15px' }}>{badge.icon || '🏅'}</div>
              <h3 style={{ color: earned ? 'white' : '#333' }}>{badge.name_ar}</h3>
              <p style={{ fontSize: '14px', color: earned ? 'rgba(255,255,255,0.9)' : '#666' }}>{badge.description}</p>
              {earned && <div style={{ marginTop: '15px', fontSize: '12px', color: 'white' }}>✅ تم الإنجاز</div>}
            </div>
          )
        })}
      </div>

      <Link to="/profile">
        <button style={{ width: '100%', padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '30px' }}>← العودة للملف الشخصي</button>
      </Link>
    </div>
  )
}
