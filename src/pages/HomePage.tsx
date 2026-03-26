import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl',
      padding: '20px'
    }}>
      {/* كرت الواجهة الرئيسي */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '20px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '10px' }}>🎓</div>
        <h1 style={{ color: '#1f2937', marginBottom: '10px', fontSize: '28px' }}>بوابة المعرفة المغربية</h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>منصتك لتعلم المواد الدراسية بذكاء وسهولة</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/courses" style={{ textDecoration: 'none' }}>
            <button style={{ 
              width: '100%', 
              backgroundColor: '#4f46e5', 
              color: 'white', 
              padding: '15px', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '18px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.3s'
            }}>
              🚀 تصفح الدروس
            </button>
          </Link>

          <button style={{ 
            width: '100%', 
            backgroundColor: '#10b981', 
            color: 'white', 
            padding: '15px', 
            border: 'none', 
            borderRadius: '12px', 
            fontSize: '18px', 
            fontWeight: 'bold',
            cursor: 'pointer'
          }} onClick={() => alert('قريباً: صفحة التسجيل')}>
            📝 تسجيل طالب جديد
          </button>
        </div>
      </div>

      <p style={{ marginTop: '20px', color: '#9ca3af', fontSize: '14px' }}>
        صنع بكل فخر لطلاب مدينة تاوريرت ✨
      </p>
    </div>
  )
}
