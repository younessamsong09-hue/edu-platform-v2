import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link } from 'react-router-dom'

interface StudySession {
  id: string
  user_id: string
  subject_id: number
  start_time: string
  user_email: string
}

export default function StudyBuddy() {
  const [activeSessions, setActiveSessions] = useState<StudySession[]>([])
  const [mySession, setMySession] = useState<any>(null)
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    checkUser()
    fetchActiveSessions()
    
    const interval = setInterval(() => {
      if (mySession) {
        setTimer(prev => prev + 1)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [mySession])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      checkMySession()
    }
  }

  async function checkMySession() {
    const { data } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()
    
    if (data) setMySession(data)
  }

  async function fetchActiveSessions() {
    const { data } = await supabase
      .from('study_sessions')
      .select('*, users(email)')
      .eq('is_active', true)
      .neq('user_id', user?.id || '')
    
    if (data) setActiveSessions(data)
  }

  async function startSession() {
    if (!selectedSubject) {
      alert('اختر مادة أولاً')
      return
    }

    const { data } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.id,
        subject_id: selectedSubject,
        is_active: true
      })
      .select()
      .single()
    
    setMySession(data)
    setTimer(0)
    fetchActiveSessions()
  }

  async function endSession() {
    await supabase
      .from('study_sessions')
      .update({ is_active: false, end_time: new Date().toISOString() })
      .eq('id', mySession.id)
    
    setMySession(null)
    fetchActiveSessions()
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', background: '#fef3c7', borderRadius: '15px' }}>
        🔐 <Link to="/login">سجل دخولك</Link> لتجد شريكاً للدراسة
      </div>
    )
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ marginBottom: '15px' }}>👥 شركاء الدراسة</h3>
      
      {mySession ? (
        <div style={{ background: '#10b98120', padding: '15px', borderRadius: '15px', marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>📚 أنت تدرس الآن</div>
          <div>⏱️ {formatTime(timer)}</div>
          <button
            onClick={endSession}
            style={{
              marginTop: '10px',
              padding: '8px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            إنهاء الجلسة
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '15px' }}>
          <select
            onChange={(e) => setSelectedSubject(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              marginBottom: '10px'
            }}
          >
            <option value="">اختر المادة</option>
            <option value="1">الرياضيات</option>
            <option value="2">الفيزياء</option>
            <option value="3">العربية</option>
          </select>
          <button
            onClick={startSession}
            disabled={!selectedSubject}
            style={{
              width: '100%',
              padding: '10px',
              background: !selectedSubject ? '#ccc' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: !selectedSubject ? 'not-allowed' : 'pointer'
            }}
          >
            🚀 ابدأ جلسة دراسة
          </button>
        </div>
      )}

      {activeSessions.length > 0 && (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>👥 طلاب يدرسون الآن:</div>
          {activeSessions.map(session => (
            <div key={session.id} style={{
              padding: '10px',
              background: '#f3f4f6',
              borderRadius: '10px',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{session.user_email?.split('@')[0]}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {session.subject_id === 1 ? '📐 رياضيات' : session.subject_id === 2 ? '⚛️ فيزياء' : '📖 عربية'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
