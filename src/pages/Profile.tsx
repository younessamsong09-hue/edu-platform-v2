import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>👤 الملف الشخصي</h1>
      
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ fontSize: '60px', textAlign: 'center', marginBottom: '20px' }}>👨‍🎓</div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>البريد الإلكتروني:</strong> {user.email}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>العضو منذ:</strong> {new Date(user.created_at).toLocaleDateString('ar-MA')}
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}
