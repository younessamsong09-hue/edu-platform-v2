import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Mistake {
  id: number
  subject_id: number
  mistake: string
  correct: string
  explanation_darija: string
  frequency: number
}

export default function CommonMistakes() {
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMistakes()
  }, [selectedSubject])

  async function fetchMistakes() {
    let query = supabase.from('common_mistakes').select('*')
    if (selectedSubject) query = query.eq('subject_id', selectedSubject)
    const { data } = await query.order('frequency', { ascending: false })
    if (data) setMistakes(data)
    setLoading(false)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px', textAlign: 'center' }}>
        ⚠️ الأخطاء الشائعة
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        تعلم من أخطاء الآخرين ولا تقع فيها
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setSelectedSubject(null)} style={{ padding: '8px 20px', background: !selectedSubject ? '#667eea' : '#f3f4f6', color: !selectedSubject ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>الكل</button>
        <button onClick={() => setSelectedSubject(1)} style={{ padding: '8px 20px', background: selectedSubject === 1 ? '#667eea' : '#f3f4f6', color: selectedSubject === 1 ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>📐 الرياضيات</button>
        <button onClick={() => setSelectedSubject(2)} style={{ padding: '8px 20px', background: selectedSubject === 2 ? '#667eea' : '#f3f4f6', color: selectedSubject === 2 ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>⚛️ الفيزياء</button>
      </div>

      {mistakes.map(m => (
        <div key={m.id} style={{ background: 'white', borderRadius: '15px', padding: '20px', marginBottom: '20px', borderRight: '4px solid #ef4444' }}>
          <div style={{ background: '#fee2e2', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
            <strong>❌ الخطأ:</strong> {m.mistake}
          </div>
          <div style={{ background: '#d4edda', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
            <strong>✅ الصحيح:</strong> {m.correct}
          </div>
          <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '10px' }}>
            <strong>💡 لماذا هذا الخطأ شائع؟</strong>
            <p style={{ marginTop: '10px' }}>{m.explanation_darija}</p>
          </div>
        </div>
      ))}

      <Link to="/courses"><button style={{ width: '100%', padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>← العودة للدروس</button></Link>
    </div>
  )
}
