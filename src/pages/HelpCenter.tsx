import { Link } from 'react-router-dom'

export default function HelpCenter() {
  const faqs = [
    { q: 'كيف يمكنني التسجيل؟', a: 'اضغط على زر "تسجيل جديد" في الصفحة الرئيسية، أدخل بريدك الإلكتروني وكلمة المرور.' },
    { q: 'كيف أحصل على نقاط؟', a: 'أكمل الدروس (+50 نقطة)، حل التمارين (+10 نقاط)، ساعد زملاءك (+10 نقاط).' },
    { q: 'كيف أحصل على شهادة؟', a: 'أكمل جميع دروس مادة معينة، ثم اضغط على "شهادة الإنجاز" في صفحة المادة.' },
    { q: 'كيف أشارك في المسابقات؟', a: 'اذهب إلى قسم المسابقات، اختر المسابقة المناسبة، واضغط "شارك الآن".' },
    { q: 'كيف أستخدم المدرس الذكي؟', a: 'اذهب إلى قسم "مدرس بالدارجة" واسأل أي سؤال بالدارجة المغربية.' },
    { q: 'هل المنصة مجانية؟', a: 'نعم، جميع الدروس والتمارين مجانية بالكامل.' }
  ]

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>❓ مركز المساعدة</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>الأسئلة الشائعة ودليل استخدام المنصة</p>

      {faqs.map((faq, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '15px', padding: '20px', marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#667eea' }}>{faq.q}</div>
          <div style={{ color: '#666' }}>{faq.a}</div>
        </div>
      ))}

      <div style={{ background: '#f3f4f6', borderRadius: '15px', padding: '20px', marginTop: '20px', textAlign: 'center' }}>
        <p>لم تجد إجابة؟ تواصل معنا عبر البريد الإلكتروني:</p>
        <a href="mailto:support@morocco-edu.com" style={{ color: '#667eea' }}>support@morocco-edu.com</a>
      </div>

      <Link to="/">
        <button style={{ width: '100%', padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '20px' }}>← العودة للرئيسية</button>
      </Link>
    </div>
  )
}
