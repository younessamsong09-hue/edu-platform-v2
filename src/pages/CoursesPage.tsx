export default function CoursesPage() {
  const subjects = [
    { id: 1, name: 'الرياضيات', icon: '📐', color: '#3b82f6' },
    { id: 2, name: 'الفيزياء والكيمياء', icon: '⚛️', color: '#10b981' },
    { id: 3, name: 'اللغة العربية', icon: '📖', color: '#f59e0b' }
  ]

  return (
    <div style={{ padding: '20px', direction: 'rtl', textAlign: 'center' }}>
      <h1>📚 المواد الدراسية</h1>
      <div style={{ display: 'grid', gap: '15px' }}>
        {subjects.map(s => (
          <div key={s.id} style={{ background: s.color, color: 'white', padding: '20px', borderRadius: '15px' }}>
            <span style={{ fontSize: '2rem' }}>{s.icon}</span>
            <h3>{s.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
