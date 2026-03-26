import { supabase } from './supabaseClient'

// إضافة نقاط للمستخدم
export async function addPoints(
  userId: string, 
  points: number, 
  reason: string, 
  lessonId?: number, 
  exerciseId?: number
) {
  // إضافة النقاط إلى السجل
  await supabase
    .from('points_history')
    .insert({
      user_id: userId,
      points,
      reason,
      lesson_id: lessonId,
      exercise_id: exerciseId
    })

  // تحديث النقاط الإجمالية
  const { data: userPoints } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (userPoints) {
    let newXp = (userPoints.xp || 0) + points
    let newLevel = userPoints.level || 1
    let newTotalPoints = (userPoints.total_points || 0) + points
    let xpToNext = userPoints.xp_to_next_level || 100

    // رفع المستوى إذا تجاوز XP
    while (newXp >= xpToNext) {
      newXp -= xpToNext
      newLevel++
      xpToNext = Math.floor(xpToNext * 1.2) // زيادة صعوبة المستوى
    }

    // تحديث الإنجازات
    const { data: badges } = await supabase
      .from('badges')
      .select('*')
      .order('points_required')

    const earnedBadges: string[] = [...(userPoints.badges || [])]

    for (const badge of badges || []) {
      if (badge.condition_type === 'points' && newTotalPoints >= badge.points_required) {
        if (!earnedBadges.includes(badge.name_ar)) {
          earnedBadges.push(badge.name_ar)
        }
      }
    }

    await supabase
      .from('user_points')
      .update({
        total_points: newTotalPoints,
        level: newLevel,
        xp: newXp,
        xp_to_next_level: xpToNext,
        badges: earnedBadges,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
  }
}

// إضافة نقاط عند إكمال درس
export async function addLessonPoints(userId: string, lessonId: number, lessonTitle: string) {
  await addPoints(userId, 50, `إكمال درس: ${lessonTitle}`, lessonId)
}

// إضافة نقاط عند حل تمرين بشكل صحيح
export async function addExercisePoints(userId: string, exerciseId: number, correct: boolean) {
  if (correct) {
    await addPoints(userId, 10, `حل تمرين صحيح`, undefined, exerciseId)
  }
}

// إضافة نقاط عند إكمال جميع دروس مادة
export async function addSubjectCompletePoints(userId: string, subjectName: string) {
  await addPoints(userId, 200, `إكمال جميع دروس: ${subjectName}`)
}

// إضافة نقاط عند الحصول على شهادة
export async function addCertificatePoints(userId: string, subjectName: string) {
  await addPoints(userId, 500, `الحصول على شهادة في: ${subjectName}`)
}
