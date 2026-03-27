import { supabase } from './supabaseClient'

export async function addLessonPoints(userId: string, lessonId: number, lessonTitle: string) {
  try {
    const { data: userPoints } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (userPoints) {
      const newPoints = (userPoints.total_points || 0) + 50
      const newXp = (userPoints.xp || 0) + 50
      
      await supabase
        .from('user_points')
        .update({
          total_points: newPoints,
          xp: newXp
        })
        .eq('user_id', userId)
    } else {
      await supabase
        .from('user_points')
        .insert({
          user_id: userId,
          total_points: 50,
          xp: 50,
          level: 1
        })
    }
  } catch (error) {
    console.error('خطأ في إضافة النقاط:', error)
  }
}
