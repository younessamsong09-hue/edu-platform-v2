import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Exam {
  id: number
  title: string
  title_ar: string
  year: number
  session: string
  level: string
  file_url: string
  correction_url: string
  description: string
  views: number
  downloads: number
  subject_id: number
}

interface Subject {
  id: number
  name_ar: string
  icon: string
  color: string
}

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubjects()
    fetchExams()
  }, [])

  async function fetchSubjects() {
    const { data } = await supabase
      .from('subjects')
      .select('id, name_ar, icon, color')
      .order('id')
    
    if (data) setSubjects(data)
  }

  async function fetchExams() {
    const { data } = await supabase
      .from('exams')
      .select('*')
      .eq('is_published', true)
      .order('year', { ascending: false })
    
    if (data) setExams(data)
    setLoading(false)
  }

  async function incrementDownloads(id: number) {
    await supabase
      .from('exams')
      .update({ downloads: (exams.find(e => e.id === id)?.downloads || 0) + 1 })
      .eq('id', id)
  }

  const getSubjectInfo = (id: number) => {
    return subjects.find(s => s.id === id) || { name_ar: 'غير محدد', icon: '📚', color: '#667eea' }
  }

  const handleDownload = (url: string, id: number) => {
    incrementDownloads(id)
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>⏳ جاري تحميل الامتحانات...</h2>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', color: '#333', marginBottom: '10px' }}>
        📝 الامتحانات الوطنية
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        امتحانات سابقة مع التصحيح لجميع المواد
      </p>

      {exams.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '15px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📚</div>
          <p style={{ color: '#666' }}>لا توجد امتحانات متاحة حالياً. سيتم إضافتها قريباً.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {exams.map(exam => {
            const subject = getSubjectInfo(exam.subject_id)
            return (
              <div key={exam.id} style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s'
              }}>
                <div style={{
                  background: subject.color,
                  padding: '15px 20px',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>{subject.icon}</span>
                  <span style={{ fontWeight: 'bold' }}>{subject.name_ar}</span>
                  <span>{exam.year}</span>
                </div>
                
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#333' }}>{exam.title_ar}</h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5' }}>
                    {exam.description || 'امتحان وطني مع التصحيح'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '12px', color: '#999' }}>
                    <span>👁️ {exam.views || 0} مشاهدة</span>
                    <span>📥 {exam.downloads || 0} تحميل</span>
                    <span>{exam.session === 'normale' ? 'الدورة العادية' : 'دورة الاستدراك'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => exam.file_url && handleDownload(exam.file_url, exam.id)}
                      disabled={!exam.file_url}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '10px',
                        background: exam.file_url ? '#10b981' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: exam.file_url ? 'pointer' : 'not-allowed'
                      }}
                    >
                      📄 تحميل الامتحان
                    </button>
                    <button
                      onClick={() => exam.correction_url && handleDownload(exam.correction_url, exam.id)}
                      disabled={!exam.correction_url}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '10px',
                        background: exam.correction_url ? '#667eea' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: exam.correction_url ? 'pointer' : 'not-allowed'
                      }}
                    >
                      📖 تحميل التصحيح
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
          ← العودة إلى الدروس
        </button>
      </Link>
    </div>
  )
}
