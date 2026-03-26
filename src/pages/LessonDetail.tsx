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
  const [isFavorite, setIsFavorite] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchLesson()
    fetchExercisesCount()
  }, [id])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      checkFavorite()
      checkProgress()
    }
  }

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

  async function checkFavorite() {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', id)
      .single()
    
    setIsFavorite(!!data)
  }

  async function checkProgress() {
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', id)
      .single()
    
    setIsCompleted(data?.is_completed || false)
  }

  async function toggleFavorite() {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      return
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('lesson_id', id)
      setIsFavorite(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, lesson_id: id })
      setIsFavorite(true)
    }
  }

  async function markComplete() {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      return
    }

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: id,
        is_completed: true,
        completed_at: new Date().toISOString()
      })

    if (!error) {
      setIsCompleted(true)
      alert('✅ تم إكمال الدرس بنجاح!')
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
      
      {/* أزرار المفضلة والإكمال */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button
          onClick={toggleFavorite}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '30px',
            cursor: 'pointer',
            color: isFavorite ? '#eab308' : '#ccc'
          }}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
        
        {!isCompleted && (
          <button
            onClick={markComplete}
            style={{
              background: '#10b981',
              color: 'white',
              padding: '8px 20px',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✅ إكمال الدرس
          </button>
        )}
        {isCompleted && (
          <span style={{
            background: '#d4edda',
            color: '#155724',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            ✅ تم الإكمال
          </span>
        )}
      </div>
      
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
    </div>
  )
}
