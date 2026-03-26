import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Game {
  id: number
  name: string
  name_ar: string
  description: string
  subject_id: number
  level: string
  questions: any[]
  high_score: number
  plays_count: number
}

interface Subject {
  id: number
  name_ar: string
  icon: string
  color: string
}

export default function Games() {
  const [games, setGames] = useState<Game[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchGames()
    fetchSubjects()
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function fetchGames() {
    const { data } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
    
    if (data) setGames(data)
    setLoading(false)
  }

  async function fetchSubjects() {
    const { data } = await supabase
      .from('subjects')
      .select('id, name_ar, icon, color')
    
    if (data) setSubjects(data)
  }

  async function saveScore(gameId: number, finalScore: number) {
    if (!user) return

    const { error } = await supabase
      .from('game_scores')
      .insert({
        user_id: user.id,
        game_id: gameId,
        score: finalScore,
        correct_answers: finalScore,
        total_questions: selectedGame?.questions.length
      })

    if (!error) {
      // تحديث أعلى نتيجة في اللعبة
      if (finalScore > (selectedGame?.high_score || 0)) {
        await supabase
          .from('games')
          .update({ high_score: finalScore, plays_count: (selectedGame?.plays_count || 0) + 1 })
          .eq('id', gameId)
      }
    }
  }

  const startGame = (game: Game) => {
    setSelectedGame(game)
    setCurrentQuestion(0)
    setScore(0)
    setTimeLeft(15)
    setGameStarted(true)
    setGameFinished(false)
    setSelectedAnswer('')
    setShowResult(false)
  }

  const checkAnswer = (answer: string) => {
    if (showResult) return
    
    setSelectedAnswer(answer)
    const isCorrect = answer === selectedGame?.questions[currentQuestion].correct
    setShowResult(true)
    
    if (isCorrect) {
      setScore(score + 10)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion + 1 < (selectedGame?.questions.length || 0)) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(15)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      // نهاية اللعبة
      const finalScore = score + (selectedAnswer === selectedGame?.questions[currentQuestion].correct ? 10 : 0)
      setScore(finalScore)
      saveScore(selectedGame!.id, finalScore)
      setGameFinished(true)
      setGameStarted(false)
    }
  }

  // مؤقت السؤال
  useEffect(() => {
    if (!gameStarted || showResult) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowResult(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [gameStarted, currentQuestion, showResult])

  const getSubjectInfo = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId) || { name_ar: 'عام', icon: '🎮', color: '#667eea' }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري تحميل الألعاب...</div>
  }

  // عرض اللعبة
  if (gameStarted && selectedGame) {
    const question = selectedGame.questions[currentQuestion]
    const subject = getSubjectInfo(selectedGame.subject_id)
    
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`,
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>{subject.icon}</div>
          <h2>{selectedGame.name_ar}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <span>⭐ النقاط: {score}</span>
            <span>⏱️ السؤال {currentQuestion + 1}/{selectedGame.questions.length}</span>
            <span>⏰ {timeLeft} ثانية</span>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#f3f4f6',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '24px', color: '#333' }}>{question.question}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {question.options.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => checkAnswer(option)}
                disabled={showResult}
                style={{
                  padding: '15px',
                  background: showResult && option === question.correct ? '#10b981' :
                             showResult && option === selectedAnswer ? '#ef4444' :
                             selectedAnswer === option ? '#667eea' : '#f3f4f6',
                  color: showResult && (option === question.correct || option === selectedAnswer) ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: showResult ? 'default' : 'pointer',
                  fontSize: '16px',
                  transition: '0.3s'
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div style={{ marginTop: '30px' }}>
              <div style={{
                padding: '15px',
                background: selectedAnswer === question.correct ? '#d4edda' : '#f8d7da',
                color: selectedAnswer === question.correct ? '#155724' : '#721c24',
                borderRadius: '12px',
                marginBottom: '15px'
              }}>
                <strong>{selectedAnswer === question.correct ? '✅ صحيح!' : '❌ خطأ!'}</strong>
                <p style={{ marginTop: '5px' }}>الإجابة الصحيحة: {question.correct}</p>
              </div>
              <button
                onClick={nextQuestion}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {currentQuestion + 1 === selectedGame.questions.length ? '🏆 إنهاء اللعبة' : '➡️ السؤال التالي'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // عرض النتيجة النهائية
  if (gameFinished && selectedGame) {
    const isHighScore = score > (selectedGame.high_score || 0)
    
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
          <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>انتهت اللعبة!</h1>
          <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px' }}>
            {score} / {selectedGame.questions.length * 10}
          </p>
          {isHighScore && (
            <div style={{
              background: '#ffd70020',
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '20px',
              color: '#ffd700'
            }}>
              🎉 رقم قياسي جديد! 🎉
            </div>
          )}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={() => startGame(selectedGame)}
              style={{
                padding: '12px 25px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              🔄 إعادة اللعب
            </button>
            <button
              onClick={() => {
                setSelectedGame(null)
                setGameFinished(false)
              }}
              style={{
                padding: '12px 25px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              📋 العودة للألعاب
            </button>
          </div>
        </div>
      </div>
    )
  }

  // عرض قائمة الألعاب
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '10px', textAlign: 'center' }}>
        🎮 الألعاب التعليمية
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        تعلم من خلال اللعب وتحدى أصدقاءك
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {games.map(game => {
          const subject = getSubjectInfo(game.subject_id)
          return (
            <div key={game.id} style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`,
                padding: '30px',
                textAlign: 'center',
                color: 'white'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '10px' }}>{subject.icon}</div>
                <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>{game.name_ar}</h2>
                <p style={{ opacity: 0.9 }}>{game.description}</p>
              </div>
              <div style={{ padding: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span>🏆 أعلى نتيجة: {game.high_score || 0}</span>
                  <span>🎮 عدد اللاعبين: {game.plays_count || 0}</span>
                  <span>❓ {game.questions.length} سؤال</span>
                </div>
                <button
                  onClick={() => startGame(game)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  🚀 ابدأ التحدي
                </button>
              </div>
            </div>
          )
        })}
      </div>

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
