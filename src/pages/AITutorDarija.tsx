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
      text: 'سلام عليكم! 🌟\n\nأنا المدرس الذكي ديالكم بالدارجة.\n\nأقدر نعاونك فهاد المواد:\n\n📐 **الرياضيات** - حل المعادلات، الدوال، النهايات\n⚛️ **الفيزياء** - قوانين نيوتن، الحركة، الطاقة\n📖 **العربية** - النحو، الصرف، البلاغة\n📝 **نصائح للبكالوريا** - طرق المراجعة\n\nشنو حاب تسأل عليه؟',
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

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'ar-MA'
      recognition.onstart = () => setIsRecording(true)
      recognition.onresult = (event: any) => {
        setInputMessage(event.results[0][0].transcript)
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

  const getResponse = (question: string): string => {
    const q = question.toLowerCase()
    
    if (q.includes('رياضيات') || q.includes('معادلة') || q.includes('حل')) {
      return `📐 **الرياضيات بالدارجة**\n\n` +
        `**مثال على حل معادلة:**\n\n` +
        `المعادلة: 2س + 5 = 15\n\n` +
        `**الخطوة 1:** نحيدو 5 من الطرفين\n` +
        `2س = 15 - 5\n` +
        `2س = 10\n\n` +
        `**الخطوة 2:** نقسمو على 2\n` +
        `س = 10 ÷ 2\n\n` +
        `**النتيجة:** س = 5 ✅\n\n` +
        `عندك معادلة معينة؟ دوزها ليا نحلهالك!`
    }
    
    if (q.includes('فيزياء') || q.includes('نيوتن') || q.includes('حركة')) {
      return `⚛️ **الفيزياء بالدارجة**\n\n` +
        `**قوانين نيوتن للحركة:**\n\n` +
        `**1️⃣ القانون الأول (القصور الذاتي):**\n` +
        `"الجسم الساكن يبقى ساكن، والجسم المتحرك يبقى متحرك، إلا إذا تأثر بقوة خارجية"\n\n` +
        `**2️⃣ القانون الثاني (التسارع):**\n` +
        `القوة = الكتلة × التسارع\n` +
        `F = m × a\n\n` +
        `**3️⃣ القانون الثالث (الفعل ورد الفعل):**\n` +
        `"لكل فعل رد فعل مساوي ليه فالمقدار ومعاكس فالاتجاه"\n\n` +
        `واش بغيتي شرح لواحد منهم بالتفصيل؟`
    }
    
    if (q.includes('عربية') || q.includes('نحو') || q.includes('قواعد')) {
      return `📖 **اللغة العربية بالدارجة**\n\n` +
        `**أقسام الكلمة:**\n\n` +
        `🔹 **الاسم**: كلمة كاتعبر على معنى بلا زمن\n` +
        `مثال: كتاب، شجرة، محمد، مكة\n\n` +
        `🔹 **الفعل**: كلمة كاتعبر على حدث مقترن بزمن\n` +
        `- الماضي: كتب، قرأ\n` +
        `- المضارع: يكتب، يقرأ\n` +
        `- الأمر: اكتب، اقرأ\n\n` +
        `🔹 **الحرف**: كلمة ماكاتعبرش على معنى فحد ذاتها\n` +
        `مثال: في، على، من، إلى\n\n` +
        `بغيتي نمثلك بجملة كاملة؟`
    }
    
    if (q.includes('امتحان') || q.includes('بكالوريا') || q.includes('نصائح') || q.includes('مراجعة')) {
      return `📝 **نصائح للبكالوريا بالدارجة**\n\n` +
        `**قبل الامتحان:**\n` +
        `1️⃣ **نظم وقتك**: قسم المواد على الأيام\n` +
        `2️⃣ **راجع بانتظام**: كل يوم شوية أحسن من مرة فالشهر\n` +
        `3️⃣ **حل تمارين**: اكثر من حل التمارين ديال السنوات السابقة\n` +
        `4️⃣ **نام مليح**: 8 ساعات قبل الامتحان ضرورية\n` +
        `5️⃣ **كل صحي**: الفطور مهم باش تركز مليح\n\n` +
        `**فالامتحان:**\n` +
        `• اقرا الأسئلة باه\n` +
        `• قسم الوقت بين الأسئلة\n` +
        `• ابدا بالسهل ثم الصعب\n` +
        `• راجع الجواب قبل ما تسلم\n\n` +
        `بغيتي نصائح لمادة معينة؟`
    }
    
    if (q.includes('شكرا') || q.includes('merci')) {
      return `العفو! 🙏\n\nأنا هنا باش نعاونك فكل وقت.\n\nواش عندك سؤال آخر؟`
    }
    
    return `🤖 **المدرس الذكي بالدارجة**\n\n` +
      `أهلا بيك! تقدر تسألني على:\n\n` +
      `📐 **الرياضيات**\n` +
      `• حل المعادلات (مثال: حل المعادلة 2س+5=15)\n` +
      `• شرح الدوال\n` +
      `• شرح النهايات\n\n` +
      `⚛️ **الفيزياء**\n` +
      `• شرح قوانين نيوتن\n` +
      `• شرح الحركة والتسارع\n` +
      `• شرح الطاقة\n\n` +
      `📖 **العربية**\n` +
      `• شرح أقسام الكلمة\n` +
      `• شرح المبتدأ والخبر\n` +
      `• شرح الأفعال\n\n` +
      `📝 **نصائح للبكالوريا**\n` +
      `• كيفاش نقرا للبكالوريا\n` +
      `• نصائح ليلة الامتحان\n\n` +
      `شنو حاب تسأل عليه؟`
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
      text: 'سلام عليكم! 🌟\n\nأنا المدرس الذكي ديالكم.\n\nشنو حاب تسأل عليه؟',
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
            <div style={{ fontSize: '48px' }}>🤖</div>
            <h1 style={{ fontSize: '24px', margin: '5px 0' }}>المدرس الذكي بالدارجة</h1>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>اسألني بالدارجة! كنفهم العربية والفرنسية والإنجليزية</p>
          </div>
          <button onClick={clearChat} style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '20px',
            color: 'white',
            cursor: 'pointer'
          }}>
            🗑️ مسح
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>📐 حل معادلات</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>⚛️ فيزياء</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>📖 عربية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>📝 نصائح بكالوريا</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>🎤 صوتي</span>
        </div>
      </div>

      {/* Messages Area */}
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
            marginBottom: '20px'
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '15px 20px',
              borderRadius: '20px',
              background: msg.sender === 'user' ? '#667eea' : 'white',
              color: msg.sender === 'user' ? 'white' : '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              whiteSpace: 'pre-wrap'
            }}>
              <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
                {msg.text}
              </div>
              <div style={{
                fontSize: '10px',
                marginTop: '8px',
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
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: msg.sender === 'user' ? 'white' : '#667eea',
                    marginLeft: '10px'
                  }}>
                    🔊
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
            <div style={{ background: 'white', padding: '12px 20px', borderRadius: '20px' }}>
              <span style={{ animation: 'pulse 1s infinite' }}>✍️</span> جاري الكتابة...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب سؤالك بالدارجة... أو استخدم الميكروفون 🎤"
          style={{
            flex: 1,
            padding: '12px 15px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            resize: 'none',
            fontSize: '14px',
            minHeight: '50px',
            fontFamily: 'inherit',
            background: 'white'
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
            borderRadius: '50%',
            cursor: 'pointer',
            width: '50px',
            height: '50px',
            fontSize: '20px'
          }}
          title={isRecording ? 'إيقاف التسجيل' : 'تسجيل صوتي'}
        >
          {isRecording ? '⏹️' : '🎤'}
        </button>
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          style={{
            padding: '12px 25px',
            background: !inputMessage.trim() ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
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
          marginTop: '15px',
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

      {isSpeaking && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#667eea',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '30px',
          fontSize: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
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
