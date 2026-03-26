import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s'
      }}
      title={theme === 'light' ? 'الوضع المظلم' : 'الوضع الفاتح'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
