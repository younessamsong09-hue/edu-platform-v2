import { supabase } from './supabaseClient'

export async function sendNotification(
  userId: string,
  title: string,
  message: string,
  type: string = 'info',
  link?: string
) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      type,
      link
    })
  
  if (error) {
    console.error('خطأ في إرسال الإشعار:', error)
  }
}

export async function notifyLessonComplete(userId: string, lessonTitle: string, lessonId: number) {
  await sendNotification(
    userId,
    '✅ درس مكتمل!',
    `لقد أكملت درس "${lessonTitle}" بنجاح`,
    'success_lesson',
    `/courses/${lessonId}`
  )
}

export async function notifyCertificateEarned(userId: string, subjectName: string, subjectId: number) {
  await sendNotification(
    userId,
    '🏆 شهادة إنجاز!',
    `تهانينا! حصلت على شهادة إكمال مادة "${subjectName}"`,
    'success_certificate',
    `/certificates/${subjectId}`
  )
}

export async function notifyNewLesson(userId: string, lessonTitle: string, lessonId: number) {
  await sendNotification(
    userId,
    '📚 درس جديد!',
    `تم إضافة درس جديد: "${lessonTitle}"`,
    'info',
    `/courses/${lessonId}`
  )
}
