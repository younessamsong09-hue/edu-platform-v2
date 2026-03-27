import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface Comment {
  id: string
  user_id: string
  lesson_id: number
  content: string
  likes: number
  created_at: string
  users?: {
    email: string
    username?: string
  }
}

interface CommentsProps {
  lessonId: number
}

export default function Comments({ lessonId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    
    if (data) setComments(data)
    setLoading(false)
  }

  async function submitComment() {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      return
    }

    if (!newComment.trim()) {
      alert('الرجاء كتابة تعليق')
      return
    }

    setSubmitting(true)

    const { error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        content: newComment.trim()
      })

    if (!error) {
      setNewComment('')
      fetchComments()
    } else {
      alert('حدث خطأ في إضافة التعليق')
    }

    setSubmitting(false)
  }

  async function likeComment(commentId: string) {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      return
    }

    const { error } = await supabase
      .from('comments')
      .update({ likes: (comments.find(c => c.id === commentId)?.likes || 0) + 1 })
      .eq('id', commentId)

    if (!error) {
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
      ))
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUsername = (email: string) => {
    return email.split('@')[0]
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <span>جاري تحميل التعليقات...</span>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>
        💬 التعليقات ({comments.length})
      </h3>

      {/* نموذج إضافة تعليق */}
      {user ? (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="اكتب تعليقك هنا..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #ddd',
              resize: 'vertical',
              fontSize: '14px',
              fontFamily: 'inherit',
              minHeight: '80px',
              marginBottom: '10px'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={submitComment}
              disabled={submitting || !newComment.trim()}
              style={{
                padding: '8px 20px',
                background: !newComment.trim() ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: !newComment.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {submitting ? 'جاري...' : 'نشر التعليق'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#f3f4f6',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '25px'
        }}>
          <p style={{ marginBottom: '10px' }}>🔐 سجل دخولك لتضيف تعليقاً</p>
          <Link to="/login">
            <button style={{
              padding: '8px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer'
            }}>
              تسجيل الدخول
            </button>
          </Link>
        </div>
      )}

      {/* قائمة التعليقات */}
      {comments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f9fafb',
          borderRadius: '15px',
          color: '#666'
        }}>
          💬 لا توجد تعليقات بعد. كن أول من يعلق!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {comments.map(comment => (
            <div key={comment.id} style={{
              background: 'white',
              borderRadius: '15px',
              padding: '15px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '35px',
                    height: '35px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {getUsername(comment.users?.email || 'مستخدم')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {getUsername(comment.users?.email || 'مستخدم')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999' }}>
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => likeComment(comment.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  ❤️ {comment.likes || 0}
                </button>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333', marginTop: '5px' }}>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
