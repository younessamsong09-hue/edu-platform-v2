import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link } from 'react-router-dom'

export default function Pathfinder() {
  const [progress, setProgress] = useState({
    math: { completed: 0, total: 35, percentage: 0 },
    physics: { completed: 0, total: 27, percentage: 0 },
    arabic: { completed: 0, total: 19, percentage: 0 },
    nextLessons: [] as any[]
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      await fetchProgress()
    }
    setLoading(false)
  }

  async function fetchProgress() {
    // جلب الدروس المكتملة
    const { data: completed } = await supabase
      .from('user_progress')
      .select('lesson_id, lessons(subject_id)')
      .eq('user_id', user.id)
      .eq('is_completed', true)

    // حساب النسب لكل مادة
    const mathCompleted = completed?.filter(p => p.lessons?.subject_id === 1).length || 0
    const physicsCompleted = completed?.filter(p => p.lessons?.subject_id === 2).length || 0
    const arabicCompleted = completed?.filter(p => p.lessons?.subject_id === 3).length || 0

    // جلب الدروس القادمة
    const { data: nextLessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('is_published', true)
      .order('subject_id')
      .order('chapter')
      .order('order_num')
      .limit(5)

    setProgress({
      math: { completed: mathCompleted, total: 35, percentage: (mathCompleted / 35) * 100 },
      physics: { completed: physicsCompleted, total: 27, percentage: (physicsCompleted / 27) * 100 },
      arabic: { completed: arabicCompleted, total: 19, percentage: (arabicCompleted / 19) * 100 },
      nextLessons: nextLessons || []
    })
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>جاري تحميل مسارك...</div>
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', background: '#fef3c7', borderRadius: '15px' }}>
        🔐 <Link to="/login" style={{ color: '#667eea' }}>سجل دخولك</Link> لترى خريطة طريقك الشخصية
      </div>
    )
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ marginBottom: '15px' }}>🗺️ خريطة طريقك الدراسية</h3>
      
      {/* الرياضيات */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>📐 الرياضيات</span>
          <span>{progress.math.completed}/{progress.math.total} درس</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
          <div style={{
            width: `${progress.math.percentage}%`,
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            height: '100%',
            transition: 'width 0.5s'
          }} />
        </div>
      </div>

      {/* الفيزياء */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>⚛️ الفيزياء</span>
          <span>{progress.physics.completed}/{progress.physics.total} درس</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
          <div style={{
            width: `${progress.physics.percentage}%`,
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            height: '100%'
          }} />
        </div>
      </div>

      {/* العربية */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>📖 اللغة العربية</span>
          <span>{progress.arabic.completed}/{progress.arabic.total} درس</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
          <div style={{
            width: `${progress.arabic.percentage}%`,
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            height: '100%'
          }} />
        </div>
      </div>

      {/* الدروس القادمة */}
      <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>📚 دروس مقترحة لك:</div>
        {progress.nextLessons.map(lesson => (
          <Link key={lesson.id} to={`/courses/lesson/${lesson.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '10px',
              background: '#f3f4f6',
              borderRadius: '10px',
              marginBottom: '8px',
              transition: 'transform 0.2s'
            }}>
              {lesson.title_ar}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
