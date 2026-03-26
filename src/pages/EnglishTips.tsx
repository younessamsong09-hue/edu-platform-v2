import { Link } from 'react-router-dom'

export default function EnglishTips() {
  const tips = [
    {
      title: '📖 اقرأ يومياً',
      content: 'اقرأ 15 دقيقة يومياً من كتب أو مقالات أو قصص بالإنجليزية. ابدأ بمستوى مناسب لك.',
      icon: '📖'
    },
    {
      title: '🎧 استمع للإنجليزية',
      content: 'استمع إلى podcasts، أغاني، أو أفلام بالإنجليزية مع ترجمة. حاول فهم الكلمات الجديدة.',
      icon: '🎧'
    },
    {
      title: '✍️ اكتب يومياً',
      content: 'اكتب يومياتك بالإنجليزية، حتى لو جمل بسيطة. هذا يحسن مهارات الكتابة.',
      icon: '✍️'
    },
    {
      title: '🗣️ تحدث مع نفسك',
      content: 'تحدث بالإنجليزية مع نفسك أمام المرآة. سجل صوتك واستمع له.',
      icon: '🗣️'
    },
    {
      title: '📱 تطبيقات مفيدة',
      content: 'استخدم تطبيقات مثل Duolingo, Memrise, Quizlet لتحسين المفردات.',
      icon: '📱'
    },
    {
      title: '📝 تعلم 5 كلمات يومياً',
      content: 'تعلم 5 كلمات جديدة كل يوم مع جملة مثال. بعد سنة ستكون قد تعلمت 1825 كلمة!',
      icon: '📝'
    },
    {
      title: '🎬 شاهد بترجمة',
      content: 'شاهد الأفلام والمسلسلات بالإنجليزية مع ترجمة إنجليزية. هذا يحسن الاستماع والقراءة معاً.',
      icon: '🎬'
    },
    {
      title: '🗣️ تحدث مع متحدثين أصليين',
      content: 'استخدم تطبيقات مثل HelloTalk أو Tandem للتحدث مع متحدثين أصليين.',
      icon: '🗣️'
    },
    {
      title: '📚 احفظ عبارات كاملة',
      content: 'احفظ عبارات كاملة بدلاً من كلمات مفردة. هذا يساعد في التحدث بشكل طبيعي.',
      icon: '📚'
    },
    {
      title: '🎯 حدد أهدافاً صغيرة',
      content: 'حدد أهدافاً أسبوعية: تعلم 10 كلمات، مشاهدة فيديو، كتابة فقرة صغيرة.',
      icon: '🎯'
    }
  ]

  const resources = [
    { name: 'Duolingo', url: 'https://www.duolingo.com', desc: 'تعلم الإنجليزية مجاناً' },
    { name: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish', desc: 'دروس ومقاطع فيديو' },
    { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=learn+english', desc: 'قنوات تعليمية مجانية' },
    { name: 'Grammarly', url: 'https://www.grammarly.com', desc: 'تصحيح الأخطاء الإملائية' }
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', color: '#333', marginBottom: '10px' }}>
        💡 نصائح لتعلم اللغة الإنجليزية
      </h1>
      <p style={{ color: '#666', marginBottom: '40px', fontSize: '18px' }}>
        استراتيجيات فعالة لتحسين مستواك في اللغة الإنجليزية
      </p>

      {/* النصائح */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px',
        marginBottom: '50px'
      }}>
        {tips.map((tip, i) => (
          <div key={i} style={{
            background: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s',
            borderRight: `4px solid #667eea`
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>{tip.icon}</div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>{tip.title}</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{tip.content}</p>
          </div>
        ))}
      </div>

      {/* مصادر مفيدة */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        marginBottom: '40px'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', textAlign: 'center' }}>
          🌟 مصادر مفيدة لتعلم الإنجليزية
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {resources.map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '20px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'white',
                transition: 'transform 0.3s',
                display: 'block'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔗</div>
              <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{resource.name}</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>{resource.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* خطة 30 يوم */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>
          📅 خطة 30 يوماً لتحسين الإنجليزية
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ padding: '15px', background: '#f3f4f6', borderRadius: '10px' }}>
            <strong>الأسبوع 1:</strong>
            <ul style={{ marginTop: '10px', paddingRight: '20px', color: '#666' }}>
              <li>تعلم 5 كلمات يومياً</li>
              <li>استمع لـ 10 دقائق يومياً</li>
              <li>اقرأ جملة واحدة يومياً</li>
            </ul>
          </div>
          <div style={{ padding: '15px', background: '#f3f4f6', borderRadius: '10px' }}>
            <strong>الأسبوع 2:</strong>
            <ul style={{ marginTop: '10px', paddingRight: '20px', color: '#666' }}>
              <li>تعلم 7 كلمات يومياً</li>
              <li>شاهد فيديو قصير يومياً</li>
              <li>اكتب 3 جمل يومياً</li>
            </ul>
          </div>
          <div style={{ padding: '15px', background: '#f3f4f6', borderRadius: '10px' }}>
            <strong>الأسبوع 3:</strong>
            <ul style={{ marginTop: '10px', paddingRight: '20px', color: '#666' }}>
              <li>تعلم 10 كلمات يومياً</li>
              <li>تحدث مع نفسك 5 دقائق</li>
              <li>اقرأ فقرة قصيرة</li>
            </ul>
          </div>
          <div style={{ padding: '15px', background: '#f3f4f6', borderRadius: '10px' }}>
            <strong>الأسبوع 4:</strong>
            <ul style={{ marginTop: '10px', paddingRight: '20px', color: '#666' }}>
              <li>مراجعة الكلمات</li>
              <li>شاهد فيلماً مع ترجمة</li>
              <li>اكتب فقرة كاملة</li>
            </ul>
          </div>
        </div>
      </div>

      <Link to="/courses">
        <button style={{
          marginTop: '40px',
          width: '100%',
          padding: '15px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          ← العودة إلى الدروس
        </button>
      </Link>
    </div>
  )
}
