import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AdminPanel() {
  const [lesson, setLesson] = useState({
    subject_id: 1,
    title_ar: '',
    description: '',
    video_url: '',
    level: 'jtm',
    chapter: 1,
    order_num: 1
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function addLesson() {
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase
      .from('lessons')
      .insert([{
        subject_id: lesson.subject_id,
        title: lesson.title_ar,
        title_ar: lesson.title_ar,
        description: lesson.description,
        video_url: lesson.video_url,
        level: lesson.level,
        chapter: lesson.chapter,
        order_num: lesson.order_num,
        is_published: true
      }])
    
    if (error) {
      setMessage('❌ خطأ: ' + error.message)
    } else {
      setMessage('✅ تم إضافة الدرس بنجاح!')
      setLesson({
        subject_id: 1,
        title_ar: '',
        description: '',
        video_url: '',
        level: 'jtm',
        chapter: 1,
        order_num: 1
      })
    }
    
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>📝 إضافة درس جديد</h1>
      
      {message && (
        <div style={{
          padding: '10px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}
      
      <select
        value={lesson.subject_id}
        onChange={e => setLesson({...lesson, subject_id: parseInt(e.target.value)})}
        style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
      >
        <option value={1}>الرياضيات</option>
        <option value={2}>الفيزياء والكيمياء</option>
        <option value={3}>اللغة العربية</option>
        <option value={4}>اللغة الفرنسية</option>
        <option value={5}>اللغة الإنجليزية</option>
        <option value={6}>الفلسفة</option>
        <option value={7}>التاريخ والجغرافيا</option>
        <option value={8}>التربية الإسلامية</option>
      </select>
      
      <input
        type="text"
        placeholder="عنوان الدرس بالعربية"
        value={lesson.title_ar}
        onChange={e => setLesson({...lesson, title_ar: e.target.value})}
        style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
      />
      
      <textarea
        placeholder="وصف الدرس"
        value={lesson.description}
        onChange={e => setLesson({...lesson, description: e.target.value})}
        style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
      />
      
      <input
        type="text"
        placeholder="رابط الفيديو (YouTube embed)"
        value={lesson.video_url}
        onChange={e => setLesson({...lesson, video_url: e.target.value})}
        style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
      />
      
      <select
        value={lesson.level}
        onChange={e => setLesson({...lesson, level: e.target.value})}
        style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
      >
        <option value="jtm">الجذع المشترك</option>
        <option value="1bac">الأولى باكالوريا</option>
        <option value="2bac">الثانية باكالوريا</option>
      </select>
      
      <input
        type="number"
        placeholder="رقم الفصل"
        value={lesson.chapter}
        onChange={e => setLesson({...lesson, chapter: parseInt(e.target.value)})}
        style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
      />
      
      <button
        onClick={addLesson}
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'جاري الإضافة...' : '+ إضافة الدرس'}
      </button>
    </div>
  )
}
