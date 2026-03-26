import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Exercise {
  id: number
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  points: number
}

export default function Exercises() {
  const { lessonId } = useParams()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExercises()
  }, [lessonId])

  async function fetchExercises() {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_num')

    if (!error && data) {
      setExercises(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>⏳ جاري تحميل التمارين...</h2>
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>📝 لا توجد تمارين لهذا الدرس بعد</h2>
        <Link to="/courses">
          <button style={{
            marginTop: '20px',
            background: '#667eea',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            العودة إلى الدروس
          </button>
        </Link>
      </div>
    )
  }

  if (completed) {
    const totalPoints = exercises.reduce((sum, e) => sum + e.points, 0)
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px' }}>
        <div style={{ fontSize: '80px' }}>🎉</div>
        <h1>انتهيت!</h1>
        <p style={{ fontSize: '24px', margin: '20px 0' }}>
          نقاطك: {score} / {totalPoints}
        </p>
        <Link to={`/courses`}>
          <button style={{
            background: '#4f46e5',
            color: 'white',
            padding: '12px 30px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            العودة للدروس
          </button>
        </Link>
      </div>
    )
  }

  const currentExercise = exercises[currentIndex]

  function checkAnswer() {
    const correct = selectedAnswer === currentExercise.correct_answer
    setIsCorrect(correct)
    if (correct) {
      setScore(score + currentExercise.points)
    }
    setShowResult(true)
  }

  function nextQuestion() {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      setCompleted(true)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ background: '#f3f4f6', padding: '5px 15px', borderRadius: '20px' }}>
            سؤال {currentIndex + 1} / {exercises.length}
          </span>
          <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>
            {score} نقطة
          </span>
        </div>

        <h2 style={{ marginBottom: '30px', fontSize: '24px', lineHeight: '1.5' }}>
          {currentExercise.question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          {currentExercise.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(option)}
              disabled={showResult}
              style={{
                padding: '15px',
                background: selectedAnswer === option ? '#4f46e5' : '#f3f4f6',
                color: selectedAnswer === option ? 'white' : '#333',
                border: 'none',
                borderRadius: '12px',
                cursor: showResult ? 'default' : 'pointer',
                textAlign: 'right',
                fontSize: '16px'
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {!showResult ? (
          <button
            onClick={checkAnswer}
            disabled={!selectedAnswer}
            style={{
              width: '100%',
              padding: '15px',
              background: !selectedAnswer ? '#ccc' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              cursor: !selectedAnswer ? 'not-allowed' : 'pointer'
            }}
          >
            تحقق من الإجابة
          </button>
        ) : (
          <div>
            <div style={{
              padding: '15px',
              background: isCorrect ? '#d4edda' : '#f8d7da',
              color: isCorrect ? '#155724' : '#721c24',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <strong>{isCorrect ? '✅ صحيح!' : '❌ خطأ!'}</strong>
              <p style={{ marginTop: '10px' }}>{currentExercise.explanation}</p>
            </div>
            <button
              onClick={nextQuestion}
              style={{
                width: '100%',
                padding: '15px',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              {currentIndex + 1 === exercises.length ? 'إنهاء' : 'السؤال التالي →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
