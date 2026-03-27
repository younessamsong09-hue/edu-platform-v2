import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SmartNavigator() {
  const [grade, setGrade] = useState<number | null>(null)
  const [branch, setBranch] = useState('sciences')
  const [result, setResult] = useState<any[]>([])

  const schools = [
    { name: 'ENSA (الدار البيضاء)', seuil: 14.5, type: 'مهندسين', desc: 'المدرسة الوطنية للعلوم التطبيقية' },
    { name: 'ENSA (فاس)', seuil: 14, type: 'مهندسين', desc: 'المدرسة الوطنية للعلوم التطبيقية' },
    { name: 'ENCG (الدار البيضاء)', seuil: 14, type: 'تسيير', desc: 'المدرسة الوطنية للتجارة والتسيير' },
    { name: 'كلية الطب', seuil: 16, type: 'طب', desc: 'كلية الطب والصيدلة' }
  ]

  const calculate = () => {
    if (!grade) return
    const filtered = schools.filter(s => s.seuil <= grade)
    setResult(filtered)
  }

  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '20px', marginTop: '20px' }}>
      <h3>🎯 ماذا لو؟</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input type="number" placeholder="معدلك" value={grade || ''} onChange={(e) => setGrade(parseFloat(e.target.value))} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
        <button onClick={calculate} style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '10px' }}>توقع</button>
      </div>
      {result.map((s, i) => (
        <div key={i} style={{ padding: '10px', background: '#f3f4f6', borderRadius: '10px', marginBottom: '8px' }}>
          <div style={{ fontWeight: 'bold' }}>{s.name}</div>
          <div style={{ fontSize: '11px' }}>عتبة {s.seuil} ✅ أنت مؤهل</div>
        </div>
      ))}
    </div>
  )
}
