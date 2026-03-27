import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const mainLinks = [
    { path: '/', icon: '🏠', label: 'الرئيسية' },
    { path: '/courses', icon: '📚', label: 'الدروس' },
    { path: '/exams', icon: '📝', label: 'الامتحانات' },
    { path: '/grade-calculator', icon: '📊', label: 'المعدل' },
    { path: '/profile', icon: '👤', label: 'ملفي' }
  ]

  const allLinks = [
    { path: '/national-exams', icon: '🎯', label: 'بكالوريا' },
    { path: '/games', icon: '🎮', label: 'ألعاب' },
    { path: '/competitions', icon: '🏆', label: 'مسابقات' },
    { path: '/library', icon: '📚', label: 'المكتبة' },
    { path: '/leaderboard', icon: '🏅', label: 'التصنيف' },
    { path: '/neighborhood-leaderboard', icon: '🏘️', label: 'أحياء' },
    { path: '/peer-help', icon: '🤝', label: 'ساعد زميلك' },
    { path: '/common-mistakes', icon: '⚠️', label: 'أخطاء شائعة' },
    { path: '/visual-mistakes', icon: '🔍', label: 'بحث بالصور' },
    { path: '/career-guidance', icon: '🎓', label: 'توجيه مدرسي' },
    { path: '/recommendations', icon: '🤖', label: 'توصيات' },
    { path: '/ai-tutor', icon: '🤖', label: 'مدرس AI' },
    { path: '/ai-darija', icon: '🗣️', label: 'مدرس بالدارجة' },
    { path: '/english-tips', icon: '💡', label: 'نصائح' },
    { path: '/about', icon: '📖', label: 'عن المنصة' }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 12px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        borderTop: '1px solid #eee'
      }}>
        {mainLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              color: isActive(link.path) ? '#667eea' : '#999',
              fontSize: '12px',
              padding: '4px 8px'
            }}
          >
            <span style={{ fontSize: '24px' }}>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: isOpen ? '#667eea' : '#999',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '24px' }}>☰</span>
          <span>القائمة</span>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1001
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '280px',
            background: 'white',
            zIndex: 1002,
            padding: '20px',
            overflowY: 'auto',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>📚 القائمة</h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            </div>
            
            {allLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  textDecoration: 'none',
                  color: isActive(link.path) ? '#667eea' : '#333',
                  borderRadius: '10px',
                  marginBottom: '5px'
                }}
              >
                <span style={{ fontSize: '24px' }}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
