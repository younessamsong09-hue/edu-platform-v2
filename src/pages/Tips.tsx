import { Link } from 'react-router-dom'

export default function Tips() {
  const tips = [
    { title: '📝 تنظيم الوقت', content: 'خصص وقتاً يومياً للمذاكرة، واجعل جدولاً منتظماً.' },
    { title: '🎯 حدد أهدافك', content: 'ضع أهدافاً قصيرة وطويلة المدى لتظل متحفزاً.' },
    { title: '📚 المراجعة المستمرة', content: 'راجع الدروس بانتظام بدلاً من المذاكرة قبل الامتحان.' },
    { title: '✍️ حل التمارين', content: 'حل التمارين يساعد في تثبيت المعلومات.' },
    { title: '👥 الدراسة الجماعية', content: 'ناقش الدروس مع زملائك لفهم أعمق.' },
    { title: '😴 النوم الكافي', content: 'النوم 8 ساعات يحسن التركيز والذاكرة.' },
  ]

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>📖 نصائح للدراسة الفعالة</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>استراتيجيات تساعدك على التفوق الدراسي</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {tips.map((tip, i) => (
          <div key={i} style={{
            background: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s'
          }}>
            <h3 style={{ fontSize: '22px', marginBottom: '15px', color: '#667eea' }}>{tip.title}</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{tip.content}</p>
          </div>
        ))}
      </div>

      <Link to="/courses">
        <button style={{
          marginTop: '40px',
          width: '100%',
          padding: '15px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          ابدأ التعلم الآن →
        </button>
      </Link>
    </div>
  )
}
