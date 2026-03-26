import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

interface LessonStats {
  id: number
  title_ar: string
  views: number
  avg_rating: number
  rating_count: number
  completions: number
  subject_name: string
}

interface SubjectStats {
  id: number
  name_ar: string
  lessons_count: number
  total_views: number
  total_completions: number
  avg_rating: number
}

export default function AdminStats() {
  const [lessonStats, setLessonStats] = useState<LessonStats[]>([])
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAdmin()
    fetchStats()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'admin@example.com') {
      navigate('/')
    }
    setUser(user)
  }

  async function fetchStats() {
    setLoading(true)

    // جلب إحصائيات الدروس
    const { data: lessons } = await supabase
      .from('lessons')
      .select(`
        id,
        title_ar,
        views,
        subject_id,
        subjects (name_ar)
      `)
      .eq('is_published', true)

    // جلب التقييمات لكل درس
    const { data: ratings } = await supabase
      .from('lesson_ratings')
      .select('lesson_id, rating')

    // جلب إكمالات الدروس
    const { data: completions } = await supabase
      .from('user_progress')
      .select('lesson_id')
      .eq('is_completed', true)

    // حساب الإحصائيات لكل درس
    const ratingsMap = new Map()
    ratings?.forEach(r => {
      const current = ratingsMap.get(r.lesson_id) || { sum: 0, count: 0 }
      ratingsMap.set(r.lesson_id, {
        sum: current.sum + r.rating,
        count: current.count + 1
      })
    })

    const completionsMap = new Map()
    completions?.forEach(c => {
      completionsMap.set(c.lesson_id, (completionsMap.get(c.lesson_id) || 0) + 1)
    })

    const lessonStatsData = lessons?.map(lesson => {
      const rating = ratingsMap.get(lesson.id) || { sum: 0, count: 0 }
      return {
        id: lesson.id,
        title_ar: lesson.title_ar,
        views: lesson.views || 0,
        avg_rating: rating.count > 0 ? rating.sum / rating.count : 0,
        rating_count: rating.count,
        completions: completionsMap.get(lesson.id) || 0,
        subject_name: lesson.subjects?.name_ar || 'غير محدد'
      }
    }).sort((a, b) => b.views - a.views) || []

    setLessonStats(lessonStatsData)

    // حساب إحصائيات المواد
    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, name_ar')
      .order('id')

    const subjectStatsData = subjects?.map(subject => {
      const subjectLessons = lessonStatsData.filter(l => l.subject_name === subject.name_ar)
      return {
        id: subject.id,
        name_ar: subject.name_ar,
        lessons_count: subjectLessons.length,
        total_views: subjectLessons.reduce((sum, l) => sum + l.views, 0),
        total_completions: subjectLessons.reduce((sum, l) => sum + l.completions, 0),
        avg_rating: subjectLessons.length > 0 
          ? subjectLessons.reduce((sum, l) => sum + l.avg_rating, 0) / subjectLessons.length 
          : 0
      }
    }) || []

    setSubjectStats(subjectStatsData)
    setLoading(false)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const totalViews = lessonStats.reduce((sum, l) => sum + l.views, 0)
  const totalCompletions = lessonStats.reduce((sum, l) => sum + l.completions, 0)
  const totalLessons = lessonStats.length
  const avgOverallRating = lessonStats.reduce((sum, l) => sum + l.avg_rating, 0) / totalLessons || 0

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري تحميل الإحصائيات...</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>📊 لوحة الإحصائيات المتقدمة</h1>

      {/* البطاقات الرئيسية */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '25px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📚</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalLessons}</div>
          <div>إجمالي الدروس</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '25px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>👁️</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{formatNumber(totalViews)}</div>
          <div>إجمالي المشاهدات</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '25px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{formatNumber(totalCompletions)}</div>
          <div>إكمالات الدروس</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          padding: '25px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>⭐</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{avgOverallRating.toFixed(1)}</div>
          <div>متوسط التقييم</div>
        </div>
      </div>

      {/* إحصائيات المواد */}
      <h2 style={{ marginBottom: '20px', color: '#333' }}>📖 إحصائيات المواد</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {subjectStats.map(subject => (
          <div key={subject.id} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#667eea' }}>{subject.name_ar}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>📚 الدروس:</span>
              <strong>{subject.lessons_count}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>👁️ المشاهدات:</span>
              <strong>{formatNumber(subject.total_views)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>✅ الإكمالات:</span>
              <strong>{formatNumber(subject.total_completions)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>⭐ التقييم:</span>
              <strong>{subject.avg_rating.toFixed(1)} / 5</strong>
            </div>
          </div>
        ))}
      </div>

      {/* ترتيب الدروس الأكثر مشاهدة */}
      <h2 style={{ marginBottom: '20px', color: '#333' }}>🏆 الدروس الأكثر مشاهدة</h2>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '40px'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', textAlign: 'right' }}>
              <th style={{ padding: '15px' }}>#</th>
              <th style={{ padding: '15px' }}>الدرس</th>
              <th style={{ padding: '15px' }}>المادة</th>
              <th style={{ padding: '15px' }}>المشاهدات</th>
              <th style={{ padding: '15px' }}>الإكمالات</th>
              <th style={{ padding: '15px' }}>التقييم</th>
            </tr>
          </thead>
          <tbody>
            {lessonStats.slice(0, 10).map((lesson, index) => (
              <tr key={lesson.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{index + 1}</td>
                <td style={{ padding: '15px' }}>{lesson.title_ar}</td>
                <td style={{ padding: '15px' }}>{lesson.subject_name}</td>
                <td style={{ padding: '15px' }}>{formatNumber(lesson.views)}</td>
                <td style={{ padding: '15px' }}>{formatNumber(lesson.completions)}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ color: '#fbbf24' }}>⭐</span> {lesson.avg_rating.toFixed(1)}
                  <span style={{ fontSize: '12px', color: '#999' }}> ({lesson.rating_count})</span>
                </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* زر تحديث */}
      <button
        onClick={fetchStats}
        style={{
          width: '100%',
          padding: '12px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        🔄 تحديث الإحصائيات
      </button>
    </div>
  )
}
