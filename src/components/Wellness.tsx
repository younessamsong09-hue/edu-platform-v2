import { useEffect, useState } from 'react'

export default function Wellness() {
  const [showBreakReminder, setShowBreakReminder] = useState(false)
  const [focusSound, setFocusSound] = useState<'off' | 'rain' | 'waves' | 'forest'>('off')
  const [timeOnSite, setTimeOnSite] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnSite(prev => prev + 60)
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timeOnSite >= 120 && !showBreakReminder) {
      setShowBreakReminder(true)
      setTimeout(() => setShowBreakReminder(false), 10000)
    }
  }, [timeOnSite])

  const getSoundUrl = () => {
    if (focusSound === 'rain') return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    if (focusSound === 'waves') return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    if (focusSound === 'forest') return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    return ''
  }

  return (
    <>
      {showBreakReminder && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          🧘 خذ قسطاً من الراحة! اشرب ماء، تمشى قليلاً، ثم عد.
        </div>
      )}

      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'white',
        borderRadius: '30px',
        padding: '8px 15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '10px',
        zIndex: 1000
      }}>
        <select
          value={focusSound}
          onChange={(e) => setFocusSound(e.target.value as any)}
          style={{
            padding: '5px 10px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            background: 'white'
          }}
        >
          <option value="off">🔇 إيقاف</option>
          <option value="rain">🌧️ مطر</option>
          <option value="waves">🌊 أمواج</option>
          <option value="forest">🌲 غابة</option>
        </select>
        
        {focusSound !== 'off' && (
          <audio autoPlay loop src={getSoundUrl()} style={{ display: 'none' }} />
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
