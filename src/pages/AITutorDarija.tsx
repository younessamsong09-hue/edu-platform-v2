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
    // رسالة ترحيب بالدارجة
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

  // الردود بالدارجة المغربية
  const getDarijaResponse = async (question: string): Promise<string> => {
    const q = question.toLowerCase()
    
    // ردود على الرياضيات
    if (q.includes('رياضيات') || q.includes('جبر') || q.includes('معادلة') || q.includes('حساب')) {
      return `📐 **الرياضيات بالدارجة**:\n\nسؤال ديالك: ${question}\n\nهيا نشوفوه مع بعض:\n\n1. بغيتي نحل المعادلة؟ دوز السؤال ليها ونحلهالك خطوة بخطوة.\n2. مثال: 2س + 5 = 15\n   - نحيدو 5 من الطرفين: 2س = 10\n   - نقسمو على 2: س = 5\n\nعندك معادلة معينة؟ دوزها ليا ونحلهالك!`
    }
    
    // ردود على الفيزياء
    if (q.includes('فيزياء') || q.includes('حركة') || q.includes('قوة') || q.includes('نيوتن')) {
      return `⚛️ **الفيزياء بالدارجة**:\n\nسؤال ديالك: ${question}\n\nقوانين نيوتن الثلاثة:\n\n1️⃣ **القانون الأول (قانون القصور الذاتي)**:\n"الجسم الساكن يبقى ساكن، والجسم المتحرك يبقى متحرك، إلا إذا تأثر بقوة خارجية"\n\n2️⃣ **القانون الثاني (قانون التسارع)**:\n"التسارع = القوة ÷ الكتلة" (F = m × a)\n\n3️⃣ **القانون الثالث (الفعل ورد الفعل)**:\n"لكل فعل رد فعل مساوي ليه فالمقدار ومعاكس فالاتجاه"\n\nواش بغيتي شرح لواحد منهم بالتفصيل؟`
    }
    
    // ردود على العربية
    if (q.includes('عربية') || q.includes('نحو') || q.includes('قواعد') || q.includes('صرف')) {
      return `📖 **اللغة العربية بالدارجة**:\n\nسؤال ديالك: ${question}\n\nأقسام الكلمة:\n\n🔹 **الاسم**: كلمة كاتعبر على معنى بلا زمن\n   مثال: كتاب، شجرة، محمد\n\n🔹 **الفعل**: كلمة كاتعبر على حدث مقترن بزمن\n   مثال: كتب، يكتب، اكتب\n\n🔹 **الحرف**: كلمة ماكاتعبرش على معنى فحد ذاتها\n   مثال: في، على، من\n\nبغيتي نمثلك بجملة؟`
    }
    
    // ردود على الإنجليزية
    if (q.includes('انجليزي') || q.includes('english') || q.includes('grammar') || q.includes('ingles')) {
      return `🇬🇧 **English with Darija**:\n\nYour question: ${question}\n\n**Present Simple (المضارع البسيط)**:\n\nI/You/We/They + verb\nHe/She/It + verb + s/es\n\n**Examples:**\n- I **play** football every day. (أنا كنلعب الكورة كل نهار)\n- She **plays** tennis on weekends. (هي كتلعب التنس فصّباط)\n\n**Negation (النفي)**:\n- I **don't** like coffee.\n- She **doesn't** like tea.\n\nDo you want more examples?`
    }
    
    // ردود على الفرنسية
    if (q.includes('فرنسي') || q.includes('french') || q.includes('francais') || q.includes('française')) {
      return `🇫🇷 **Français avec Darija**:\n\nVotre question: ${question}\n\n**Les salutations (التحيات)**:\n\n- **Bonjour** → صباح الخير\n- **Bonsoir** → مساء الخير\n- **Salut** → مرحبا (غير رسمي)\n- **Comment ça va ?** → كيفاش حالك؟\n- **Ça va bien, merci** → لاباس، شكراً\n- **Au revoir** → مع السلامة\n\n**Exemple:**\nA: Bonjour ! Comment ça va ?\nB: Ça va bien, merci. Et toi ?\nA: Ça va très bien, merci.\n\nVous voulez apprendre plus ?`
    }
    
    // ردود على الدارجة فقط
    if (q.includes('شنو') || q.includes('كيفاش') || q.includes('واش') || q.includes('علاش') || q.includes('فاش')) {
      return `🎯 **بالدارجة المغربية**:\n\nسؤال ديالك: ${question}\n\nأهلا بيك! أنا هنا باش نعاونك.\n\nتقدر تسألني على:\n- الرياضيات (المعادلات، الجبر، الهندسة)\n- الفيزياء (الحركة، القوانين، الكهرباء)\n- العربية (النحو، الصرف، البلاغة)\n- الإنجليزية (القواعد، المحادثة)\n- الفرنسية (التحيات، القواعد)\n\nواش بغيتي نبدأ بوحدة منهم؟`
    }
    
    // ردود على نصائح الامتحانات
    if (q.includes('امتحان') || q.includes('بكالوريا') || q.includes('bac') || q.includes('مراجعة') || q.includes('نصيحة')) {
      return `📝 **نصائح للبكالوريا بالدارجة**:\n\nقبل الامتحان:\n1. **نظم وقتك**: قسم المواد بين النهار.\n2. **راجع بانتظام**: كل يوم شوية.\n3. **حل تمارين**: السنوات السابقة.\n4. **نام مليح**: 8 ساعات قبل الامتحان.\n5. **كل صحي**: الفطور مهم.\n\nفالامتحان:\n1. **اقرأ الأسئلة** باه.\n2. **قسم الوقت** بين الأسئلة.\n3. **ابدأ بالسهل** ثم الصعب.\n4. **راجع الجواب** قبل ما تسلم.\n\nبغيتي نصائح لمادة معينة؟`
    }
    
    // ردود على التحفيز
    if (q.includes('مليحة') || q.includes('شجع') || q.includes('تحفيز') || q.includes('مفيد')) {
      return `💪 **تحفيز بالدارجة**:\n\nسمعني، أنت قادر! كل شي كاين فهاد المنصة باش تعاونك.\n\n- دروس فيديو واضحة\n- تمارين تفاعلية\n- امتحانات وطنية مع التصحيح\n- مدرس AI فالدارجة\n\nشد معاك، بدا دلوقتي، والنجاح جا فالطريق!\n\nشنو الشي لي حاب تبدأ بيه؟`
    }
    
    // رد عام بالدارجة
    return `🤖 **المدرس الذكي بالدارجة**:\n\nأهلا بيك! أنا هنا باش نعاونك.\n\nتقدر تسألني على:\n\n📐 **الرياضيات**\n- "حل المعادلة 2س + 5 = 15"\n- "شرح النهايات"\n\n⚛️ **الفيزياء**\n- "شرح قوانين نيوتن"\n- "شنو هو التسارع؟"\n\n📖 **العربية**\n- "شرح أقسام الكلمة"\n- "شنو هو المبتدأ والخبر؟"\n\n🇬🇧 **الإنجليزية**\n- "شرح المضارع البسيط"\n- "الفرق بين much و many"\n\n🇫🇷 **الفرنسية**\n- "تصريف فعل être"\n- "كيفاش نقول صباح الخير؟"\n\n📝 **نصائح للبكالوريا**\n- "كيفاش نقرا للبكالوريا"\n- "نصائح ليلة الامتحان"\n\nشنو حاب تسأل عليه؟`}
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
      {/* Header */}
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
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>💪 تحفيز</span>
        </div>
      </div>

      {/* منطقة الدردشة */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#f9fafb',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '15px'
            }}
          >
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

      {/* منطقة الإدخال */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب سؤالك بالدارجة... مثلاً: شرحلي المعادلات، شنو هو قانون نيوتن، كيفاش نقرا للبكالوريا..."
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

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Link to="/courses" style={{ flex: 1 }}>
          <button style={{
            width: '100%',
            padding: '10px',
            background: '#f3f4f6',
            color: '#333',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}>
            ← العودة للدروس
          </button>
        </Link>
        <Link to="/ai-tutor" style={{ flex: 1 }}>
          <button style={{
            width: '100%',
            padding: '10px',
            background: '#f3f4f6',
            color: '#333',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}>
            🤖 المدرس العادي
          </button>
        </Link>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
