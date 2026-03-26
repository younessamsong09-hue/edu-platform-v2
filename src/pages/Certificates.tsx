import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface Subject {
  id: number
  name: string
  name_ar: string
  icon: string
  color: string
}

interface Certificate {
  id: string
  certificate_code: string
  issued_at: string
}

export default function Certificates() {
  const { subjectId } = useParams()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [user, setUser] = useState<any>(null)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [totalLessons, setTotalLessons] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    checkUser()
    fetchSubject()
    fetchProgress()
    checkCertificate()
  }, [subjectId])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }
    setUser(user)
  }

  async function fetchSubject() {
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', subjectId)
      .single()
    
    if (data) setSubject(data)
  }

  async function fetchProgress() {
    // جلب عدد الدروس المكتملة لهذه المادة
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('subject_id', subjectId)
      .eq('is_published', true)
    
    if (lessons) {
      setTotalLessons(lessons.length)
      
      const { data: progress } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user?.id)
        .eq('is_completed', true)
      
      if (progress) {
        const completedIds = progress.map(p => p.lesson_id)
        const completedForSubject = lessons.filter(l => completedIds.includes(l.id))
        setCompletedLessons(completedForSubject.map(l => l.id))
      }
    }
    setLoading(false)
  }

  async function checkCertificate() {
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', user?.id)
      .eq('subject_id', subjectId)
      .single()
    
    if (data) setCertificate(data)
  }

  async function generateCertificate() {
    if (completedLessons.length < totalLessons) {
      alert(`تحتاج إلى إكمال جميع دروس المادة (${completedLessons.length}/${totalLessons})`)
      return
    }

    setGenerating(true)

    // إنشاء رمز فريد للشهادة
    const code = `${subject?.name_ar.substring(0, 3)}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase()

    // حفظ الشهادة في قاعدة البيانات
    const { error } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        subject_id: subjectId,
        certificate_code: code
      })

    if (!error) {
      setCertificate({ id: '', certificate_code: code, issued_at: new Date().toISOString() })
      await downloadPDF(code)
    } else {
      alert('حدث خطأ في إنشاء الشهادة')
    }
    
    setGenerating(false)
  }

  async function downloadPDF(code: string) {
    const element = document.getElementById('certificate-content')
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('landscape', 'mm', 'a4')
    const imgWidth = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`شهادة-${subject?.name_ar}-${new Date().toLocaleDateString()}.pdf`)
  }

  const completionPercentage = (completedLessons.length / totalLessons) * 100

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>
  }

  if (!subject) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>المادة غير موجودة</div>
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <Link to="/courses" style={{ color: '#667eea', textDecoration: 'none' }}>
        ← العودة إلى الدروس
      </Link>

      <h1 style={{ fontSize: '32px', margin: '20px 0', color: '#333' }}>
        🎓 شهادة إنجاز - {subject.name_ar}
      </h1>

      {/* شريط التقدم */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>تقدمك في المادة</span>
          <span>{completedLessons.length} / {totalLessons} درس</span>
        </div>
        <div style={{
          background: '#e5e7eb',
          borderRadius: '10px',
          height: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${completionPercentage}%`,
            background: `linear-gradient(135deg, ${subject.color || '#667eea'}, ${subject.color || '#764ba2'})`,
            height: '100%',
            transition: 'width 0.5s'
          }} />
        </div>
        
        {completedLessons.length === totalLessons && !certificate && (
          <button
            onClick={generateCertificate}
            disabled={generating}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '15px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {generating ? 'جاري إنشاء الشهادة...' : '🎓 الحصول على الشهادة'}
          </button>
        )}
        
        {certificate && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#d4edda',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏆</div>
            <strong style={{ color: '#155724' }}>تهانينا! لقد حصلت على الشهادة</strong>
            <div style={{ fontSize: '12px', color: '#155724', marginTop: '5px' }}>
              رمز الشهادة: {certificate.certificate_code}
            </div>
            <button
              onClick={() => downloadPDF(certificate.certificate_code)}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              📥 تحميل الشهادة مرة أخرى
            </button>
          </div>
        )}
      </div>

      {/* تصميم الشهادة (مخفي) */}
      <div id="certificate-content" style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '800px',
        height: '600px',
        background: 'white',
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        border: '20px solid #f3f4f6',
        borderRadius: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{ marginTop: '50px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>{subject.icon}</div>
          <h1 style={{ fontSize: '36px', color: '#333', marginBottom: '20px' }}>
            🎓 شهادة إنجاز
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
            تُمنح هذه الشهادة إلى
          </p>
          <h2 style={{ fontSize: '32px', color: subject.color || '#667eea', marginBottom: '30px', borderBottom: `3px solid ${subject.color || '#667eea'}`, display: 'inline-block', padding: '0 20px' }}>
            {user?.email?.split('@')[0] || 'الطالب'}
          </h2>
          <p style={{ fontSize: '18px', margin: '30px 0' }}>
            لإكماله بنجاح جميع دروس
          </p>
          <h3 style={{ fontSize: '28px', color: '#333', marginBottom: '30px' }}>
            {subject.name_ar}
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '60px',
            padding: '0 40px'
          }}>
            <div>
              <div style={{ borderTop: '2px solid #333', width: '200px', marginBottom: '5px' }} />
              <span>التاريخ: {new Date().toLocaleDateString('ar-MA')}</span>
            </div>
            <div>
              <div style={{ borderTop: '2px solid #333', width: '200px', marginBottom: '5px' }} />
              <span>رمز الشهادة: {certificate?.certificate_code || '...'}</span>
            </div>
          </div>
          <div style={{ marginTop: '30px', fontSize: '12px', color: '#999' }}>
            بوابة المعرفة المغربية | تعليم بلا حدود
          </div>
        </div>
      </div>
    </div>
  )
}
