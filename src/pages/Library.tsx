import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Textbook {
  id: number
  title: string
  title_ar: string
  grade: string
  level: string
  description: string
  file_url: string
  cover_url: string
  author: string
  publisher: string
  year: number
  downloads: number
  views: number
  subject_id: number
}

interface Subject {
  id: number
  name_ar: string
  icon: string
  color: string
}

export default function Library() {
  const [textbooks, setTextbooks] = useState<Textbook[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)

  const grades = [
    { value: 'all', label: 'جميع المستويات', icon: '📚' },
    { value: 'jtm', label: 'الجذع المشترك', icon: '🎓' },
    { value: '1bac', label: 'الأولى باكالوريا', icon: '📖' },
    { value: '2bac', label: 'الثانية باكالوريا', icon: '🎯' }
  ]

  useEffect(() => {
    fetchSubjects()
    fetchTextbooks()
  }, [])

  useEffect(() => {
    filterTextbooks()
  }, [selectedGrade, selectedSubject])

  async function fetchSubjects() {
    const { data } = await supabase
      .from('subjects')
      .select('id, name_ar, icon, color')
      .order('id')
    
    if (data) setSubjects(data)
  }

  async function fetchTextbooks() {
    const { data } = await supabase
      .from('textbooks')
      .select('*')
      .eq('is_active', true)
    
    if (data) setTextbooks(data)
    setLoading(false)
  }

  function filterTextbooks() {
    let filtered = [...textbooks]
    
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(b => b.grade === selectedGrade)
    }
    
    if (selectedSubject) {
      filtered = filtered.filter(b => b.subject_id === selectedSubject)
    }
    
    return filtered
  }

  const filteredBooks = filterTextbooks()
  const getSubjectInfo = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId) || { name_ar: 'عام', icon: '📚', color: '#667eea' }
  }

  async function incrementDownloads(id: number) {
    await supabase
      .from('textbooks')
      .update({ downloads: (textbooks.find(b => b.id === id)?.downloads || 0) + 1 })
      .eq('id', id)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ fontSize: '40px' }}>📚</div>
        <h2>جاري تحميل المكتبة...</h2>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px', textAlign: 'center' }}>
        📚 مكتبة الكتب المدرسية
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        جميع الكتب المدرسية المعتمدة مع إمكانية التحميل والاستفادة من المساعد الذكي
      </p>

      {/* الفلاتر */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {grades.map(grade => (
            <button
              key={grade.value}
              onClick={() => setSelectedGrade(grade.value)}
              style={{
                padding: '8px 20px',
                background: selectedGrade === grade.value ? '#667eea' : '#f3f4f6',
                color: selectedGrade === grade.value ? 'white' : '#333',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              {grade.icon} {grade.label}
            </button>
          ))}
        </div>
        
        <select
          value={selectedSubject || ''}
          onChange={(e) => setSelectedSubject(e.target.value ? parseInt(e.target.value) : null)}
          style={{
            padding: '8px 15px',
            borderRadius: '25px',
            border: '1px solid #ddd',
            background: 'white'
          }}
        >
          <option value="">جميع المواد</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.icon} {s.name_ar}</option>
          ))}
        </select>
      </div>

      {/* قائمة الكتب */}
      {filteredBooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📚</div>
          <h3>لا توجد كتب حالياً</h3>
          <p style={{ color: '#666' }}>سيتم إضافة الكتب قريباً</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {filteredBooks.map(book => {
            const subject = getSubjectInfo(book.subject_id)
            return (
              <div key={book.id} style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s'
              }}>
                <div style={{
                  background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`,
                  padding: '20px',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '40px' }}>{subject.icon}</span>
                  <span>{book.year}</span>
                </div>
                
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>
                    {book.title_ar}
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                    {book.description}
                  </p>
                  
                  <div style={{ marginBottom: '15px', fontSize: '12px', color: '#999' }}>
                    <div>📖 المستوى: {book.level}</div>
                    <div>✍️ المؤلف: {book.author}</div>
                    <div>🏢 الناشر: {book.publisher}</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a
                      href={book.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => book.file_url && incrementDownloads(book.id)}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '10px',
                        background: '#10b981',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '10px',
                        fontSize: '14px'
                      }}
                    >
                      📥 تحميل الكتاب
                    </a>
                    <Link
                      to={`/library/${book.id}`}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '10px',
                        background: '#667eea',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '10px',
                        fontSize: '14px'
                      }}
                    >
                      🤖 استشارة المساعد
                    </Link>
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
          padding: '12px',
          background: '#f3f4f6',
          color: '#333',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}>
          ← العودة إلى الدروس
        </button>
      </Link>
    </div>
  )
}
