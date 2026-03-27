import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Comment {
  id: string
  user_id: string
  content: string
  likes: number
  created_at: string
  users?: { email: string }
}

export default function Comments({ lessonId }: { lessonId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchComments()
  }, [lessonId])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, users(email)')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false })
    
    if (data) setComments(data)
    setLoading(false)
  }

  async function submitComment() {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      return
    }

    if (!newComment.trim()) return

    await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        content: newComment.trim()
      })

    setNewComment('')
    fetchComments()
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>جاري تحميل التعليقات...</div>
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>💬 التعليقات ({comments.length})</h3>

      {user ? (
        <div style={{ marginBottom: '20px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="اكتب تعليقك..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              minHeight: '80px',
              marginBottom: '10px',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={submitComment}
            style={{
              padding: '8px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            نشر التعليق
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', background: '#f3f4f6', borderRadius: '10px' }}>
          <Link to="/login" style={{ color: '#667eea' }}>سجل دخولك</Link> لتضيف تعليقاً
        </div>
      )}

      {comments.map(comment => (
        <div key={comment.id} style={{
          background: '#f9fafb',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '10px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            {comment.users?.email?.split('@')[0] || 'مستخدم'}
          </div>
          <p style={{ marginBottom: '5px' }}>{comment.content}</p>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {new Date(comment.created_at).toLocaleDateString('ar-MA')}
          </div>
        </div>
      ))}
    </div>
  )
}
