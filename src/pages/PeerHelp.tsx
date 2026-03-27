import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link } from 'react-router-dom'

interface HelpRequest {
  id: string
  question: string
  created_at: string
  asker: { email: string }
  answer?: string
  helper?: { email: string }
  status: string
  points_awarded: number
}

export default function PeerHelp() {
  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchRequests()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function fetchRequests() {
    const { data } = await supabase
      .from('peer_help')
      .select('*, asker:users!asker_id(email), helper:users!helper_id(email)')
      .order('created_at', { ascending: false })
    
    if (data) setRequests(data)
    setLoading(false)
  }

  async function submitQuestion() {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      return
    }

    if (!newQuestion.trim()) return

    await supabase
      .from('peer_help')
      .insert({
        asker_id: user.id,
        question: newQuestion,
        status: 'pending'
      })

    setNewQuestion('')
    fetchRequests()
  }

  async function answerQuestion(id: string, answer: string) {
    if (!user) return

    const answerText = prompt('أدخل إجابتك:')
    if (!answerText) return

    await supabase
      .from('peer_help')
      .update({
        helper_id: user.id,
        answer: answerText,
        status: 'answered',
        answered_at: new Date().toISOString(),
        points_awarded: 10
      })
      .eq('id', id)

    // إضافة نقاط للمساعد
    await supabase.rpc('add_points', {
      user_id: user.id,
      points: 10,
      reason: 'مساعدة زميل'
    })

    fetchRequests()
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
        🤝 ساعد زملائك
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        اطرح سؤالاً أو ساعد زميلاً واحصل على نقاط
      </p>

      {/* نموذج سؤال جديد */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="ما الذي تواجه صعوبة في فهمه؟"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            minHeight: '100px',
            marginBottom: '10px',
            fontFamily: 'inherit'
          }}
        />
        <button
          onClick={submitQuestion}
          disabled={!newQuestion.trim()}
          style={{
            padding: '10px 20px',
            background: !newQuestion.trim() ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: !newQuestion.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          نشر السؤال
        </button>
      </div>

      {/* قائمة الأسئلة */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {requests.map(req => (
          <div key={req.id} style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>{req.asker?.email?.split('@')[0]}</span>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {new Date(req.created_at).toLocaleDateString('ar-MA')}
              </span>
            </div>
            <p style={{ marginBottom: '15px' }}>{req.question}</p>
            
            {req.answer ? (
              <div style={{
                background: '#f3f4f6',
                padding: '15px',
                borderRadius: '10px',
                marginTop: '10px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  إجابة من {req.helper?.email?.split('@')[0]}:
                </div>
                <p>{req.answer}</p>
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '5px' }}>
                  ✓ حصل المساعد على {req.points_awarded} نقطة
                </div>
              </div>
            ) : (
              user && user.id !== req.asker_id && (
                <button
                  onClick={() => answerQuestion(req.id, '')}
                  style={{
                    padding: '8px 20px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🤝 ساعد زميلك
                </button>
              )
            )}
          </div>
        ))}
      </div>

      <Link to="/">
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
          ← العودة للرئيسية
        </button>
      </Link>
    </div>
  )
}
