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
  difficulty: number
}

export default function AITutorDarija() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [content, setContent] = useState<EducationalContent[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
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

  // خاصية النطق
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-MA'
      utterance.rate = 0.9
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }
  }

  // البحث في قاعدة المعرفة
  const searchInContent = (question: string): EducationalContent | null => {
    const q = question.toLowerCase()
    
    for (const item of content) {
      if (q.includes(item.topic_darija.toLowerCase()) ||
          item.keywords.some(k => q.includes(k.toLowerCase()))) {
        return item
      }
    }
    return null
  }

  // تحليل الأخطاء الشائعة
  const checkCommonMistakes = async (question: string): Promise<string | null> => {
    const { data } = await supabase
      .from('common_mistakes')
      .select('*')
      .limit(5)
    
    for (const mistake of data || []) {
      if (question.includes(mistake.mistake)) {
        return `⚠️ **تنبيه**: كاين خطأ شايع فهاد النقطة.\n\n${mistake.explanation_darija}\n\nالصحيح: ${mistake.correct}`
      }
    }
    return null
  }

  const getDarijaResponse = async (question: string): Promise<string> => {
    const q = question.toLowerCase()
    
    // 1. البحث في قاعدة المعرفة أولاً
    const foundContent = searchInContent(question)
    if (foundContent) {
      return `📚 **${foundContent.topic_darija}**\n\n${foundContent.explanation_darija}\n\nواش بغيتي نزيدو نشرح هاد الموضوع؟`
    }
    
    // 2. التحقق من الأخطاء الشائعة
    const mistakeAdvice = await checkCommonMistakes(question)
    if (mistakeAdvice) {
      return mistakeAdvice
    }
    
    // 3. ردود سريعة حسب المادة
    if (q.includes('رياضيات') || q.includes('معادلة')) {
      return `📐 **الرياضيات بالدارجة**:\n\nهيا نحلوا مع بعض:\n\nمثال: 2س + 5 = 15\n1. نحيدو 5 من الطرفين: 2س = 10\n2. نقسمو على 2: س = 5\n\nعندك معادلة معينة؟ دوزها ليا!`
    }
    
    if (q.includes('فيزياء') || q.includes('نيوتن')) {
      return `⚛️ **الفيزياء بالدارجة**:\n\nقوانين نيوتن:\n\n1️⃣ القانون الأول: الجسم الساكن يبقى ساكن، والجسم المتحرك يبقى متحرك\n2️⃣ القانون الثاني: F = m × a\n3️⃣ القانون الثالث: لكل فعل رد فعل مساوي ليه فالمقدار ومعاكس فالاتجاه\n\nواش بغيتي شرح لواحد منهم؟`
    }
    
    if (q.includes('عربية') || q.includes('نحو')) {
      return `📖 **العربية بالدارجة**:\n\nأقسام الكلمة:\n🔹 الاسم: كتاب، شجرة\n🔹 الفعل: كتب، يكتب\n🔹 الحرف: في، على، من\n\nبغيتي نمثلك بجملة؟`
    }
    
    if (q.includes('انجليزي') || q.includes('english')) {
      return `🇬🇧 **English with Darija**:\n\nPresent Simple:\nI/You/We/They + verb\nHe/She/It + verb + s\n\nExample:\nI play football.\nShe plays tennis.\n\nWant more examples?`
    }
    
    if (q.includes('فرنسي') || q.includes('french')) {
      return `🇫🇷 **Français avec Darija**:\n\nLes salutations:\nBonjour = صباح الخير\nBonsoir = مساء الخير\nComment ça va? = كيفاش حالك؟\nAu revoir = مع السلامة`
    }
    
    if (q.includes('امتحان') || q.includes('بكالوريا')) {
      return `📝 **نصائح للبكالوريا**:\n\n1. نظم وقتك\n2. راجع بانتظام\n3. حل تمارين السنوات السابقة\n4. نام مليح قبل الامتحان\n5. كل صحي\n\nبغيتي نصائح لمادة معينة؟`
    }
    
    if (q.includes('شكرا') || q.includes('merci')) {
      return `العفو! 🙏 أنا هنا باش نعاونك فكل وقت. واش عندك سؤال آخر؟`
    }
    
    // رد عام مع اقتراحات
    return `🤖 **المدرس الذكي بالدارجة**:\n\nأهلا بيك! تقدر تسألني على:\n\n📐 **الرياضيات**\n- شرح المعادلات\n- حل معادلة\n\n⚛️ **الفيزياء**\n- شرح قوانين نيوتن\n- شرح السرعة والتسارع\n\n📖 **العربية**\n- شرح أقسام الكلمة\n- شرح المبتدأ والخبر\n\n🇬🇧 **الإنجليزية**\n- شرح المضارع البسيط\n- شرح الماضي البسيط\n\n🇫🇷 **الفرنسية**\n- التحيات بالفرنسية\n- تصريف الأفعال\n\nشنو حاب تسأل عليه؟`
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
              onClick={() => speak(messages[messages.length - 1]?.text || '')}
              disabled={isSpeaking}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '20px',
                color: 'white',
                cursor: 'pointer',
                marginRight: '10px'
              }}
              title="استمع للرد"
            >
              🔊 استماع
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
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>📐 رياضيات</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>⚛️ فيزياء</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>📖 عربية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>🇬🇧 إنجليزية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>🇫🇷 فرنسية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>📝 نصائح</span>
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
          placeholder="اكتب سؤالك بالدارجة... مثلاً: شرحلي المعادلات، شنو هو قانون نيوتن، كيفاش نقرا للبكالوريا"
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

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
