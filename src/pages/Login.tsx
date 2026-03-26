import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (isSignUp) {
      // تسجيل حساب جديد
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('✅ تم إنشاء الحساب! يرجى تأكيد بريدك الإلكتروني')
        setEmail('')
        setPassword('')
        setIsSignUp(false)
      }
    } else {
      // تسجيل الدخول
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
          {isSignUp ? '📝 إنشاء حساب جديد' : '🔐 تسجيل الدخول'}
        </h1>
        
        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          
          <input
            type="password"
            placeholder="كلمة المرور (6 أحرف على الأقل)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'جاري...' : (isSignUp ? 'إنشاء حساب' : 'دخول')}
          </button>
        </form>
        
        <button
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError('')
            setSuccess('')
          }}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            color: '#4f46e5',
            border: '2px solid #4f46e5',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {isSignUp ? '🔐 لدي حساب بالفعل' : '📝 إنشاء حساب جديد'}
        </button>
        
        <Link to="/" style={{
          display: 'block',
          textAlign: 'center',
          marginTop: '20px',
          color: '#666',
          textDecoration: 'none'
        }}>
          ← العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
