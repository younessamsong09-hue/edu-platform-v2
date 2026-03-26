import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Competition {
  id: number
  name: string
  name_ar: string
  description: string
  subject_id: number
  start_date: string
  end_date: string
  prize: string
  prize_value: string
  questions: any[]
  participants_count: number
  is_active: boolean
}

interface Subject {
  id: number
  name_ar: string
  icon: string
  color: string
}

export default function Competitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [winners, setWinners] = useState<any[]>([])

  useEffect(() => {
    fetchCompetitions()
    fetchSubjects()
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function fetchCompetitions() {
    const { data } = await supabase
      .from('competitions')
      .select('*')
      .eq('is_active', true)
      .order('start_date', { ascending: false })
    
    if (data) setCompetitions(data)
    setLoading(false)
  }

  async function fetchSubjects() {
    const { data } = await supabase
      .from('subjects')
      .select('id, name_ar, icon, color')
    
    if (data) setSubjects(data)
  }

  async function checkParticipation(competitionId: number) {
    if (!user) return false
    
    const { data } = await supabase
      .from('competition_participations')
      .select('*')
      .eq('user_id', user.id)
      .eq('competition_id', competitionId)
      .single()
    
    return !!data
  }

  async function fetchWinners(competitionId: number) {
    const { data } = await supabase
      .from('competition_winners')
      .select('*, users(username)')
      .eq('competition_id', competitionId)
      .order('rank', { ascending: true })
      .limit(3)
    
    if (data) setWinners(data)
  }

  async function fetchUserRank(competitionId: number) {
    if (!user) return
    
    const { data } = await supabase
      .from('competition_participations')
      .select('rank')
      .eq('user_id', user.id)
      .eq('competition_id', competitionId)
      .single()
    
    if (data) setUserRank(data.rank)
  }

  const startCompetition = async (competition: Competition) => {
    const participated = await checkParticipation(competition.id)
    if (participated) {
      alert('لقد شاركت بالفعل في هذه المسابقة!')
      return
    }
    
    setSelectedCompetition(competition)
    setCurrentQuestion(0)
    setScore(0)
    setAnswers([])
    setGameStarted(true)
    setGameFinished(false)
    setSelectedAnswer('')
    setShowResult(false)
  }

  const checkAnswer = (answer: string) => {
    if (showResult) return
    
    setSelectedAnswer(answer)
    const question = selectedCompetition?.questions[currentQuestion]
    const isCorrect = answer === question.correct
    setShowResult(true)
    
    if (isCorrect) {
      setScore(score + question.points)
    }
    
    setAnswers([...answers, {
      question: question.question,
      answer: answer,
      correct: question.correct,
      is_correct: isCorrect,
      points: isCorrect ? question.points : 0
    }])
  }

  const nextQuestion = async () => {
    if (currentQuestion + 1 < (selectedCompetition?.questions.length || 0)) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      // نهاية المسابقة
      const finalScore = score
      setGameFinished(true)
      setGameStarted(false)
      
      // حفظ النتيجة
      if (user) {
        const { data } = await supabase
          .from('competition_participations')
          .insert({
            user_id: user.id,
            competition_id: selectedCompetition!.id,
            score: finalScore,
            answers: answers,
            time_spent: 0
          })
          .select()
        
        // تحديث عدد المشاركين
        await supabase
          .from('competitions')
          .update({ participants_count: (selectedCompetition!.participants_count || 0) + 1 })
          .eq('id', selectedCompetition!.id)
        
        // جلب الترتيب
        await fetchUserRank(selectedCompetition!.id)
        await fetchWinners(selectedCompetition!.id)
      }
    }
  }

  const getSubjectInfo = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId) || { name_ar: 'عام', icon: '🏆', color: '#667eea' }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - new Date().getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري تحميل المسابقات...</div>
  }

  // عرض المسابقة
  if (gameStarted && selectedCompetition) {
    const question = selectedCompetition.questions[currentQuestion]
    const subject = getSubjectInfo(selectedCompetition.subject_id)
    
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
          <h2>{selectedCompetition.name_ar}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <span>🏆 نقاطك: {score}</span>
            <span>📋 السؤال {currentQuestion + 1}/{selectedCompetition.questions.length}</span>
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
            <p style={{ color: '#999', marginTop: '10px' }}>نقاط السؤال: {question.points}</p>
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
                  fontSize: '16px'
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
                {currentQuestion + 1 === selectedCompetition.questions.length ? '🏆 إنهاء المسابقة' : '➡️ السؤال التالي'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // عرض النتيجة النهائية
  if (gameFinished && selectedCompetition) {
    const totalPoints = selectedCompetition.questions.reduce((sum, q) => sum + q.points, 0)
    const percentage = Math.round((score / totalPoints) * 100)
    
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
          <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>انتهت المسابقة!</h1>
          <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px' }}>
            {score} / {totalPoints}
          </p>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            نسبة النجاح: {percentage}%
          </p>
          
          {userRank && userRank <= 3 && (
            <div style={{
              background: '#ffd70020',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '2px solid #ffd700'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
              <h2 style={{ color: '#ffd700' }}>تهانينا! حصلت على المركز {userRank}</h2>
              <p>ستتواصل معك إدارة المنصة قريباً لتسليم جائزتك!</p>
            </div>
          )}
          
          {winners.length > 0 && (
            <div style={{ marginTop: '20px', padding: '20px', background: '#f3f4f6', borderRadius: '15px' }}>
              <h3>🥇 الفائزون في هذه المسابقة:</h3>
              {winners.map((winner, i) => (
                <p key={i}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} المركز {winner.rank}: {winner.users?.username || 'طالب'}</p>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button
              onClick={() => {
                setSelectedCompetition(null)
                setGameFinished(false)
                fetchCompetitions()
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
              📋 العودة للمسابقات
            </button>
          </div>
        </div>
      </div>
    )
  }

  // عرض قائمة المسابقات
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '10px', textAlign: 'center' }}>
        🏆 المسابقات الوطنية
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        تحدى أفضل الطلاب في المغرب واربح جوائز قيمة
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {competitions.map(comp => {
          const subject = getSubjectInfo(comp.subject_id)
          const daysLeft = getDaysLeft(comp.end_date)
          const isExpired = daysLeft <= 0
          
          return (
            <div key={comp.id} style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`,
                padding: '20px',
                textAlign: 'center',
                color: 'white'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{subject.icon}</div>
                <h2 style={{ fontSize: '22px', marginBottom: '5px' }}>{comp.name_ar}</h2>
                <p style={{ opacity: 0.9, fontSize: '14px' }}>{comp.description}</p>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>🎁 الجائزة:</span>
                    <strong style={{ color: '#ffd700' }}>{comp.prize}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>📅 البداية:</span>
                    <span>{formatDate(comp.start_date)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>⏰ النهاية:</span>
                    <span>{formatDate(comp.end_date)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>👥 المشاركون:</span>
                    <span>{comp.participants_count || 0}</span>
                  </div>
                </div>
                
                {isExpired ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '10px',
                    background: '#f3f4f6',
                    borderRadius: '10px',
                    color: '#666'
                  }}>
                    ⏰ انتهت المسابقة
                  </div>
                ) : (
                  <button
                    onClick={() => startCompetition(comp)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    🚀 شارك الآن {daysLeft > 0 && `(متبقي ${daysLeft} يوم)`}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {competitions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '15px' }}>
          <p>لا توجد مسابقات حالياً. ترقبوا المسابقات القادمة!</p>
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
