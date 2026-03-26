import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Subject {
  id: number
  name: string
  name_ar: string
  icon: string
  color: string
  description: string
  level: string
}

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [user, setUser] = useState<any>(null)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  useEffect(() => {
    checkUser()
    fetchSubjects()
  }, [])

  useEffect(() => {
    filterSubjects()
  }, [searchTerm, selectedLevel, subjects])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      const { data } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('is_completed', true)
      
      if (data) {
        setCompletedLessons(data.map(p => p.lesson_id))
      }
    }
  }

  async function fetchSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('order_num')

    if (!error && data) {
      setSubjects(data)
      setFilteredSubjects(data)
    }
    setLoading(false)
  }

  function filterSubjects() {
    let filtered = [...subjects]
    
    // فلتر حسب مستوى المادة
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(s => s.level === selectedLevel || s.level === 'all')
    }
    
    // فلتر حسب البحث
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(s => 
        s.name_ar.includes(searchTerm) || 
        s.name.includes(searchTerm) ||
        (s.description && s.description.includes(searchTerm))
      )
    }
    
    setFilteredSubjects(filtered)
  }

  // مستويات التصفية
  const levels = [
    { value: 'all', label: 'جميع المستويات', icon: '📚' },
    { value: 'jtm', label: 'الجذع المشترك', icon: '🎓' },
    { value: '1bac', label: 'الأولى باكالوريا', icon: '📖' },
    { value: '2bac', label: 'الثانية باكالوريا', icon: '🎯' }
  ]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', background: '#f3f4f6', minHeight: '100vh' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>⏳</div>
        <h2 style={{ color: '#666' }}>جاري تحميل المواد...</h2>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>📚 المواد الدراسية</h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>اختر المادة التي تريد دراستها</p>
      </div>

      {/* Search and Filter Section */}
      <div style={{ maxWidth: '1200px', margin: '-30px auto 0', padding: '0 20px' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          {/* Search Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="🔍 ابحث عن مادة... (رياضيات، فيزياء، عربية...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '50px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Level Filters */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {levels.map((level) => (
              <button
                key={level.value}
                onClick={() => setSelectedLevel(level.value)}
                style={{
                  padding: '10px 25px',
                  background: selectedLevel === level.value ? '#667eea' : '#f3f4f6',
                  color: selectedLevel === level.value ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: selectedLevel === level.value ? 'bold' : 'normal',
                  transition: 'all 0.3s'
                }}
              >
                {level.icon} {level.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }}>
            {filteredSubjects.length} مادة متاحة
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px 60px' }}>
        {filteredSubjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔍</div>
            <h2 style={{ color: '#666' }}>لا توجد نتائج</h2>
            <p style={{ color: '#999' }}>لم نجد مواد تطابق بحثك. جرب كلمات أخرى</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedLevel('all')
              }}
              style={{
                marginTop: '20px',
                padding: '10px 30px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              مسح البحث
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {filteredSubjects.map((subject, index) => (
              <Link to={`/courses/${subject.id}`} key={subject.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer',
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${subject.color || '#667eea'} 0%, ${subject.color || '#764ba2'} 100%)`,
                    padding: '50px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '80px', display: 'inline-block', animation: 'bounce 2s infinite' }}>{subject.icon}</span>
                  </div>
                  <div style={{ padding: '30px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '28px', marginBottom: '15px', color: '#1f2937' }}>{subject.name_ar}</h3>
                    <p style={{ color: '#6b7280', marginBottom: '25px', lineHeight: '1.6' }}>
                      {subject.description || `دروس شاملة في مادة ${subject.name_ar}`}
                    </p>
                    <div style={{
                      display: 'inline-block',
                      background: '#f3f4f6',
                      color: subject.color || '#667eea',
                      padding: '8px 20px',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginBottom: '20px'
                    }}>
                      {subject.level === 'all' ? 'جميع المستويات' : 
                       subject.level === 'jtm' ? 'الجذع المشترك' :
                       subject.level === '1bac' ? 'الأولى باك' :
                       subject.level === '2bac' ? 'الثانية باك' : subject.level}
                    </div>
                    <button style={{
                      width: '100%',
                      background: `linear-gradient(135deg, ${subject.color || '#667eea'} 0%, ${subject.color || '#764ba2'} 100%)`,
                      color: 'white',
                      padding: '14px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'opacity 0.3s'
                    }}>
                      استكشف الدروس →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: '#1f2937',
        color: 'white',
        textAlign: 'center',
        padding: '40px',
        marginTop: '40px'
      }}>
        <p>📚 بوابة المعرفة المغربية</p>
        <p style={{ opacity: 0.7, marginTop: '10px', fontSize: '14px' }}>صنع بكل فخر لطلاب مدينة تاوريرت ✨</p>
        <p style={{ opacity: 0.5, marginTop: '20px', fontSize: '12px' }}>© 2025 جميع الحقوق محفوظة</p>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
// أضف هذا داخل صفحة الدروس (بعد وصف الدرس)
// سيتم عرض عدد المشاهدات لكل درس
