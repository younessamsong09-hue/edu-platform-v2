import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Lesson {
  id: number
  title: string
  title_ar: string
  description: string
  video_url: string
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

  useEffect(() => {
    fetchSubject()
    fetchLessons()
  }, [id])

  async function fetchSubject() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      setSubject(data)
    }
  }

  async function fetchLessons() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('subject_id', id)
      .eq('is_published', true)
      .order('chapter')
      .order('order_num')

    if (!error && data) {
      setLessons(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>جاري تحميل الدروس...</h2>
      </div>
    )
  }

  if (!subject) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>المادة غير موجودة</h2>
        <Link to="/courses">العودة إلى المواد</Link>
      </div>
    )
  }

  const lessonsByChapter = lessons.reduce((acc, lesson) => {
    const chapter = lesson.chapter
    if (!acc[chapter]) acc[chapter] = []
    acc[chapter].push(lesson)
    return acc
  }, {} as Record<number, Lesson[]>)

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <Link to="/courses" style={{ color: '#667eea', textDecoration: 'none' }}>
        ← العودة إلى المواد
      </Link>

      <div style={{
        background: `linear-gradient(135deg, ${subject.color || '#667eea'} 0%, ${subject.color || '#764ba2'} 100%)`,
        color: 'white',
        padding: '40px',
        borderRadius: '20px',
        marginTop: '20px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '10px' }}>{subject.icon}</div>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{subject.name_ar}</h1>
      </div>

      {lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '15px' }}>
          <p>لا توجد دروس متاحة حالياً لهذه المادة. سيتم إضافتها قريباً.</p>
        </div>
      ) : (
        Object.keys(lessonsByChapter).sort().map(chapterNum => (
          <div key={chapterNum} style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '24px',
              color: '#333',
              marginBottom: '15px',
              borderRight: `4px solid ${subject.color || '#667eea'}`,
              paddingRight: '15px'
            }}>
              الفصل {chapterNum}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lessonsByChapter[chapterNum].map(lesson => (
                <Link to={`/courses/lesson/${lesson.id}`} key={lesson.id} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    borderRight: `3px solid ${subject.color || '#667eea'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '5px', color: '#333' }}>{lesson.title_ar}</h3>
                        <p style={{ fontSize: '14px', color: '#666' }}>{lesson.description?.substring(0, 100)}...</p>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#999' }}>👁️ {lesson.views || 0}</span>
                        <span style={{
                          background: subject.color || '#667eea',
                          color: 'white',
                          padding: '5px 15px',
                          borderRadius: '20px',
                          fontSize: '12px'
                        }}>
                          {lesson.level === 'jtm' ? 'جذع مشترك' : lesson.level === '1bac' ? '1باك' : '2باك'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
