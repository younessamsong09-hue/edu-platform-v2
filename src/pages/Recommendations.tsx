import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Recommendation {
  id: string
  lesson_id: number
  reason: string
  score: number
  is_viewed: boolean
  lessons: {
    id: number
    title_ar: string
    description: string
    subject_id: number
    views: number
  }
}

interface Subject {
  id: number
  name_ar: string
  icon: string
  color: string
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchSubjects()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      generateRecommendations()
      fetchRecommendations()
    } else {
      setLoading(false)
    }
  }

  async function generateRecommendations() {
    await supabase.rpc('generate_recommendations', { p_user_id: user.id })
  }

  async function fetchRecommendations() {
    const { data } = await supabase
      .from('recommendations')
      .select('*, lessons(*)')
      .eq('user_id', user.id)
      .order('score', { ascending: false })
      .limit(10)
    
    if (data) setRecommendations(data)
    setLoading(false)
  }

  async function fetchSubjects() {
    const { data } = await supabase
      .from('subjects')
      .select('id, name_ar, icon, color')
    
    if (data) setSubjects(data)
  }

  async function markAsViewed(id: string) {
    await supabase
      .from('recommendations')
      .update({ is_viewed: true })
      .eq('id', id)
  }

  const getSubjectInfo = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId) || { name_ar: 'عام', icon: '📚', color: '#667eea' }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return '#10b981'
    if (score >= 0.7) return '#f59e0b'
    return '#667eea'
  }

  const getScoreText = (score: number) => {
    if (score >= 0.9) return 'توصية قوية'
    if (score >= 0.7) return 'توصية جيدة'
    return 'توصية'
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🤖</div>
        <h2>جاري تحليل مستواك وتقديم توصيات...</h2>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔐</div>
        <h2>يرجى تسجيل الدخول</h2>
        <p style={{ margin: '20px 0', color: '#666' }}>سجل دخولك للحصول على توصيات مخصصة حسب مستواك</p>
        <Link to="/login">
          <button style={{
            padding: '12px 30px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}>
            تسجيل الدخول
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
        🤖 توصيات مخصصة لك
      </h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        بناءً على مستواك واهتماماتك، هذه الدروس تناسبك
      </p>

      {recommendations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📚</div>
          <h3>لا توجد توصيات حالياً</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>
            أكمل بعض الدروس أولاً وسنقدم لك توصيات مخصصة
          </p>
          <Link to="/courses">
            <button style={{
              marginTop: '20px',
              padding: '10px 25px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              استكشف الدروس
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {recommendations.map((rec) => {
            const subject = getSubjectInfo(rec.lessons.subject_id)
            return (
              <Link
                key={rec.id}
                to={`/courses/lesson/${rec.lessons.id}`}
                onClick={() => markAsViewed(rec.id)}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s',
                  borderRight: `4px solid ${getScoreColor(rec.score)}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{subject.icon}</span>
                        <span style={{
                          background: getScoreColor(rec.score),
                          color: 'white',
                          padding: '2px 10px',
                          borderRadius: '20px',
                          fontSize: '12px'
                        }}>
                          {getScoreText(rec.score)}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>
                        {rec.lessons.title_ar}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                        {rec.lessons.description?.substring(0, 100)}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '12px', color: '#999' }}>
                        <span>📖 {subject.name_ar}</span>
                        <span>👁️ {rec.lessons.views || 0} مشاهدة</span>
                      </div>
                    </div>
                    <div style={{
                      background: '#f3f4f6',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      minWidth: '80px'
                    }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>تطابق</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: getScoreColor(rec.score) }}>
                        {Math.round(rec.score * 100)}%
                      </div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '12px',
                    padding: '8px',
                    background: '#fef3c7',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#92400e'
                  }}>
                    💡 {rec.reason}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <Link to="/courses">
        <button style={{
          marginTop: '30px',
          width: '100%',
          padding: '12px',
          background: '#f3f4f6',
          color: '#333',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}>
          ← استكشاف جميع الدروس
        </button>
      </Link>
    </div>
  )
}
