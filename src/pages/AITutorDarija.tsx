import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface EducationalContent {
  id: number
  topic_darija: string
  explanation_darija: string
  examples: any
  keywords: string[]
}

export default function AITutorDarija() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [content, setContent] = useState<EducationalContent[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkUser()
    fetchContent()
    loadConversation()
    
    setMessages([{
      id: '1',
      text: 'سلام عليكم! 🌟 أنا المدرس الذكي ديالكم فالداريجة. كيفاش نقدر نعاونك فهاد النهار؟\n\nأقدر نعاونك فهاد المواد:\n📐 الرياضيات\n⚛️ الفيزياء\n📖 العربية\n🇬🇧 الإنجليزية\n🇫🇷 الفرنسية\n\nواش حاب تبدأ معايا؟',
      sender: 'ai',
      timestamp: new Date()
    }])
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function fetchContent() {
    const { data } = await supabase
      .from('darija_educational_content')
      .select('*')
      .limit(100)
    
    if (data) setContent(data)
  }

  async function loadConversation() {
    if (!user) return
    
    const { data } = await supabase
      .from('darija_conversations')
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
      .from('darija_conversations')
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

  // دالة النطق
  const speak = (text: string, messageId: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
      }
      
      setIsSpeaking(true)
      setCurrentSpeakingId(messageId)
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-MA'
      utterance.rate = 0.85
      utterance.pitch = 1.1
  
      const voices = window.speechSynthesis.getVoices()
      const arabicVoice = voices.find(voice => voice.lang.includes('ar'))
      if (arabicVoice) {
        utterance.voice = arabicVoice
      }
  
      utterance.onend = () => {
        setIsSpeaking(false)
        setCurrentSpeakingId(null)
      }
  
      utterance.onerror = () => {
        setIsSpeaking(false)
        setCurrentSpeakingId(null)
      }
  
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentSpeakingId(null)
    }
  }

  // دالة الإدخال الصوتي
  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'ar-MA'
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onstart = () => {
        setIsRecording(true)
      }
      
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

  // حل المعادلات
  const solveEquation = (equation: string): string | null => {
    const linearMatch = equation.match(/(\d*)س\s*([+-])\s*(\d+)\s*=\s*(\d+)/)
    if (linearMatch) {
      const a = linearMatch[1] ? parseInt(linearMatch[1]) : 1
      const sign = linearMatch[2]
      const b = parseInt(linearMatch[3])
      const c = parseInt(linearMatch[4])
      
      if (sign === '+') {
        const result = (c - b) / a
        return `📐 **حل المعادلة**:\n\n${equation}\n\nالخطوة 1: نحيدو ${b} من الطرفين\n${a}س = ${c - b}\n\nالخطوة 2: نقسمو على ${a}\nس = ${result}\n\n✅ الحل: س = ${result}`
      } else {
        const result = (c + b) / a
        return `📐 **حل المعادلة**:\n\n${equation}\n\nالخطوة 1: نزيدو ${b} للطرفين\n${a}س = ${c + b}\n\nالخطوة 2: نقسمو على ${a}\nس = ${result}\n\n✅ الحل: س = ${result}`
      }
    }
    return null
  }

  const searchInContent = (question: string): EducationalContent | null => {
    const q = question.toLowerCase()
    for (const item of content) {
      if (q.includes(item.topic_darija.toLowerCase()) ||
          item.keywords?.some(k => q.includes(k.toLowerCase()))) {
        return item
      }
    }
    return null
  }

  const getDarijaResponse = async (question: string): Promise<string> => {
    const q = question.toLowerCase()
    
    // حل المعادلات أولاً
    const equationSolution = solveEquation(question)
    if (equationSolution) return equationSolution
    
    // البحث في قاعدة المعرفة
    const foundContent = searchInContent(question)
    if (foundContent) {
      return `📚 **${foundContent.topic_darija}**\n\n${foundContent.explanation_darija}\n\nواش بغيتي نزيدو نشرح هاد الموضوع؟`
    }
    
    // ردود سريعة
    if (q.includes('رياضيات') || q.includes('معادلة')) {
      return `📐 **الرياضيات بالدارجة**:\n\nهيا نحلوا مع بعض:\n\nمثال: 2س + 5 = 15\n1. نحيدو 5 من الطرفين: 2س = 10\n2. نقسمو على 2: س = 5\n\nعندك معادلة معينة؟ دوزها ليا!`
    }
    
    if (q.includes('فيزياء') || q.includes('نيوتن')) {
      return `⚛️ **الفيزياء بالدارجة**:\n\nقوانين نيوتن:\n\n1️⃣ القانون الأول: الجسم الساكن يبقى ساكن، والجسم المتحرك يبقى متحرك\n2️⃣ القانون الثاني: F = m × a\n3️⃣ القانون الثالث: لكل فعل رد فعل مساوي ليه فالمقدار ومعاكس فالاتجاه\n\nواش بغيتي شرح لواحد منهم؟`
    }
    
    if (q.includes('عربية') || q.includes('نحو')) {
      return `📖 **العربية بالدارجة**:\n\nأقسام الكلمة:\n🔹 الاسم: كتاب، شجرة\n🔹 الفعل: كتب، يكتب\n🔹 الحرف: في، على، من\n\nبغيتي نمثلك بجملة؟`
    }
    
    if (q.includes('امتحان') || q.includes('بكالوريا')) {
      return `📝 **نصائح للبكالوريا**:\n\n1. نظم وقتك\n2. راجع بانتظام\n3. حل تمارين السنوات السابقة\n4. نام مليح قبل الامتحان\n5. كل صحي\n\nبغيتي نصائح لمادة معينة؟`
    }
    
    return `🤖 **المدرس الذكي بالدارجة**:\n\nأهلا بيك! تقدر تسألني على:\n\n📐 الرياضيات (حل المعادلات)\n⚛️ الفيزياء (قوانين نيوتن)\n📖 العربية (أقسام الكلمة)\n📝 نصائح للبكالوريا\n\nشنو حاب تسأل عليه؟`
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

    setTimeout(async () => {
      const aiResponse = await getDarijaResponse(userQuestion)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
      
      setTimeout(() => {
        speak(aiResponse, aiMessage.id)
      }, 500)
    }, 300)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearConversation = async () => {
    if (confirm('واش بغيتي تمحي كل المحادثة؟')) {
      stopSpeaking()
      setMessages([])
      if (user) {
        await supabase
          .from('darija_conversations')
          .delete()
          .eq('user_id', user.id)
      }
      setMessages([{
        id: Date.now().toString(),
        text: 'سلام عليكم! أنا المدرس الذكي ديالكم. كيفاش نقدر نعاونك؟',
        sender: 'ai',
        timestamp: new Date()
      }])
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '48px', marginBottom: '5px' }}>🤖</div>
            <h1 style={{ fontSize: '24px', marginBottom: '5px' }}>المدرس الذكي بالدارجة</h1>
            <p style={{ opacity: 0.9, fontSize: '13px' }}>اسألني بالدارجة! كنفهم العربية والفرنسية والإنجليزية</p>
          </div>
          <div>
            <button
              onClick={stopSpeaking}
              disabled={!isSpeaking}
              style={{
                background: isSpeaking ? '#ef4444' : 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '20px',
                color: 'white',
                cursor: isSpeaking ? 'pointer' : 'not-allowed',
                marginRight: '10px'
              }}
            >
              ⏹️ إيقاف
            </button>
            <button
              onClick={clearConversation}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '20px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              🗑️ مسح
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>📐 حل معادلات</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>⚛️ فيزياء</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>📖 عربية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>🎤 صوتي</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>🔊 نطق</span>
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '5px'
              }}>
                <div style={{
                  fontSize: '10px',
                  color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#999',
                }}>
                  {message.timestamp.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}
                </div>
                {message.sender === 'ai' && (
                  <button
                    onClick={() => speak(message.text, message.id)}
                    disabled={isSpeaking && currentSpeakingId === message.id}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      color: '#667eea',
                      padding: '2px 5px'
                    }}
                  >
                    🔊
                  </button>
                )}
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
          placeholder="اكتب سؤالك بالدارجة... أو استخدم الميكروفون 🎤"
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
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            padding: '12px',
            background: isRecording ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
          title={isRecording ? 'إيقاف التسجيل' : 'تسجيل صوتي'}
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
          padding: '10px 15px',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1000
        }}>
          <span style={{ animation: 'pulse 1s infinite' }}>🔊</span>
          <span>جاري النطق...</span>
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
