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
  title_ar: string
  description: string
  content: string
  subject_id: number
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkUser()
    fetchLessons()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      loadConversation()
    } else {
      // رسالة ترحيب للمستخدم غير المسجل
      setMessages([{
        id: '1',
        text: 'مرحباً بك في مدرس AI! 🎓\n\nأنا هنا لمساعدتك في فهم دروسك. يمكنك سؤالي عن:\n\n📐 الرياضيات - معادلات، جبر، هندسة\n⚛️ الفيزياء - حركة، قوانين نيوتن، كهرباء\n📖 اللغة العربية - نحو، صرف، بلاغة\n🇬🇧 اللغة الإنجليزية - قواعد، محادثة\n🇫🇷 اللغة الفرنسية - تحيات، قواعد\n📝 نصائح للامتحانات\n\n⚠️ ملاحظة: سجل دخولك لحفظ محادثاتك!',
        sender: 'ai',
        timestamp: new Date()
      }])
    }
  }

  async function fetchLessons() {
    const { data } = await supabase
      .from('lessons')
      .select('id, title_ar, description, content, subject_id')
      .eq('is_published', true)
      .limit(50)
    
    if (data) setLessons(data)
  }

  async function loadConversation() {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (data) {
      setConversationId(data.id)
      setMessages(data.messages)
    } else {
      // بدء محادثة جديدة
      setMessages([{
        id: Date.now().toString(),
        text: `مرحباً ${user.email?.split('@')[0]}! 👋\n\nأنا مدرس AI الذكي. كيف يمكنني مساعدتك اليوم؟\n\nيمكنك سؤالي عن:\n📐 الرياضيات\n⚛️ الفيزياء\n📖 اللغة العربية\n🇬🇧 اللغة الإنجليزية\n🇫🇷 اللغة الفرنسية\n📝 نصائح للامتحانات`,
        sender: 'ai',
        timestamp: new Date()
      }])
    }
  }

  async function saveConversation(messagesList: Message[]) {
    if (!user) return

    const { error } = await supabase
      .from('conversations')
      .upsert({
        id: conversationId,
        user_id: user.id,
        messages: messagesList,
        updated_at: new Date().toISOString()
      })

    if (!error && !conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data) setConversationId(data.id)
    }
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

  // البحث في الدروس عن إجابة
  function searchLessons(question: string): Lesson | null {
    const q = question.toLowerCase()
    
    // البحث في عناوين الدروس
    for (const lesson of lessons) {
      if (lesson.title_ar.includes(q) || lesson.description?.includes(q)) {
        return lesson
      }
    }
    
    // البحث في محتوى الدروس
    for (const lesson of lessons) {
      if (lesson.content?.toLowerCase().includes(q)) {
        return lesson
      }
    }
    
    return null
  }

  const getAIResponse = async (question: string): Promise<string> => {
    const q = question.toLowerCase()
    
    // البحث أولاً في الدروس
    const foundLesson = searchLessons(question)
    
    if (foundLesson) {
      return `📚 **وجدت درساً متعلقاً بسؤالك:**\n\n**${foundLesson.title_ar}**\n${foundLesson.description || ''}\n\n${foundLesson.content?.substring(0, 500) || ''}\n\nهل تريد معرفة المزيد عن هذا الموضوع؟`
    }
    
    // ردود حسب المادة
    if (q.includes('رياضيات') || q.includes('math') || q.includes('جبر') || q.includes('معادلة')) {
      return `📐 **الرياضيات**: ${question}\n\nسأشرح لك بطريقة مبسطة:\n\n**المعادلات الخطية (Linear Equations):**\n\nمثال: حل المعادلة 2س + 5 = 15\n\nالخطوة 1: ننقل الأعداد الثابتة للطرف الآخر\n2س = 15 - 5\n2س = 10\n\nالخطوة 2: نقسم الطرفين على معامل س\nس = 10 ÷ 2\nس = 5\n\n✅ الحل: س = 5\n\n**تريد حل معادلة أخرى؟ أرسلها وسأحلها لك!**`
    }
    
    if (q.includes('فيزياء') || q.includes('physics') || q.includes('حركة') || q.includes('قوة')) {
      return `⚛️ **الفيزياء**: ${question}\n\n**قوانين نيوتن للحركة:**\n\n**القانون الأول (قانون القصور الذاتي):**\n"الجسم الساكن يبقى ساكناً، والجسم المتحرك يبقى متحركاً بسرعة ثابتة في خط مستقيم، ما لم تؤثر عليه قوة خارجية تغير من حالته"\n\n**القانون الثاني (قانون التسارع):**\n"تسارع الجسم يتناسب طردياً مع القوة المحصلة المؤثرة عليه وعكسياً مع كتلته"\nF = m × a\n\n**القانون الثالث (الفعل ورد الفعل):**\n"لكل فعل رد فعل مساوٍ له في المقدار ومعاكس في الاتجاه"\n\nهل تريد شرحاً مفصلاً لقانون معين؟`
    }
    
    if (q.includes('عربية') || q.includes('arabic') || q.includes('نحو') || q.includes('قواعد')) {
      return `📖 **اللغة العربية**: ${question}\n\n**أقسام الكلمة:**\n\n1️⃣ **اسم**: يدل على معنى غير مقترن بزمن\nمثال: كتاب، شجرة، محمد، مكة\n\n2️⃣ **فعل**: يدل على حدث مقترن بزمن\n- الماضي: كتب، قرأ\n- المضارع: يكتب، يقرأ\n- الأمر: اكتب، اقرأ\n\n3️⃣ **حرف**: ما لا يدل على معنى في نفسه\nمثال: في، على، من، إلى، هل\n\n**مثال إعراب:**\n"قرأ الطالب الكتاب"\n- قرأ: فعل ماض مبني على الفتح\n- الطالب: فاعل مرفوع بالضمة\n- الكتاب: مفعول به منصوب بالفتحة\n\nهل تريد مثالاً آخر؟`
    }
    
    if (q.includes('انجليزي') || q.includes('english') || q.includes('grammar')) {
      return `🇬🇧 **English**: ${question}\n\n**Present Simple vs Present Continuous:**\n\n| Present Simple | Present Continuous |\n|----------------|-------------------|\n| I work | I am working |\n| He works | He is working |\n| They work | They are working |\n\n**Usage:**\n- Present Simple: Facts, routines, habits\n- Present Continuous: Actions happening now, temporary situations\n\n**Examples:**\n- I **go** to school every day. (routine)\n- I **am going** to school now. (now)\n\nWould you like more examples?`
    }
    
    if (q.includes('فرنسي') || q.includes('french') || q.includes('francais')) {
      return `🇫🇷 **Français**: ${question}\n\n**Les verbes être et avoir (الأفعال الأساسية):**\n\n**Être (يكون):**\n- Je suis\n- Tu es\n- Il/Elle est\n- Nous sommes\n- Vous êtes\n- Ils/Elles sont\n\n**Avoir (يملك):**\n- J'ai\n- Tu as\n- Il/Elle a\n- Nous avons\n- Vous avez\n- Ils/Elles ont\n\n**Exemple:**\nJe **suis** étudiant. (أنا طالب)\nJ'**ai** 18 ans. (عمري 18 سنة)\n\nVoulez-vous plus d'exemples?`
    }
    
    if (q.includes('امتحان') || q.includes('بكالوريا') || q.includes('bac') || q.includes('نصائح')) {
      return `📝 **نصائح للامتحان الوطني:**\n\n**قبل الامتحان:**\n1. 📅 ضع جدولاً للمراجعة\n2. 📚 راجع الدروس الأساسية أولاً\n3. ✍️ حل تمارين السنوات السابقة\n4. 😴 نم 8 ساعات يومياً\n5. 🍎 تناول طعاماً صحياً\n\n**أثناء الامتحان:**\n1. 📖 اقرأ الأسئلة بعناية\n2. ⏰ قسم الوقت بين الأسئلة\n3. ✏️ ابدأ بالأسهل ثم الأصعب\n4. ✅ راجع إجاباتك قبل التسليم\n\n**جدول مراجعة مقترح:**\n- الصباح: مواد علمية\n- المساء: مواد أدبية\n- قبل النوم: مراجعة سريعة\n\nهل تريد نصائح لمادة معينة؟`
    }
    
    // رد عام مع اقتراحات
    return `🤖 **مدرس AI**:\n\nأنا هنا لمساعدتك! يمكنك سؤالي عن:\n\n📐 **الرياضيات**\n- "حل المعادلة 2س + 5 = 15"\n- "شرح النهايات في الرياضيات"\n\n⚛️ **الفيزياء**\n- "شرح قوانين نيوتن"\n- "ما هو التسارع؟"\n\n📖 **اللغة العربية**\n- "شرح أقسام الكلمة"\n- "ما هو المبتدأ والخبر؟"\n\n🇬🇧 **اللغة الإنجليزية**\n- "شرح المضارع البسيط"\n- "الفرق بين much و many"\n\n🇫🇷 **اللغة الفرنسية**\n- "تصريف فعل être"\n- "كيف أقول صباح الخير بالفرنسية"\n\n📝 **نصائح للامتحانات**\n- "كيف أذاكر للبكالوريا"\n- "نصائح ليلة الامتحان"\n\n**أعد صياغة سؤالك وسأجيبك بالتفصيل!**`
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
      const aiResponse = await getAIResponse(inputMessage)
      
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
    if (confirm('هل تريد مسح كل المحادثات؟')) {
      setMessages([])
      if (user) {
        await supabase
          .from('conversations')
          .delete()
          .eq('id', conversationId)
        setConversationId(null)
      }
      // إضافة رسالة ترحيب جديدة
      setMessages([{
        id: Date.now().toString(),
        text: user ? `مرحباً مجدداً! كيف يمكنني مساعدتك اليوم؟` : `مرحباً بك في مدرس AI! سجل دخولك لحفظ محادثاتك.`,
        sender: 'ai',
        timestamp: new Date()
      }])
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '5px' }}>🤖</div>
            <h1 style={{ fontSize: '24px', marginBottom: '5px' }}>مدرس AI بالدارجة</h1>
            <p style={{ opacity: 0.9, fontSize: '14px' }}>اسألني أي سؤال في المواد الدراسية</p>
          </div>
          <button
            onClick={clearConversation}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            🗑️ مسح المحادثة
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>📐 رياضيات</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>⚛️ فيزياء</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>📖 عربية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>🇬🇧 إنجليزية</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>🇫🇷 فرنسية</span>
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
        {!user && (
          <Link to="/login" style={{ flex: 1 }}>
            <button style={{
              width: '100%',
              padding: '10px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}>
              🔐 سجل دخولك لحفظ المحادثات
            </button>
          </Link>
        )}
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
