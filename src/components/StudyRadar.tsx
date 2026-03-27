import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function StudyRadar() {
  const [activities, setActivities] = useState<any[]>([])
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchActivities() {
    const { data } = await supabase
      .from('live_activities')
      .select('*, users(username, neighborhood)')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (data) setActivities(data)
    
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('live_activities')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', fiveMinsAgo)
    
    setOnlineCount(count || 0)
  }

  if (activities.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'white',
      borderRadius: '15px',
      padding: '12px 18px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxWidth: '280px',
      borderRight: '3px solid #667eea'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span>📡</span>
        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>رادار الطلاب</span>
        <span style={{ background: '#10b98120', color: '#10b981', padding: '2px 8px', borderRadius: '20px', fontSize: '11px' }}>
          {onlineCount} نشيط
        </span>
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        {activities.slice(0, 2).map(activity => (
          <div key={activity.id} style={{ marginBottom: '5px' }}>
            🧑‍🎓 {activity.users?.username?.split('@')[0] || 'طالب'} يدرس
          </div>
        ))}
      </div>
    </div>
  )
}
