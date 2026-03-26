import { Link } from 'react-router-dom'
export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', direction: 'rtl' }}>
      <h1>🎓 بوابة المعرفة المغربية</h1>
      <p>مرحباً بك في المنصة التعليمية</p>
      <Link to="/courses"><button style={{padding: '10px 20px'}}>اذهب إلى الدروس</button></Link>
    </div>
  )
}
