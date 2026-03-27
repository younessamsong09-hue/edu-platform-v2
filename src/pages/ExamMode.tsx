import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Exam {
  id: number
  title_ar: string
  subject_id: number
  year: number
  session: string
  duration: number
  questions: any[]
  total_points: number
}

export default function ExamMode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [neighborhood, setNeighborhood] = useState('')

  useEffect(() => {
    checkUser()
    fetchExam()
  }, [id])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('neighborhood')
        .eq('id', user.id)
        .single()
      if (data?.neighborhood) setNeighborhood(data.neighborhood)
    }
  }

  async function fetchExam() {
    const { data } = await supabase
      .from('interactive_exams')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) setExam(data)
    setLoading(false)
  }

  const startExam = () => {
    setStarted(true)
    setTimeLeft(exam!.duration * 60)
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          submitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const selectAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion + 1 < exam!.questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitExam = async () => {
    let totalScore = 0
    const results = exam!.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correct
      if (isCorrect) totalScore += q.points
      return {
        question: q.question,
        answer: answers[i],
        correct: q.correct,
        is_correct: isCorrect,
        points: isCorrect ? q.points : 0
      }
    })
    
    setScore(totalScore)
    setSubmitted(true)
    
    // حفظ المحاولة
    if (user) {
      await supabase
        .from('exam_attempts')
        .insert({
          user_id: user.id,
          exam_id: exam!.id,
          score: totalScore,
          answers: results,
          time_spent: exam!.duration * 60 - timeLeft
        })
      
      // تحديث نقاط الحي
      if (neighborhood) {
        await supabase.rpc('update_neighborhood_score', {
          hood: neighborhood,
          points: totalScore
        })
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري تحميل الامتحان...</div>
  }

  if (!exam) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>الامتحان غير موجود</div>
  }

  if (submitted) {
    const percentage = (score / exam.total_points) * 100
    return (
      <div style={{ maxWidth: '800px', margin: '100px auto', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>
          {percentage >= 60 ? '🎉' : '📚'}
        </div>
        <h1>{percentage >= 60 ? 'مبروك!' : 'لا بأس، حاول مرة أخرى'}</h1>
        <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea', margin: '20px 0' }}>
          {score} / {exam.total_points}
        </p>
        <p>نسبة النجاح: {percentage.toFixed(1)}%</p>
        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={() => window.location.reload()} style={{
            padding: '12px 25px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}>
            إعادة المحاولة
          </button>
          <Link to="/national-exams">
            <button style={{
              padding: '12px 25px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}>
              العودة للامتحانات
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div style={{ maxWidth: '800px', margin: '100px auto', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px' }}>
        <h1 style={{ color: '#667eea' }}>📝 {exam.title_ar}</h1>
        <div style={{ margin: '30px 0', padding: '20px', background: '#f3f4f6', borderRadius: '15px' }}>
          <p>⏱️ المدة: {exam.duration} دقيقة</p>
          <p>📊 عدد الأسئلة: {exam.questions.length}</p>
          <p>⭐ المجموع: {exam.total_points} نقطة</p>
        </div>
        <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '15px', marginBottom: '30px' }}>
          ⚠️ بمجرد الضغط على "بدء الامتحان"، سيبدأ العد التنازلي. لا يمكنك الخروج من الصفحة.
        </div>
        <button onClick={startExam} style={{
          padding: '15px 40px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '18px'
        }}>
          🚀 بدء الامتحان
        </button>
      </div>
    )
  }

  const question = exam.questions[currentQuestion]

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* شريط التقدم والمؤقت */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'white',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontWeight: 'bold' }}>السؤال {currentQuestion + 1}/{exam.questions.length}</span>
        </div>
        <div style={{ 
          background: timeLeft < 60 ? '#ef4444' : '#10b981',
          padding: '8px 20px',
          borderRadius: '30px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* السؤال */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>{question.question}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((opt: string, idx: number) => (
            <button
              key={idx}
              onClick={() => selectAnswer(opt)}
              style={{
                padding: '15px',
                background: answers[currentQuestion] === opt ? '#667eea' : '#f3f4f6',
                color: answers[currentQuestion] === opt ? 'white' : '#333',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'right',
                fontSize: '16px'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* أزرار التنقل */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'space-between' }}>
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          style={{
            padding: '12px 25px',
            background: currentQuestion === 0 ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          السابق
        </button>
        
        {currentQuestion + 1 === exam.questions.length ? (
          <button
            onClick={submitExam}
            style={{
              padding: '12px 35px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            تسليم الامتحان
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            style={{
              padding: '12px 35px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            التالي
          </button>
        )}
      </div>
    </div>
  )
}
