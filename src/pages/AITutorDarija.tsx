import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AITutorDarija() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkUser()
    setMessages([{
      id: '1',
      text: 'سلام عليكم! 🌟 أنا المدرس الذكي ديالكم. كيفاش نقدر نعاونك فهاد النهار؟\n\nأقدر نعاونك فهاد المواد:\n📐 الرياضيات\n⚛️ الفيزياء\n📖 العربية\n🇬🇧 الإنجليزية\n🇫🇷 الفرنسية\n\nشحال حاب تبدأ؟',
      sender: 'ai',
      timestamp: new Date()
    }])
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getDarijaResponse = async (question: string): Promise<string> => {
    const q = question.toLowerCase()
    
    if (q.includes('رياضيات') || q.includes('جبر') || q.includes('معادلة')) {
      return `📐 **الرياضيات بالدارجة**:\n\nسؤال ديالك: ${question}\n\nمثال: 2س + 5 = 15\n- نحيدو 5 من الطرفين: 2س = 10\n- نقسمو على 2: س = 5\n\nعندك معادلة معينة؟ دوزها ليا ونحلهالك!`
    }
    
    if (q.includes('فيزياء') || q.includes('حركة') || q.includes('قوة')) {
      return `⚛️ **الفيزياء بالدارجة**:\n\nقوانين نيوتن:\n\n1️⃣ القانون الأول: الجسم الساكن يبقى ساكن، والجسم المتحرك يبقى متحرك\n2️⃣ القانون الثاني: القوة = الكتلة × التسارع\n3️⃣ القانون الثالث: لكل فعل رد فعل مساوي ليه فالمقدار ومعاكس فالاتجاه`
    }
    
    if (q.includes('عربية') || q.includes('نحو')) {
      return `📖 **اللغة العربية بالدارجة**:\n\nأقسام الكلمة:\n🔹 الاسم: كتاب، شجرة\n🔹 الفعل: كتب، يكتب\n🔹 الحرف: في، على، من`
    }
    
    if (q.includes('انجليزي') || q.includes('english')) {
      return `🇬🇧 **English with Darija**:\n\nPresent Simple:\nI/You/We/They + verb\nHe/She/It + verb + s\n\nExample: I play football. She plays tennis.`
    }
    
    if (q.includes('فرنسي') || q.includes('french')) {
      return `🇫🇷 **Français avec Darija**:\n\nBonjour = صباح الخير\nBonsoir = مساء الخير\nComment ça va? = كيفاش حالك؟\nAu revoir = مع السلامة`
    }
    
    if (q.includes('امتحان') || q.includes('بكالوريا')) {
      return `📝 **نصائح للبكالوريا**:\n\n1. نظم وقتك\n2. راجع بانتظام\n3. حل تمارين السنوات السابقة\n4. نام مليح قبل الامتحان\n5. كل صحي`
    }
    
    return `🤖 **المدرس الذكي بالدارجة**:\n\nأهلا بيك! تقدر تسألني على:\n\n📐 الرياضيات\n⚛️ الفيزياء\n📖 العربية\n🇬🇧 الإنجليزية\n🇫🇷 الفرنسية\n📝 نصائح للبكالوريا\n\nشنو حاب تسأل عليه؟`
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
    setInputMessage('')
    setIsLoading(true)

    setTimeout(async () => {
      const aiResponse = await getDarijaResponse(inputMessage)
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🤖</div>
        <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>المدرس الذكي بالدارجة</h1>
        <p style={{ opacity: 0.9 }}>اسألني بالدارجة! كنفهم العربية والفرنسية والإنجليزية</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>📐 رياضيات</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>⚛️ فيزياء</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>📖 عربية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>🇬🇧 إنجليزية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>🇫🇷 فرنسية</span>
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#f9fafb',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        {messages.map((message) => (
          <div key={message.id} style={{
            display: 'flex',
            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '15px'
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: '20px',
              background: message.sender === 'user' ? '#667eea' : 'white',
              color: message.sender === 'user' ? 'white' : '#333',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              wordBreak: 'break-word'
            }}>
              <div style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {message.text}
              </div>
              <div style={{
                fontSize: '10px',
                marginTop: '5px',
                color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#999',
                textAlign: 'left'
              }}>
                {message.timestamp.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
            <div style={{
              background: 'white',
              padding: '12px 18px',
              borderRadius: '20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ animation: 'blink 1.4s infinite' }}>●</span>
                <span style={{ animation: 'blink 1.4s infinite 0.2s' }}>●</span>
                <span style={{ animation: 'blink 1.4s infinite 0.4s' }}>●</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب سؤالك بالدارجة... مثلاً: شرحلي المعادلات، شنو هو قانون نيوتن"
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #ddd',
            resize: 'none',
            fontSize: '14px',
            fontFamily: 'inherit',
            minHeight: '60px'
          }}
          rows={2}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          style={{
            padding: '12px 24px',
            background: !inputMessage.trim() ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: !inputMessage.trim() ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          إرسال ✨
        </button>
      </div>

      <Link to="/courses">
        <button style={{
          marginTop: '20px',
          width: '100%',
          padding: '12px',
          background: '#f3f4f6',
          color: '#333',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer'
        }}>
          ← العودة إلى الدروس
        </button>
      </Link>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
