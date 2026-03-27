import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Textbook {
  id: number
  title: string
  title_ar: string
  grade: string
  level: string
  description: string
  subject_id: number
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function BookAssistant() {
  const { id } = useParams()
  const [book, setBook] = useState<Textbook | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBook()
    setMessages([{
      id: '1',
      text: `📚 مرحبا بك في المساعد الذكي!\n\nأنا هنا لمساعدتك في فهم كتاب "${book?.title_ar || ''}".\n\nيمكنك أن تسألني عن:\n\n📖 شرح أي درس في الكتاب\n✍️ حل التمارين\n📝 تلخيص الصفحات\n🎯 المفاهيم الرئيسية\n\nشنو حاب تسأل عليه؟`,
      sender: 'ai',
      timestamp: new Date()
    }])
  }, [id])

  async function fetchBook() {
    const { data } = await supabase
      .from('textbooks')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) setBook(data)
    setLoading(false)
  }

  const getResponse = (question: string): string => {
    const q = question.toLowerCase()
    
    if (q.includes('شرح') || q.includes('فهم') || q.includes('مفهمتش')) {
      return `📖 **شرح الدرس**\n\nهاد الدرس كايتعلق بـ ${book?.title_ar}. باش تفهمو مليح:\n\n1️⃣ اقرا النص باه\n2️⃣ حدد الأفكار الرئيسية\n3️⃣ شوف الأمثلة\n4️⃣ حل التمارين\n\nواش بغيتي نشرح ليك نقطة معينة؟`
    }
    
    if (q.includes('تمرين') || q.includes('حل')) {
      return `✍️ **حل التمارين**\n\nباش تحل التمارين:\n\n1️⃣ اقرا السؤال باه\n2️⃣ حدد المعطيات\n3️⃣ طبق القواعد\n4️⃣ تحقق من الجواب\n\nعندك تمرين معين؟ دوزو ليا نحلوه!`
    }
    
    if (q.includes('تلخيص') || q.includes('ملخص')) {
      return `📝 **تلخيص**\n\nهاد الكتاب كايهضر على ${book?.title_ar}. الأفكار الرئيسية:\n\n✓ ${book?.description?.substring(0, 100)}...\n✓ أمثلة تطبيقية\n✓ تمارين متنوعة\n\nبغيتي تلخيص لدرس معين؟`
    }
    
    return `🤖 **المساعد الذكي**\n\nأنا هنا لمساعدتك في فهم كتاب "${book?.title_ar}".\n\nتقدر تسألني:\n\n📖 "شرحلي الدرس الأول"\n✍️ "حل التمرين رقم 3"\n📝 "لخص الصفحة 10"\n🎯 "شنو هي المفاهيم الرئيسية"\n\nشنو حاب تسأل عليه؟`
  }

  const sendMessage = () => {
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

    setTimeout(() => {
      const aiResponse = getResponse(userQuestion)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 500)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '15px',
        padding: '15px',
        marginBottom: '15px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '30px' }}>📚</span>
          <div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>{book?.title_ar}</h2>
            <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>المساعد الذكي بالدارجة</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#f9fafb',
        borderRadius: '15px',
        padding: '15px',
        marginBottom: '15px'
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
                {msg.text}
              </div>
              <div style={{
                fontSize: '9px',
                marginTop: '5px',
                color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#999'
              }}>
                {msg.timestamp.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'white', padding: '8px 15px', borderRadius: '18px' }}>
              <span>✍️ جاري التفكير...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="اسأل عن أي شيء في الكتاب..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            resize: 'none',
            fontSize: '13px',
            minHeight: '40px',
            fontFamily: 'inherit'
          }}
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          style={{
            padding: '10px 20px',
            background: !inputMessage.trim() ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: !inputMessage.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          إرسال
        </button>
      </div>

      <Link to="/library">
        <button style={{
          marginTop: '10px',
          width: '100%',
          padding: '8px',
          background: '#f3f4f6',
          color: '#333',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}>
          ← العودة إلى المكتبة
        </button>
      </Link>
    </div>
  )
}
