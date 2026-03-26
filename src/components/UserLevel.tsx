import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface UserStats {
  total_points: number
  level: number
  xp: number
  xp_to_next_level: number
  badges: string[]
}

export default function UserLevel() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      fetchUserStats()
    }
    setLoading(false)
  }

  async function fetchUserStats() {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!error && data) {
      setStats(data)
    } else if (error && error.code === 'PGRST116') {
      // إنشاء سجل جديد للمستخدم
      const { data: newData } = await supabase
        .from('user_points')
        .insert({
          user_id: user.id,
          total_points: 0,
          level: 1,
          xp: 0,
          xp_to_next_level: 100,
          badges: []
        })
        .select()
        .single()
      
      if (newData) setStats(newData)
    }
  }

  if (loading || !user) return null

  if (!stats) return null

  const progressPercent = (stats.xp / stats.xp_to_next_level) * 100

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '15px',
      padding: '15px 20px',
      color: 'white',
      minWidth: '200px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          🏆
        </div>
        <div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>المستوى</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.level}</div>
        </div>
        <div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>النقاط</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_points}</div>
        </div>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
          <span>XP: {stats.xp}</span>
          <span>للمستوى التالي: {stats.xp_to_next_level - stats.xp}</span>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '10px',
          height: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            background: '#ffd700',
            height: '100%',
            transition: 'width 0.5s'
          }} />
        </div>
      </div>

      {stats.badges && stats.badges.length > 0 && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {stats.badges.slice(0, 3).map((badge, i) => (
            <span key={i} style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '11px'
            }}>
              🏅 {badge}
            </span>
          ))}
          {stats.badges.length > 3 && (
            <span style={{ fontSize: '11px', opacity: 0.7 }}>+{stats.badges.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}
