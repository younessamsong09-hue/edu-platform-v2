import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Lesson {
  id: number
  title: string
  title_ar: string
  description: string
  video_url: string
  content: string
  subject_id: number
}

export default function LessonDetail() {
  const { id } = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [exercisesCount, setExercisesCount] = useState(0)

  useEffect(() => {
    fetchLesson()
    fetchExercisesCount()
  }, [id])

  async function fetchLesson() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      setLesson(data)
    }
    setLoading(false)
  }

  async function fetchExercisesCount() {
    const { count, error } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true })
      .eq('lesson_id', id)

    if (!error && count) {
      setExercisesCount(count)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>جاري تحميل الدرس...</h2>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>الدرس غير موجود</h2>
        <Link to="/courses">العودة إلى الدروس</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <Link to="/courses" style={{ color: '#667eea', textDecoration: 'none' }}>
        ← العودة إلى الدروس
      </Link>
      
      <h1 style={{ fontSize: '32px', margin: '20px 0', color: '#333' }}>
        {lesson.title_ar}
      </h1>
      
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '30px' }}>
        {lesson.description}
      </p>
      
      {lesson.video_url && (
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          marginBottom: '30px'
        }}>
          <iframe
            src={lesson.video_url}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '12px'
            }}
            allowFullScreen
            title={lesson.title_ar}
          />
        </div>
      )}
      
      {/* زر حل التمارين */}
      <Link to={`/exercises/${lesson.id}`}>
        <button style={{
          width: '100%',
          padding: '15px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '18px',
          cursor: 'pointer',
          marginTop: '20px',
          fontWeight: 'bold'
        }}>
          📝 حل التمارين {exercisesCount > 0 ? `(${exercisesCount} تمرين)` : ''}
        </button>
      </Link>
      
      {lesson.content && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginTop: '30px',
          lineHeight: '1.8'
        }}>
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      )}
    </div>
  )
}
