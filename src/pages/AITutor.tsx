import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

// استدعاء API الذكاء الاصطناعي (سنستخدم محاكاة أولاً)
// يمكن لاحقاً استبدالها بـ OpenAI API أو نموذج محلي

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً بك في مدرس AI! أنا هنا لمساعدتك في فهم دروسك. اسألني أي سؤال في الرياضيات، الفيزياء، العربية، أو أي مادة أخرى. أتحدث الدارجة المغربية والعربية والفرنسية. كيف يمكنني مساعدتك اليوم؟',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkUser()
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

  // دالة لمحاكاة الرد الذكي (يمكن استبدالها بـ API حقيقي)
  const getAIResponse = async (question: string): Promise<string> => {
    // تحويل السؤال إلى أحرف صغيرة لتسهيل المعالجة
    const q = question.toLowerCase()
    
    // ردود مخصصة حسب نوع السؤال
    if (q.includes('رياضيات') || q.includes('math') || q.includes('جبر') || q.includes('معادلة')) {
      return `📐 **الرياضيات**: ${question}\n\nسأشرح لك بطريقة مبسطة:\n\n1. أولاً، دعنا نفهم المطلوب في السؤال.\n2. نستخدم القاعدة المناسبة لحل المسألة.\n3. نطبق الخطوات بالترتيب.\n\nمثال: لحل معادلة من الدرجة الأولى مثل 2س + 5 = 15\nنطرح 5 من الطرفين: 2س = 10\nنقسم على 2: س = 5\n\nهل تريد مني شرح قاعدة معينة؟`
    }
    
    if (q.includes('فيزياء') || q.includes('physics') || q.includes('حركة') || q.includes('قوة')) {
      return `⚛️ **الفيزياء**: ${question}\n\nالفيزياء تدرس الظواهر الطبيعية. \n\n**قوانين نيوتن للحركة:**\n- القانون الأول: الجسم الساكن يبقى ساكناً، والجسم المتحرك يبقى متحركاً بسرعة ثابتة ما لم تؤثر عليه قوة خارجية.\n- القانون الثاني: القوة = الكتلة × التسارع (F = m × a)\n- القانون الثالث: لكل فعل رد فعل مساوٍ له في المقدار ومعاكس في الاتجاه.\n\nهل تريد شرح قانون معين بالتفصيل؟`
    }
    
    if (q.includes('عربية') || q.includes('arabic') || q.includes('نحو') || q.includes('قواعد')) {
      return `📖 **اللغة العربية**: ${question}\n\n**أقسام الكلمة في اللغة العربية:**\n- **اسم**: يدل على معنى غير مقترن بزمن (كتاب، شجرة، محمد)\n- **فعل**: يدل على حدث مقترن بزمن (كتب، يكتب، اكتب)\n- **حرف**: ما ليس اسماً ولا فعلاً (في، على، من)\n\n**مثال:** في جملة "قرأ الطالب الكتاب"\n- قرأ: فعل ماض\n- الطالب: فاعل مرفوع (اسم)\n- الكتاب: مفعول به منصوب (اسم)\n\nهل تريد مثالاً آخر؟`
    }
    
    if (q.includes('انجليزي') || q.includes('english') || q.includes('grammar')) {
      return `🇬🇧 **English**: ${question}\n\n**Present Simple Tense (المضارع البسيط):**\n- I/You/We/They + verb (play, work)\n- He/She/It + verb + s/es (plays, works)\n\n**Example:**\n- I play football every day.\n- She plays tennis on weekends.\n- Do you like coffee?\n- Does he speak Arabic?\n\nWould you like more examples?`
    }
    
    if (q.includes('فرنسي') || q.includes('french') || q.includes('francais')) {
      return `🇫🇷 **Français**: ${question}\n\n**Les salutations (التحيات):**\n- Bonjour → صباح الخير\n- Bonsoir → مساء الخير\n- Salut → مرحباً (غير رسمي)\n- Comment ça va ? → كيف حالك؟\n- Ça va bien, merci → أنا بخير، شكراً\n- Au revoir → وداعاً\n\n**Exemple:**\nA: Bonjour ! Comment ça va ?\nB: Ça va bien, merci. Et toi ?\nA: Ça va très bien, merci.\n\nVoulez-vous apprendre plus ?`
    }
    
    if (q.includes('امتحان') || q.includes('بكالوريا') || q.includes('bac')) {
      return `📝 **نصائح للامتحان الوطني:**\n\n1. **تنظيم الوقت**: قسم وقتك بين المواد\n2. **المراجعة المنتظمة**: راجع الدروس يومياً\n3. **حل التمارين**: أكثر من 5 تمارين لكل درس\n4. **النوم الكافي**: 8 ساعات قبل الامتحان\n5. **التغذية الجيدة**: تناول فطوراً صحياً\n\n**جدول مراجعة مقترح:**\n- الصباح: مواد علمية (رياضيات، فيزياء)\n- المساء: مواد أدبية (عربية، فلسفة)\n- المراجعة النهائية قبل أسبوع من الامتحان\n\nهل تريد نصائح لمادة معينة؟`
    }
    
    // رد عام إذا لم يتعرف على الموضوع
    return `🤖 **مدرس AI**:\n\nشكراً لسؤالك! أنا هنا لمساعدتك في:\n\n📐 **الرياضيات** - جبر، معادلات، هندسة\n⚛️ **الفيزياء** - حركة، قوانين نيوتن، كهرباء\n📖 **اللغة العربية** - نحو، صرف، بلاغة\n🇬🇧 **اللغة الإنجليزية** - قواعد، محادثة\n🇫🇷 **اللغة الفرنسية** - تحيات، قواعد\n📝 **نصائح للامتحانات**\n\nيمكنك أن تسألني:\n- "شرح المعادلات الخطية"\n- "قوانين نيوتن بالدارجة"\n- "كيف أذاكر للبكالوريا"\n- "أمثلة على المضارع البسيط"\n\nأعد صياغة سؤالك وسأجيبك بالتفصيل!`
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // محاكاة تأخير الرد
    setTimeout(async () => {
      const aiResponse = await getAIResponse(inputMessage)
      
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
        <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>مدرس AI بالدارجة</h1>
        <p style={{ opacity: 0.9 }}>اسألني أي سؤال في الرياضيات، الفيزياء، العربية، أو أي مادة</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>📐 رياضيات</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>⚛️ فيزياء</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>📖 عربية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>🇬🇧 إنجليزية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>🇫🇷 فرنسية</span>
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
              maxWidth: '80%',
              padding: '12px 18px',
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
          placeholder="اكتب سؤالك هنا... يمكنك السؤال بالدارجة أو العربية أو الفرنسية"
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
