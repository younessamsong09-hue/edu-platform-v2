import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { addLessonPoints } from '../lib/gamification'

interface Lesson {
  id: number
  title: string
  title_ar: string
  description: string
  video_url: string
  content: string
  subject_id: number
  views: number
}

export default function LessonDetail() {
  const { id } = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [exercisesCount, setExercisesCount] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [hasRecordedView, setHasRecordedView] = useState(false)
  
  // نظام التقييم
  const [userRating, setUserRating] = useState<number | null>(null)
  const [averageRating, setAverageRating] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    checkUser()
    fetchLesson()
    fetchExercisesCount()
    fetchRatings()
  }, [id])

  // تسجيل مشاهدة عند تحميل الصفحة
  useEffect(() => {
    if (lesson && !hasRecordedView) {
      recordView()
    }
  }, [lesson])

  async function recordView() {
    if (!lesson || hasRecordedView) return
    
    const { error } = await supabase
      .from('lessons')
      .update({ views: (lesson.views || 0) + 1 })
      .eq('id', lesson.id)
    
    if (!error) {
      setHasRecordedView(true)
      setLesson({ ...lesson, views: (lesson.views || 0) + 1 })
    }
  }

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      checkFavorite()
      checkProgress()
      fetchUserRating()
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

  async function fetchRatings() {
    const { data } = await supabase
      .from('lesson_ratings')
      .select('rating')
      .eq('lesson_id', id)
    
    if (data && data.length > 0) {
      const sum = data.reduce((acc, curr) => acc + curr.rating, 0)
      setAverageRating(sum / data.length)
      setRatingCount(data.length)
    }
  }

  async function fetchUserRating() {
    if (!user) return
    
    const { data } = await supabase
      .from('lesson_ratings')
      .select('rating')
      .eq('user_id', user.id)
      .eq('lesson_id', id)
      .single()
    
    if (data) {
      setUserRating(data.rating)
    }
  }

  async function submitRating(rating: number) {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      return
    }

    const { error } = await supabase
      .from('lesson_ratings')
      .upsert({
        user_id: user.id,
        lesson_id: id,
        rating: rating,
        updated_at: new Date().toISOString()
      })

    if (!error) {
      setUserRating(rating)
      fetchRatings()
      alert('شكراً لتقييمك! ⭐')
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
      
      // إضافة نقاط لإكمال الدرس
      if (lesson) {
        await addLessonPoints(user.id, parseInt(id as string), lesson.title_ar)
      }
      
      alert('✅ تم إكمال الدرس بنجاح! +50 نقطة')
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

  const renderStars = (rating: number, interactive = false) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive ? i <= (hoverRating || userRating || 0) : i <= rating
      stars.push(
        <span
          key={i}
          onClick={() => interactive && submitRating(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          style={{
            fontSize: '28px',
            cursor: interactive ? 'pointer' : 'default',
            color: isFilled ? '#fbbf24' : '#e5e7eb',
            transition: 'transform 0.2s',
            display: 'inline-block'
          }}
        >
          ★
        </span>
      )
    }
    return stars
  }

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K'
    }
    return views.toString()
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <Link to={`/courses/${lesson.subject_id}`} style={{ color: '#667eea', textDecoration: 'none' }}>
        ← العودة إلى المادة
      </Link>
      
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
            ✅ إكمال الدرس (+50 نقطة)
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
      
      <div style={{
        background: '#f9fafb',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>👁️</span>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
              {formatViews(lesson.views || 0)}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>مشاهدة</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
              {averageRating.toFixed(1)}
            </div>
            <div>{renderStars(averageRating)}</div>
          </div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            {ratingCount} تقييم
          </div>
        </div>
        
        {user && (
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              {userRating ? 'تقييمك:' : 'قيم هذا الدرس:'}
            </div>
            <div>{renderStars(userRating || 0, true)}</div>
          </div>
        )}
      </div>
      
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '30px' }}>
        {lesson.description}
      </p>
      
      {lesson.video_url && lesson.video_url !== '' && (
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
      
      {lesson.content && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '20px',
          lineHeight: '1.8'
        }}>
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
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
