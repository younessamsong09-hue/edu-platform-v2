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
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('all')

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
    let query = supabase
      .from('exams')
      .select('*')
      .eq('is_published', true)
      .order('year', { ascending: false })
      .order('id', { ascending: false })

    if (selectedSubject) {
      query = query.eq('subject_id', selectedSubject)
    }
    if (selectedYear) {
      query = query.eq('year', selectedYear)
    }
    if (selectedLevel !== 'all') {
      query = query.eq('level', selectedLevel)
    }

    const { data } = await query
    if (data) setExams(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchExams()
  }, [selectedSubject, selectedYear, selectedLevel])

  async function incrementViews(id: number) {
    await supabase
      .from('exams')
      .update({ views: (exams.find(e => e.id === id)?.views || 0) + 1 })
      .eq('id', id)
  }

  async function incrementDownloads(id: number) {
    await supabase
      .from('exams')
      .update({ downloads: (exams.find(e => e.id === id)?.downloads || 0) + 1 })
      .eq('id', id)
  }

  const years = [2020, 2021, 2022, 2023, 2024, 2025]
  const levels = [
    { value: 'all', label: 'جميع المستويات' },
    { value: 'jtm', label: 'الجذع المشترك' },
    { value: '1bac', label: 'الأولى باكالوريا' },
    { value: '2bac', label: 'الثانية باكالوريا' }
  ]

  const getSubjectInfo = (id: number) => {
    return subjects.find(s => s.id === id) || { name_ar: 'غير محدد', icon: '📚', color: '#667eea' }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري تحميل الامتحانات...</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', color: '#333', marginBottom: '10px' }}>
        📝 الامتحانات الوطنية
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        امتحانات سابقة مع التصحيح لجميع المواد والمستويات
      </p>

      {/* الفلاتر */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center'
      }}>
        <select
          value={selectedSubject || ''}
          onChange={(e) => setSelectedSubject(e.target.value ? parseInt(e.target.value) : null)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            minWidth: '150px'
          }}
        >
          <option value="">جميع المواد</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name_ar}</option>
          ))}
        </select>

        <select
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            minWidth: '120px'
          }}
        >
          <option value="">جميع السنوات</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            minWidth: '150px'
          }}
        >
          {levels.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setSelectedSubject(null)
            setSelectedYear(null)
            setSelectedLevel('all')
          }}
          style={{
            padding: '10px 20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          إعادة ضبط
        </button>
      </div>

      {/* قائمة الامتحانات */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {exams.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '15px' }}>
            <p>لا توجد امتحانات مطابقة للبحث</p>
          </div>
        ) : (
          exams.map(exam => {
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
                  <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{exam.title_ar}</h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                    {exam.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '12px', color: '#999' }}>
                    <span>👁️ {exam.views || 0} مشاهدة</span>
                    <span>📥 {exam.downloads || 0} تحميل</span>
                    <span>{exam.session === 'normale' ? 'الدورة العادية' : 'دورة الاستدراك'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a
                      href={exam.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => incrementDownloads(exam.id)}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '10px',
                        background: '#10b981',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      📄 تحميل الامتحان
                    </a>
                    {exam.correction_url && (
                      <a
                        href={exam.correction_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => incrementDownloads(exam.id)}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '10px',
                          background: '#667eea',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        📖 تحميل التصحيح
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
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
          cursor: 'pointer'
        }}>
          ← العودة إلى الدروس
        </button>
      </Link>
    </div>
  )
}
