import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface School {
  id: number
  school_name: string
  school_name_ar: string
  school_type: string
  branch: string
  seuil_2023: number
  seuil_2024: number
  description: string
  website: string
}

export default function CareerGuidance() {
  const [schools, setSchools] = useState<School[]>([])
  const [userGrade, setUserGrade] = useState<number | null>(null)
  const [userBranch, setUserBranch] = useState('sciences')
  const [filteredSchools, setFilteredSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    filterSchools()
  }, [userGrade, userBranch, schools])

  async function fetchSchools() {
    const { data } = await supabase
      .from('higher_education')
      .select('*')
      .eq('is_active', true)
    
    if (data) setSchools(data)
    setLoading(false)
  }

  function filterSchools() {
    let filtered = [...schools]
    
    if (userBranch !== 'all') {
      filtered = filtered.filter(s => s.branch === userBranch || s.branch === 'all')
    }
    
    if (userGrade) {
      filtered = filtered.filter(s => {
        const seuil = s.seuil_2024 || s.seuil_2023
        return userGrade >= (seuil - 2)
      })
    }
    
    setFilteredSchools(filtered)
  }

  const getRecommendation = () => {
    if (!userGrade) return null
    
    if (userGrade >= 16) return 'ممتاز! يمكنك التقديم على جميع المدارس العليا'
    if (userGrade >= 14) return 'جيد جداً. أنت مؤهل لمعظم المدارس العليا'
    if (userGrade >= 12) return 'جيد. حاول رفع معدلك قليلاً لتحسين فرصك'
    if (userGrade >= 10) return 'مقبول. ينصح بتحسين المعدل للتقديم على المدارس'
    return 'ينصح بمراجعة المواد التي تعاني فيها لرفع المعدل'
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري تحميل المعلومات...</div>
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px', textAlign: 'center' }}>
        🎓 التوجيه المدرسي
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        اكتشف المدارس العليا المناسبة لك حسب معدلك وشعبتك
      </p>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            معدلك العام:
          </label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.25"
            value={userGrade || ''}
            onChange={(e) => setUserGrade(parseFloat(e.target.value))}
            placeholder="مثلاً: 14.5"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            شعبتك:
          </label>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                value="sciences"
                checked={userBranch === 'sciences'}
                onChange={(e) => setUserBranch(e.target.value)}
              />
              العلوم التجريبية
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                value="literature"
                checked={userBranch === 'literature'}
                onChange={(e) => setUserBranch(e.target.value)}
              />
              الآداب والعلوم الإنسانية
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                value="all"
                checked={userBranch === 'all'}
                onChange={(e) => setUserBranch(e.target.value)}
              />
              جميع الشعب
            </label>
          </div>
        </div>
      </div>

      {userGrade && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎯</div>
          <h3>توصيتنا لك</h3>
          <p style={{ fontSize: '18px', marginTop: '10px' }}>{getRecommendation()}</p>
        </div>
      )}

      <h2 style={{ marginBottom: '20px' }}>📚 المدارس العليا المناسبة</h2>
      
      {filteredSchools.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px' }}>
          <p>لا توجد مدارس مطابقة للبحث. جرب تعديل المعايير</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredSchools.map(school => (
            <div key={school.id} style={{
              background: 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              borderRight: `4px solid ${(userGrade || 0) >= (school.seuil_2024 || school.seuil_2023) ? '#10b981' : '#f59e0b'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '5px' }}>{school.school_name_ar}</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>{school.school_type}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                    {school.seuil_2024 || school.seuil_2023}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>عتبة 2024</div>
                </div>
              </div>
              
              <p style={{ marginTop: '15px', color: '#666' }}>{school.description}</p>
              
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer" style={{
                    padding: '8px 20px',
                    background: '#f3f4f6',
                    color: '#333',
                    textDecoration: 'none',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    🔗 الموقع الرسمي
                  </a>
                )}
                {(userGrade || 0) >= (school.seuil_2024 || school.seuil_2023) ? (
                  <span style={{
                    padding: '8px 20px',
                    background: '#10b98120',
                    color: '#10b981',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    ✅ أنت مؤهل
                  </span>
                ) : (
                  <span style={{
                    padding: '8px 20px',
                    background: '#fef3c7',
                    color: '#f59e0b',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    ⚠️ تحتاج رفع المعدل {((school.seuil_2024 || school.seuil_2023) - (userGrade || 0)).toFixed(2)} نقطة
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/">
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
          ← العودة للرئيسية
        </button>
      </Link>
    </div>
  )
}
