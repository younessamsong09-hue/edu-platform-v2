import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

interface Lesson {
  id: number
  title_ar: string
  subject_id: number
  level: string
  is_published: boolean
  chapter: number
}

interface Subject {
  id: number
  name_ar: string
}

export default function AdminDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState({
    title_ar: '',
    description: '',
    video_url: '',
    subject_id: 1,
    level: 'jtm',
    chapter: 1,
    order_num: 1,
    is_published: true
  })
  const navigate = useNavigate()

  useEffect(() => {
    checkAdmin()
    fetchLessons()
    fetchSubjects()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'admin@example.com') {
      navigate('/')
    }
  }

  async function fetchLessons() {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .order('subject_id')
      .order('chapter')
      .order('order_num')
    
    if (data) setLessons(data)
    setLoading(false)
  }

  async function fetchSubjects() {
    const { data } = await supabase
      .from('subjects')
      .select('id, name_ar')
      .order('id')
    
    if (data) setSubjects(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (editingLesson) {
      // تحديث درس
      const { error } = await supabase
        .from('lessons')
        .update(formData)
        .eq('id', editingLesson.id)
      
      if (!error) {
        alert('تم تحديث الدرس بنجاح')
        setEditingLesson(null)
        fetchLessons()
      }
    } else {
      // إضافة درس جديد
      const { error } = await supabase
        .from('lessons')
        .insert([{
          ...formData,
          title: formData.title_ar
        }])
      
      if (!error) {
        alert('تم إضافة الدرس بنجاح')
        fetchLessons()
      }
    }
    
    setShowForm(false)
    setFormData({
      title_ar: '',
      description: '',
      video_url: '',
      subject_id: 1,
      level: 'jtm',
      chapter: 1,
      order_num: 1,
      is_published: true
    })
  }

  async function deleteLesson(id: number) {
    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id)
      
      if (!error) {
        alert('تم حذف الدرس بنجاح')
        fetchLessons()
      }
    }
  }

  function editLesson(lesson: Lesson) {
    setEditingLesson(lesson)
    setFormData({
      title_ar: lesson.title_ar,
      description: lesson.description || '',
      video_url: lesson.video_url || '',
      subject_id: lesson.subject_id,
      level: lesson.level,
      chapter: lesson.chapter,
      order_num: lesson.order_num,
      is_published: lesson.is_published
    })
    setShowForm(true)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333' }}>📚 لوحة تحكم الأساتذة</h1>
        <button
          onClick={() => {
            setEditingLesson(null)
            setShowForm(!showForm)
          }}
          style={{
            background: '#4f46e5',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'إغلاق' : '+ درس جديد'}
        </button>
      </div>

      {/* نموذج إضافة/تعديل درس */}
      {showForm && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ marginBottom: '20px' }}>{editingLesson ? 'تعديل الدرس' : 'إضافة درس جديد'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>عنوان الدرس بالعربية</label>
              <input
                type="text"
                value={formData.title_ar}
                onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>وصف الدرس</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>رابط الفيديو (YouTube embed)</label>
              <input
                type="text"
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>المادة</label>
                <select
                  value={formData.subject_id}
                  onChange={(e) => setFormData({...formData, subject_id: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name_ar}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>المستوى</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="jtm">الجذع المشترك</option>
                  <option value="1bac">الأولى باكالوريا</option>
                  <option value="2bac">الثانية باكالوريا</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>رقم الفصل</label>
                <input
                  type="number"
                  value={formData.chapter}
                  onChange={(e) => setFormData({...formData, chapter: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label>ترتيب الدرس</label>
                <input
                  type="number"
                  value={formData.order_num}
                  onChange={(e) => setFormData({...formData, order_num: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                />
                {' '}منشور
              </label>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {editingLesson ? 'تحديث الدرس' : 'إضافة الدرس'}
            </button>
          </form>
        </div>
      )}

      {/* قائمة الدروس */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', textAlign: 'right' }}>
              <th style={{ padding: '15px' }}>العنوان</th>
              <th style={{ padding: '15px' }}>المادة</th>
              <th style={{ padding: '15px' }}>المستوى</th>
              <th style={{ padding: '15px' }}>الحالة</th>
              <th style={{ padding: '15px' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{lesson.title_ar}</td>
                <td style={{ padding: '15px' }}>
                  {subjects.find(s => s.id === lesson.subject_id)?.name_ar}
                </td>
                <td style={{ padding: '15px' }}>
                  {lesson.level === 'jtm' ? 'جذع مشترك' : lesson.level === '1bac' ? '1باك' : '2باك'}
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: lesson.is_published ? '#d4edda' : '#f8d7da',
                    color: lesson.is_published ? '#155724' : '#721c24'
                  }}>
                    {lesson.is_published ? 'منشور' : 'غير منشور'}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <button
                    onClick={() => editLesson(lesson)}
                    style={{
                      background: '#667eea',
                      color: 'white',
                      padding: '5px 15px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => deleteLesson(lesson.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '5px 15px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
