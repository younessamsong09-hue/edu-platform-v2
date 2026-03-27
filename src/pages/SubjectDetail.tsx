import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Lesson {
  id: number
  title: string
  title_ar: string
  description: string
  level: string
  chapter: number
  views: number
}

interface Subject {
  id: number
  name: string
  name_ar: string
  icon: string
  color: string
  description: string
}

export default function SubjectDetail() {
  const { id } = useParams()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchSubject()
    fetchLessons()
  }, [id])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      const { data } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('is_completed', true)
      
      if (data) setCompletedLessons(data.map(p => p.lesson_id))
    }
  }

  async function fetchSubject() {
    const { data } = await supabase.from('subjects').select('*').eq('id', id).single()
    if (data) setSubject(data)
  }

  async function fetchLessons() {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('subject_id', id)
      .eq('is_published', true)
      .order('chapter')
      .order('order_num')
    
    if (data) setLessons(data)
    setLoading(false)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري تحميل الدروس...</div>
  if (!subject) return <div style={{ textAlign: 'center', padding: '100px' }}>المادة غير موجودة</div>

  const lessonsByChapter = lessons.reduce((acc, l) => {
    if (!acc[l.chapter]) acc[l.chapter] = []
    acc[l.chapter].push(l)
    return acc
  }, {} as Record<number, Lesson[]>)

  const totalLessons = lessons.length
  const completedCount = completedLessons.length
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', paddingBottom: '80px' }}>
      <Link to="/courses" style={{ color: '#667eea', textDecoration: 'none' }}>← العودة إلى المواد</Link>

      <div style={{
        background: `linear-gradient(135deg, ${subject.color || '#667eea'} 0%, ${subject.color || '#764ba2'} 100%)`,
        color: 'white',
        padding: '40px',
        borderRadius: '20px',
        marginTop: '20px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px' }}>{subject.icon}</div>
        <h1 style={{ fontSize: '32px' }}>{subject.name_ar}</h1>
        <p>{subject.description}</p>
      </div>

      {/* شريط التقدم */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>📊 تقدمك</span>
          <span>{completedCount}/{totalLessons} درس</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: subject.color || '#667eea', height: '100%', transition: 'width 0.5s' }} />
        </div>
      </div>

      {Object.keys(lessonsByChapter).sort().map(chapterNum => (
        <div key={chapterNum} style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', borderRight: `4px solid ${subject.color}`, paddingRight: '15px' }}>الفصل {chapterNum}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lessonsByChapter[chapterNum].map(lesson => (
              <Link to={`/courses/lesson/${lesson.id}`} key={lesson.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  borderRight: `3px solid ${completedLessons.includes(lesson.id) ? '#10b981' : subject.color}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', color: '#333' }}>{lesson.title_ar}</h3>
                    <span style={{ fontSize: '12px', color: '#999' }}>👁️ {lesson.views || 0}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666' }}>{lesson.description?.substring(0, 100)}...</p>
                  {completedLessons.includes(lesson.id) && <span style={{ fontSize: '12px', color: '#10b981' }}>✅ مكتمل</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
