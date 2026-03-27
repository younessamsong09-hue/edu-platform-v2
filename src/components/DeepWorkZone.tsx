import { useState, useEffect } from 'react'

export default function DeepWorkZone() {
  const [isActive, setIsActive] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [mode, setMode] = useState<'pomodoro' | 'study' | 'break'>('pomodoro')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [cycles, setCycles] = useState(0)
  const [motivationMessage, setMotivationMessage] = useState('')

  const motivationalMessages = [
    'تبارك الله عليك كمل! 💪',
    'مابقا والو للباك! 🎓',
    'أنت قادر عليها! 🔥',
    'شوية وشوية والنجاح جا! ✨',
    'كل درس كيقربك للهدف! 🎯',
    'الله معاك! 🤲',
    'كمل هاد الجلسة وارتاح! ⏱️',
    'النجاح ماشي صدفة، هو اجتهاد! 📚'
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      handleCycleComplete()
    }
    return () => clearInterval(timer)
  }, [isActive, timeLeft])

  function handleCycleComplete() {
    if (mode === 'pomodoro' || mode === 'study') {
      setMode('break')
      setTimeLeft(5 * 60)
      setCycles(prev => prev + 1)
      showRandomMessage()
    } else {
      setMode('study')
      setTimeLeft(25 * 60)
      showRandomMessage()
    }
  }

  function showRandomMessage() {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
    setMotivationMessage(motivationalMessages[randomIndex])
    setTimeout(() => setMotivationMessage(''), 3000)
  }

  function startSession() {
    setIsActive(true)
    setMode('study')
    setTimeLeft(25 * 60)
    setIsMinimized(false)
    showRandomMessage()
  }

  function pauseSession() {
    setIsActive(false)
  }

  function resetSession() {
    setIsActive(false)
    setMode('pomodoro')
    setTimeLeft(25 * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const total = mode === 'study' ? 25 * 60 : 5 * 60
    return ((total - timeLeft) / total) * 100
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          background: '#667eea',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: 'white'
        }}
        title="وضع التركيز العميق"
      >
        🧠
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '280px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      zIndex: 1000,
      border: isActive ? '2px solid #10b981' : '1px solid #e5e7eb'
    }}>
      <div style={{
        background: isActive ? '#10b981' : '#667eea',
        padding: '12px 15px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
      }}
      onClick={() => setIsMinimized(true)}>
        <span style={{ fontWeight: 'bold' }}>🧠 تركيز</span>
        <span style={{ fontSize: '12px' }}>
          {mode === 'study' ? '📖 دراسة' : '☕ راحة'}
        </span>
      </div>

      <div style={{ padding: '15px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#333' }}>
          {formatTime(timeLeft)}
        </div>
        
        <div style={{
          width: '100%',
          height: '4px',
          background: '#e5e7eb',
          borderRadius: '2px',
          margin: '10px 0',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${getProgress()}%`,
            height: '100%',
            background: isActive ? '#10b981' : '#667eea',
            transition: 'width 0.3s'
          }} />
        </div>

        {!isActive ? (
          <button
            onClick={startSession}
            style={{
              width: '100%',
              padding: '8px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            🚀 ابدأ
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={pauseSession}
              style={{
                flex: 1,
                padding: '8px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ⏸️ إيقاف
            </button>
            <button
              onClick={resetSession}
              style={{
                flex: 1,
                padding: '8px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 إعادة
            </button>
          </div>
        )}

        {cycles > 0 && (
          <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
            ✅ {cycles} جلسة
          </div>
        )}
      </div>

      {motivationMessage && (
        <div style={{
          position: 'absolute',
          bottom: '-35px',
          left: '0',
          right: '0',
          background: '#fef3c7',
          padding: '6px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#92400e',
          borderRadius: '8px',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {motivationMessage}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
