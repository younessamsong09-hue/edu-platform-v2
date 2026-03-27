import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link } from 'react-router-dom'

interface Neighborhood {
  neighborhood: string
  total_points: number
  students_count: number
  avg_score: number
}

export default function NeighborhoodLeaderboard() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from('neighborhood_scores')
      .select('*')
      .order('total_points', { ascending: false })
    
    if (data) setNeighborhoods(data)
    setLoading(false)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري تحميل التصنيف...</div>
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px', textAlign: 'center' }}>
        🏆 تصنيف الأحياء
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        منافسة بين أحياء تاوريرت
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {neighborhoods.map((hood, index) => (
          <div key={hood.neighborhood} style={{
            background: index === 0 ? 'linear-gradient(135deg, #ffd700, #ffb700)' : 'white',
            borderRadius: '15px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                width: '50px',
                textAlign: 'center'
              }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{hood.neighborhood}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{hood.students_count} طالب</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                {hood.total_points}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>نقطة</div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/">
        <button style={{
          marginTop: '40px',
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
