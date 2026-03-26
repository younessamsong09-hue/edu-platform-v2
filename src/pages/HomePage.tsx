import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', direction: 'rtl' }}>
      <h1>🎓 بوابة المعرفة المغربية</h1>
      <p>مرحباً بك في منصة التعليم الرقمية</p>
      <Link to="/courses">
        <button style={{ background: '#4f46e5', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          اذهب إلى الدروس
        </button>
      </Link>
    </div>
  )
}
