import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface Lesson {
  id: number
  title: string
  title_ar: string
  description: string
  content: string
  subject_id: number
  subject_name?: string
}

interface Subject {
  id: number
  name_ar: string
  icon: string
  color: string
}

export default function AITutorDarija() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [searching, setSearching] = useState(false)
  const [foundLessons, setFoundLessons] = useState<Lesson[]>([])
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    checkUser()
    fetchSubjects()
    loadConversation()
    
    setMessages([{
      id: '1',
      text: 'سلام عليكم! 🌟\n\nأنا المدرس الذكي ديالكم بالدارجة.\n\nأقدر نعاونك فهاد المواد:\n📐 الرياضيات\n⚛️ الفيزياء\n📖 العربية\n🇬🇧 الإنجليزية\n🇫🇷 الفرنسية\n\nواش حاب تسأل عليه؟',
      sender: 'ai',
      timestamp: new Date()
    }])
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function fetchSubjects() {
    const { data } = await supabase
      .from('subjects')
      .select('id, name_ar, icon, color')
      .order('id')
    
    if (data) setSubjects(data)
  }

  async function loadConversation() {
    if (!user) return
    
    const { data } = await supabase
      .from('tutor_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
    
    if (data && data.messages) {
      setMessages(data.messages)
    }
  }

  async function saveConversation(messagesList: Message[]) {
    if (!user) return
    
    await supabase
      .from('tutor_conversations')
      .upsert({
        user_id: user.id,
        messages: messagesList,
        updated_at: new Date().toISOString()
      })
  }

  useEffect(() => {
    scrollToBottom()
    if (messages.length > 0 && user) {
      saveConversation(messages)
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // دالة البحث في الدروس
  async function searchInLessons(query: string): Promise<Lesson[]> {
    setSearching(true)
    
    const { data } = await supabase
      .from('lessons')
      .select('*, subjects(name_ar)')
      .ilike('title_ar', `%${query}%`)
      .eq('is_published', true)
      .limit(5)
    
    if (data && data.length > 0) {
      return data.map(l => ({
        ...l,
        subject_name: l.subjects?.name_ar
      }))
    }
    
    // بحث في الوصف أيضاً
    const { data: descData } = await supabase
      .from('lessons')
      .select('*, subjects(name_ar)')
      .ilike('description', `%${query}%`)
      .eq('is_published', true)
      .limit(5)
    
    if (descData && descData.length > 0) {
      return descData.map(l => ({
        ...l,
        subject_name: l.subjects?.name_ar
      }))
    }
    
    setSearching(false)
    return []
  }

  // دالة النطق
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) window.speechSynthesis.cancel()
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-MA'
      utterance.rate = 0.85
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  // دالة الإدخال الصوتي
  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'ar-MA'
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onstart = () => setIsRecording(true)
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        setInputMessage(text)
        setIsRecording(false)
      }
      recognition.onerror = () => {
        setIsRecording(false)
        alert("ما قدرتش نسمعك. عاود حاول")
      }
      recognition.start()
      recognitionRef.current = recognition
    } else {
      alert("متصفحك ما كايدعمش الإدخال الصوتي")
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  // الردود بالدارجة مع البحث في الدروس
  const getResponse = async (question: string): Promise<string> => {
    const q = question.toLowerCase()
    
    // البحث في الدروس أولاً
    const lessons = await searchInLessons(question)
    
    if (lessons.length > 0) {
      setFoundLessons(lessons)
      let response = `📚 **لقيت دروس كاتشبه لسؤالك:**\n\n`
      
      lessons.forEach((lesson, index) => {
        const subject = subjects.find(s => s.id === lesson.subject_id)
        response += `${index + 1}. **${lesson.title_ar}**\n`
        response += `   📖 ${subject?.name_ar || 'عام'} | ${lesson.description?.substring(0, 80)}...\n`
        response += `   🔗 /courses/lesson/${lesson.id}\n\n`
      })
      
      response += `واش بغيتي نعاونك فوحدة منهم؟`
      return response
    }
    
    // ردود سريعة حسب المادة
    if (q.includes('رياضيات') || q.includes('معادلة')) {
      return `📐 **الرياضيات بالدارجة**\n\nهيا نحلوا مع بعض:\n\nمثال: 2س + 5 = 15\n1. نحيدو 5 من الطرفين: 2س = 10\n2. نقسمو على 2: س = 5\n\nعندك معادلة معينة؟ دوزها ليا!`
    }
    
    if (q.includes('فيزياء') || q.includes('نيوتن')) {
      return `⚛️ **الفيزياء بالدارجة**\n\nقوانين نيوتن:\n\n1️⃣ الجسم الساكن يبقى ساكن\n2️⃣ القوة = الكتلة × التسارع\n3️⃣ لكل فعل رد فعل مساوي ليه\n\nواش بغيتي شرح لواحد منهم؟`
    }
    
    if (q.includes('عربية') || q.includes('نحو')) {
      return `📖 **العربية بالدارجة**\n\nأقسام الكلمة:\n🔹 الاسم: كتاب، شجرة\n🔹 الفعل: كتب، يكتب\n🔹 الحرف: في، على، من\n\nبغيتي نمثلك بجملة؟`
    }
    
    if (q.includes('امتحان') || q.includes('بكالوريا')) {
      return `📝 **نصائح للبكالوريا بالدارجة**\n\n1. نظم وقتك\n2. راجع بانتظام\n3. حل تمارين السنوات السابقة\n4. نام مليح\n5. كل صحي\n\nبغيتي نصائح لمادة معينة؟`
    }
    
    return `🤖 **المدرس الذكي بالدارجة**\n\nأهلا بيك! تقدر تسألني على:\n\n📐 الرياضيات\n⚛️ الفيزياء\n📖 العربية\n📝 نصائح للبكالوريا\n\nأو تقدر تسألني على أي درس وندور عليه فالمكتبة ديالنا!\n\nشنو حاب تسأل عليه؟`
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    const userQuestion = inputMessage
    setInputMessage('')
    setIsLoading(true)
    setFoundLessons([])

    setTimeout(async () => {
      const aiResponse = await getResponse(userQuestion)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
      
      setTimeout(() => {
        speak(aiResponse)
      }, 500)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = async () => {
    if (confirm('واش بغيتي تمحي كل المحادثة؟')) {
      setMessages([{
        id: Date.now().toString(),
        text: 'سلام عليكم! أنا المدرس الذكي ديالكم. شنو حاب تسأل عليه؟',
        sender: 'ai',
        timestamp: new Date()
      }])
      if (user) {
        await supabase
          .from('tutor_conversations')
          .delete()
          .eq('user_id', user.id)
      }
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '10px', height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '15px',
        padding: '12px 15px',
        marginBottom: '10px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>🤖</span>
            <div>
              <h2 style={{ fontSize: '16px', margin: 0 }}>المدرس الذكي بالدارجة</h2>
              <p style={{ fontSize: '10px', opacity: 0.8, margin: 0 }}>يبحث في الدروس + نطق + صوتي</p>
            </div>
          </div>
          <button onClick={clearChat} style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '15px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '11px'
          }}>
            مسح
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '15px', fontSize: '10px' }}>📐 رياضيات</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '15px', fontSize: '10px' }}>⚛️ فيزياء</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '15px', fontSize: '10px' }}>📖 عربية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '15px', fontSize: '10px' }}>🔍 بحث في الدروس</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '15px', fontSize: '10px' }}>🎤 صوتي</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#f9fafb',
        borderRadius: '15px',
        padding: '15px',
        marginBottom: '10px'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '12px'
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: '18px',
              background: msg.sender === 'user' ? '#667eea' : 'white',
              color: msg.sender === 'user' ? 'white' : '#333',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              whiteSpace: 'pre-wrap'
            }}>
              <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                {msg.text.split('\n').map((line, i) => (
                  <div key={i}>
                    {line.includes('/courses/lesson/') ? (
                      <Link to={line.split('🔗 ')[1]} style={{ color: msg.sender === 'user' ? 'white' : '#667eea', textDecoration: 'underline' }}>
                        {line}
                      </Link>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
              <div style={{
                fontSize: '9px',
                marginTop: '5px',
                color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#999',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{msg.timestamp.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.sender === 'ai' && (
                  <button onClick={() => speak(msg.text)} style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '11px',
                    cursor: 'pointer',
                    color: msg.sender === 'user' ? 'white' : '#667eea',
                    marginLeft: '8px'
                  }}>
                    🔊
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'white', padding: '8px 15px', borderRadius: '18px' }}>
              {searching ? '🔍 جاري البحث في الدروس...' : '✍️ جاري التفكير...'}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اسأل عن أي درس... مثلاً: شرح المعادلات أو بحث عن الدوال"
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            resize: 'none',
            fontSize: '13px',
            minHeight: '40px',
            fontFamily: 'inherit',
            background: 'white'
          }}
          rows={1}
        />
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            padding: '10px',
            background: isRecording ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            fontSize: '18px'
          }}
        >
          {isRecording ? '⏹️' : '🎤'}
        </button>
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          style={{
            padding: '10px 18px',
            background: !inputMessage.trim() ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: !inputMessage.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          إرسال
        </button>
      </div>

      <Link to="/courses">
        <button style={{
          marginTop: '10px',
          width: '100%',
          padding: '8px',
          background: '#f3f4f6',
          color: '#333',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          ← العودة للدروس
        </button>
      </Link>

      {isSpeaking && (
        <div style={{
          position: 'fixed',
          bottom: '70px',
          right: '10px',
          background: '#667eea',
          color: 'white',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '10px'
        }}>
          🔊 جاري النطق...
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
