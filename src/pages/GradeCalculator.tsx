import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Subject {
  name: string
  coefficient: number
  grade: number
}

const subjectsByBranch = {
  'sciences': [
    { name: 'الرياضيات', coefficient: 7 },
    { name: 'الفيزياء والكيمياء', coefficient: 7 },
    { name: 'علوم الحياة والأرض', coefficient: 7 },
    { name: 'اللغة العربية', coefficient: 3 },
    { name: 'اللغة الفرنسية', coefficient: 3 },
    { name: 'اللغة الإنجليزية', coefficient: 2 },
    { name: 'الفلسفة', coefficient: 2 },
    { name: 'التاريخ والجغرافيا', coefficient: 2 },
    { name: 'التربية الإسلامية', coefficient: 1 }
  ],
  'literature': [
    { name: 'اللغة العربية', coefficient: 5 },
    { name: 'الفلسفة', coefficient: 4 },
    { name: 'اللغة الفرنسية', coefficient: 4 },
    { name: 'اللغة الإنجليزية', coefficient: 3 },
    { name: 'التاريخ والجغرافيا', coefficient: 3 },
    { name: 'الرياضيات', coefficient: 2 },
    { name: 'التربية الإسلامية', coefficient: 2 }
  ]
}

export default function GradeCalculator() {
  const [branch, setBranch] = useState('sciences')
  const [grades, setGrades] = useState<{ [key: string]: number }>({})
  const [average, setAverage] = useState(0)

  const subjects = subjectsByBranch[branch as keyof typeof subjectsByBranch]

  const updateGrade = (subject: string, grade: number) => {
    setGrades({ ...grades, [subject]: grade })
    calculateAverage()
  }

  const calculateAverage = () => {
    let totalPoints = 0
    let totalCoef = 0
    
    subjects.forEach(subject => {
      const grade = grades[subject.name] || 0
      if (grade > 0) {
        totalPoints += grade * subject.coefficient
        totalCoef += subject.coefficient
      }
    })
    
    const avg = totalCoef > 0 ? totalPoints / totalCoef : 0
    setAverage(avg)
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return '#10b981'
    if (grade >= 12) return '#f59e0b'
    if (grade >= 10) return '#ef4444'
    return '#dc2626'
  }

  const getGradeText = (grade: number) => {
    if (grade >= 16) return 'ممتاز'
    if (grade >= 14) return 'جيد جداً'
    if (grade >= 12) return 'جيد'
    if (grade >= 10) return 'مقبول'
    return 'غير كافٍ'
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px', textAlign: 'center' }}>
        📊 حاسبة المعدل
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        احسب معدلك حسب معاملات وزارة التربية الوطنية
      </p>

      {/* اختيار الشعبة */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px',
        display: 'flex',
        gap: '15px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setBranch('sciences')}
          style={{
            padding: '10px 25px',
            background: branch === 'sciences' ? '#667eea' : '#f3f4f6',
            color: branch === 'sciences' ? 'white' : '#333',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          العلوم التجريبية
        </button>
        <button
          onClick={() => setBranch('literature')}
          style={{
            padding: '10px 25px',
            background: branch === 'literature' ? '#667eea' : '#f3f4f6',
            color: branch === 'literature' ? 'white' : '#333',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          الآداب والعلوم الإنسانية
        </button>
      </div>

      {/* المواد */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        {subjects.map(subject => (
          <div key={subject.name} style={{
            background: 'white',
            borderRadius: '15px',
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <span style={{ fontWeight: 'bold' }}>{subject.name}</span>
              <span style={{ fontSize: '12px', color: '#999', marginRight: '10px' }}>
                (المعامل {subject.coefficient})
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="20"
              step="0.25"
              value={grades[subject.name] || ''}
              onChange={(e) => updateGrade(subject.name, parseFloat(e.target.value))}
              style={{
                width: '100px',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                textAlign: 'center'
              }}
              placeholder="0-20"
            />
          </div>
        ))}
      </div>

      {/* النتيجة */}
      {average > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
        }}>
          <h2>المعدل العام</h2>
          <div style={{
            fontSize: '60px',
            fontWeight: 'bold',
            color: getGradeColor(average),
            margin: '20px 0'
          }}>
            {average.toFixed(2)}
          </div>
          <div style={{
            padding: '10px',
            background: getGradeColor(average) + '20',
            borderRadius: '10px',
            color: getGradeColor(average)
          }}>
            {getGradeText(average)}
          </div>
        </div>
      )}

      <Link to="/">
        <button style={{
          marginTop: '30px',
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
