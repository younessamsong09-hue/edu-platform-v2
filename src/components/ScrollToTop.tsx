import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '45px',
        height: '45px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        fontSize: '20px',
        zIndex: 1000,
        transition: 'all 0.3s'
      }}
    >
      ↑
    </button>
  )
}
