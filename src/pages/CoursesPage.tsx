import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Subject {
  id: number
  name: string
  name_ar: string
  icon: string
  color: string
  level: string
}

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLevel, setActiveLevel] = useState('all')

  const levels = [
    { value: 'all', label: 'الكل', icon: '📚' },
    { value: 'jtm', label: 'الجذع المشترك', icon: '🎓' },
    { value: '1bac', label: 'الأولى باك', icon: '📖' },
    { value: '2bac', label: 'الثانية باك', icon: '🎯' }
  ]

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    const { data } = await supabase.from('subjects').select('*').order('id')
    if (data) setSubjects(data)
    setLoading(false)
  }

  const filteredSubjects = subjects.filter(s => activeLevel === 'all' || s.level === activeLevel || s.level === 'all')

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', paddingBottom: '70px' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', color: 'white' }}>📚 المواد الدراسية</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>اختر المادة التي تريد دراستها</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', padding: '15px', background: 'white', flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 100 }}>
        {levels.map(level => (
          <button
            key={level.value}
            onClick={() => setActiveLevel(level.value)}
            style={{
              padding: '8px 20px',
              background: activeLevel === level.value ? '#667eea' : '#f3f4f6',
              color: activeLevel === level.value ? 'white' : '#333',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{level.icon}</span>
            <span>{level.label}</span>
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredSubjects.map(subject => (
            <Link to={`/courses/${subject.id}`} key={subject.id} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '20px', padding: '25px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '48px' }}>{subject.icon}</div>
                <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#333' }}>{subject.name_ar}</h3>
                <button style={{ padding: '8px 20px', background: subject.color || '#667eea', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer' }}>استكشف →</button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
