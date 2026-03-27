import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function VisualMistakes() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const subjects = [
    { id: 'math', name: 'الرياضيات', icon: '📐', topics: ['المعادلات', 'الدوال'] },
    { id: 'physics', name: 'الفيزياء', icon: '⚛️', topics: ['الحركة', 'الكهرباء'] }
  ]

  const mistakes = [
    { id: 1, subject: 'math', topic: 'المعادلات', image: '📝', correct: '2س + 5 = 15 → س = 5', explanation: 'الخطأ: نسيان نقل العدد' }
  ]

  const filtered = mistakes.filter(m => !selectedSubject || m.subject === selectedSubject)

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center' }}>🔍 هل خطئي موجود هنا؟</h1>
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '30px 0' }}>
        {subjects.map(s => (
          <button key={s.id} onClick={() => setSelectedSubject(s.id)} style={{ padding: '10px 25px', background: selectedSubject === s.id ? '#667eea' : '#f3f4f6', color: selectedSubject === s.id ? 'white' : '#333', border: 'none', borderRadius: '30px' }}>
            {s.icon} {s.name}
          </button>
        ))}
      </div>
      {filtered.map(m => (
        <div key={m.id} style={{ background: 'white', borderRadius: '20px', padding: '25px', marginBottom: '20px', borderRight: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '15px', flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '60px' }}>{m.image}</div>
              <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '10px' }}>الخطأ: 2س + 5 = 15 → 2س = 15</div>
            </div>
            <div style={{ background: '#d4edda', padding: '20px', borderRadius: '15px', flex: 1 }}>
              <div style={{ fontSize: '40px', textAlign: 'center' }}>✓</div>
              <div style={{ background: 'white', padding: '10px', borderRadius: '10px' }}>{m.correct}</div>
              <div style={{ marginTop: '10px', fontSize: '13px' }}>💡 {m.explanation}</div>
            </div>
          </div>
        </div>
      ))}
      <Link to="/common-mistakes"><button style={{ width: '100%', padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px' }}>← العودة</button></Link>
    </div>
  )
}
