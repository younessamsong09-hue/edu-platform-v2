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
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkUser()
    setMessages([{
      id: '1',
      text: 'سلام عليكم! 🌟 أنا المدرس الذكي ديالكم بالدارجة.\n\nأقدر نعاونك فهاد المواد:\n📐 الرياضيات\n⚛️ الفيزياء\n📖 العربية\n🇬🇧 الإنجليزية\n🇫🇷 الفرنسية\n\nشنو حاب تسأل عليه؟',
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

  // دالة النطق
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) window.speechSynthesis.cancel()
      setIsSpeaking(true)
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-MA'
      utterance.rate = 0.85
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
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

  // الردود بالدارجة
  const getResponse = (question: string): string => {
    const q = question.toLowerCase()
    
    if (q.includes('رياضيات') || q.includes('معادلة')) {
      return `📐 **الرياضيات**:\n\nهيا نحلوا مع بعض:\n\nمثال: 2س + 5 = 15\n1. نحيدو 5 من الطرفين: 2س = 10\n2. نقسمو على 2: س = 5\n\nعندك معادلة معينة؟ دوزها ليا!`
    }
    
    if (q.includes('فيزياء') || q.includes('نيوتن')) {
      return `⚛️ **الفيزياء**:\n\nقوانين نيوتن:\n\n1️⃣ الجسم الساكن يبقى ساكن\n2️⃣ القوة = الكتلة × التسارع\n3️⃣ لكل فعل رد فعل مساوي ليه\n\nواش بغيتي شرح لواحد منهم؟`
    }
    
    if (q.includes('عربية') || q.includes('نحو')) {
      return `📖 **العربية**:\n\nأقسام الكلمة:\n🔹 الاسم: كتاب، شجرة\n🔹 الفعل: كتب، يكتب\n🔹 الحرف: في، على، من\n\nبغيتي نمثلك بجملة؟`
    }
    
    if (q.includes('امتحان') || q.includes('بكالوريا')) {
      return `📝 **نصائح للبكالوريا**:\n\n1. نظم وقتك\n2. راجع بانتظام\n3. حل تمارين السنوات السابقة\n4. نام مليح\n5. كل صحي\n\nبغيتي نصائح لمادة معينة؟`
    }
    
    return `🤖 **المدرس الذكي**:\n\nأهلا بيك! تقدر تسألني على:\n\n📐 الرياضيات\n⚛️ الفيزياء\n📖 العربية\n📝 نصائح للبكالوريا\n\nشنو حاب تسأل عليه؟`
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      text: 'سلام عليكم! أنا المدرس الذكي ديالكم. شنو حاب تسأل عليه؟',
      sender: 'ai',
      timestamp: new Date()
    }])
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '40px' }}>🤖</div>
            <h2 style={{ fontSize: '20px', margin: '5px 0' }}>المدرس الذكي بالدارجة</h2>
            <p style={{ fontSize: '12px', opacity: 0.9 }}>اسألني بالدارجة! كنفهم العربية والفرنسية والإنجليزية</p>
          </div>
          <div>
            <button onClick={clearChat} style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}>
              🗑️ مسح
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>📐 حل معادلات</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>⚛️ فيزياء</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>📖 عربية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>🎤 صوتي</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#f9fafb',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '15px'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '20px',
              background: msg.sender === 'user' ? '#667eea' : 'white',
              color: msg.sender === 'user' ? 'white' : '#333',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>
              <div style={{
                fontSize: '10px',
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
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: msg.sender === 'user' ? 'white' : '#667eea'
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
            <div style={{ background: 'white', padding: '12px', borderRadius: '20px' }}>
              <span style={{ animation: 'pulse 1s infinite' }}>●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب سؤالك بالدارجة... أو استخدم الميكروفون 🎤"
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #ddd',
            resize: 'none',
            fontSize: '14px',
            minHeight: '50px',
            fontFamily: 'inherit'
          }}
          rows={2}
        />
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            padding: '12px',
            background: isRecording ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            width: '50px'
          }}
        >
          {isRecording ? '⏹️' : '🎤'}
        </button>
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          style={{
            padding: '12px 20px',
            background: !inputMessage.trim() ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: !inputMessage.trim() ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          إرسال ✨
        </button>
      </div>

      <Link to="/courses">
        <button style={{
          marginTop: '15px',
          width: '100%',
          padding: '10px',
          background: '#f3f4f6',
          color: '#333',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}>
          ← العودة إلى الدروس
        </button>
      </Link>

      {isSpeaking && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#667eea',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '30px',
          fontSize: '12px'
        }}>
          🔊 جاري النطق...
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
