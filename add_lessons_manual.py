#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إضافة دروس تجريبية من مصادر متاحة
"""

import json
import os
from datetime import datetime

# دروس تجريبية للرياضيات
MATH_LESSONS = [
    {
        "title_ar": "الأعداد الصحيحة",
        "description": "تعريف الأعداد الصحيحة، العمليات عليها، خصائصها",
        "level": "jtm",
        "chapter": 1,
        "order_num": 1
    },
    {
        "title_ar": "المعادلات من الدرجة الأولى",
        "description": "حل المعادلات من الدرجة الأولى بمجهول واحد",
        "level": "jtm",
        "chapter": 1,
        "order_num": 2
    },
    {
        "title_ar": "المتراجحات",
        "description": "حل المتراجحات من الدرجة الأولى",
        "level": "jtm",
        "chapter": 1,
        "order_num": 3
    },
    {
        "title_ar": "الهندسة المستوية",
        "description": "المثلثات، الدائرة، النظريات الأساسية",
        "level": "jtm",
        "chapter": 2,
        "order_num": 1
    },
    {
        "title_ar": "النسب المثلثية",
        "description": "الجيب، جيب التمام، الظل",
        "level": "jtm",
        "chapter": 2,
        "order_num": 2
    },
    {
        "title_ar": "الدوال",
        "description": "تعريف الدوال، المجال، والمدى",
        "level": "1bac",
        "chapter": 1,
        "order_num": 1
    },
    {
        "title_ar": "النهايات",
        "description": "تعريف النهايات، قواعد الحساب",
        "level": "1bac",
        "chapter": 1,
        "order_num": 2
    },
    {
        "title_ar": "الاشتقاق",
        "description": "قواعد الاشتقاق، تطبيقات",
        "level": "1bac",
        "chapter": 2,
        "order_num": 1
    },
    {
        "title_ar": "المتتاليات",
        "description": "المتتاليات الحسابية والهندسية",
        "level": "1bac",
        "chapter": 2,
        "order_num": 2
    },
    {
        "title_ar": "المعادلات من الدرجة الثانية",
        "description": "المميز، حل المعادلات التربيعية",
        "level": "2bac",
        "chapter": 1,
        "order_num": 1
    }
]

# دروس تجريبية للفيزياء
PHYSICS_LESSONS = [
    {
        "title_ar": "الحركة",
        "description": "تعريف الحركة، السرعة، التسارع",
        "level": "jtm",
        "chapter": 1,
        "order_num": 1
    },
    {
        "title_ar": "القوى",
        "description": "أنواع القوى، قانون نيوتن الأول",
        "level": "jtm",
        "chapter": 1,
        "order_num": 2
    },
    {
        "title_ar": "الطاقة",
        "description": "أنواع الطاقة، تحولاتها",
        "level": "jtm",
        "chapter": 2,
        "order_num": 1
    },
    {
        "title_ar": "قوانين نيوتن",
        "description": "القوانين الثلاثة للحركة",
        "level": "1bac",
        "chapter": 1,
        "order_num": 1
    },
    {
        "title_ar": "الكهرباء",
        "description": "التيار الكهربائي، قانون أوم",
        "level": "1bac",
        "chapter": 2,
        "order_num": 1
    },
    {
        "title_ar": "المغناطيسية",
        "description": "المجالات المغناطيسية، الحث",
        "level": "2bac",
        "chapter": 1,
        "order_num": 1
    }
]

# دروس تجريبية للعربية
ARABIC_LESSONS = [
    {
        "title_ar": "أقسام الكلمة",
        "description": "الاسم، الفعل، الحرف",
        "level": "jtm",
        "chapter": 1,
        "order_num": 1
    },
    {
        "title_ar": "المبتدأ والخبر",
        "description": "تعريف المبتدأ والخبر، أحكامهما",
        "level": "jtm",
        "chapter": 1,
        "order_num": 2
    },
    {
        "title_ar": "الفعل الماضي",
        "description": "صياغة الفعل الماضي، إعرابه",
        "level": "jtm",
        "chapter": 2,
        "order_num": 1
    },
    {
        "title_ar": "الفعل المضارع",
        "description": "صياغة الفعل المضارع، إعرابه",
        "level": "jtm",
        "chapter": 2,
        "order_num": 2
    },
    {
        "title_ar": "البلاغة",
        "description": "التشبيه، الاستعارة، الكناية",
        "level": "2bac",
        "chapter": 1,
        "order_num": 1
    }
]

# دروس تجريبية للإنجليزية
ENGLISH_LESSONS = [
    {
        "title_ar": "Present Simple",
        "description": "المضارع البسيط: التكوين، الاستخدام",
        "level": "jtm",
        "chapter": 1,
        "order_num": 1
    },
    {
        "title_ar": "Past Simple",
        "description": "الماضي البسيط: الأفعال المنتظمة والشاذة",
        "level": "jtm",
        "chapter": 1,
        "order_num": 2
    },
    {
        "title_ar": "Future Simple",
        "description": "المستقبل البسيط: will و going to",
        "level": "jtm",
        "chapter": 1,
        "order_num": 3
    },
    {
        "title_ar": "Present Continuous",
        "description": "المضارع المستمر: التكوين، الاستخدام",
        "level": "1bac",
        "chapter": 1,
        "order_num": 1
    },
    {
        "title_ar": "Passive Voice",
        "description": "المبني للمجهول في جميع الأزمنة",
        "level": "2bac",
        "chapter": 1,
        "order_num": 1
    }
]

def generate_sql():
    """توليد أوامر SQL لإضافة الدروس"""
    
    sql_lines = []
    sql_lines.append("-- ============================================")
    sql_lines.append("-- إضافة دروس تجريبية للمنصة")
    sql_lines.append("-- ============================================")
    sql_lines.append("")
    
    # الرياضيات (subject_id = 1)
    sql_lines.append("-- دروس الرياضيات")
    for lesson in MATH_LESSONS:
        sql_lines.append(f"INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES")
        sql_lines.append(f"(1, '{lesson['title_ar']}', '{lesson['title_ar']}', '{lesson['description']}', '{lesson['level']}', {lesson['chapter']}, {lesson['order_num']}, true);")
        sql_lines.append("")
    
    # الفيزياء (subject_id = 2)
    sql_lines.append("-- دروس الفيزياء")
    for lesson in PHYSICS_LESSONS:
        sql_lines.append(f"INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES")
        sql_lines.append(f"(2, '{lesson['title_ar']}', '{lesson['title_ar']}', '{lesson['description']}', '{lesson['level']}', {lesson['chapter']}, {lesson['order_num']}, true);")
        sql_lines.append("")
    
    # العربية (subject_id = 3)
    sql_lines.append("-- دروس اللغة العربية")
    for lesson in ARABIC_LESSONS:
        sql_lines.append(f"INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES")
        sql_lines.append(f"(3, '{lesson['title_ar']}', '{lesson['title_ar']}', '{lesson['description']}', '{lesson['level']}', {lesson['chapter']}, {lesson['order_num']}, true);")
        sql_lines.append("")
    
    # الإنجليزية (subject_id = 5)
    sql_lines.append("-- دروس اللغة الإنجليزية")
    for lesson in ENGLISH_LESSONS:
        sql_lines.append(f"INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES")
        sql_lines.append(f"(5, '{lesson['title_ar']}', '{lesson['title_ar']}', '{lesson['description']}', '{lesson['level']}', {lesson['chapter']}, {lesson['order_num']}, true);")
        sql_lines.append("")
    
    # حفظ الملف
    filename = f"lessons_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    
    print(f"✅ تم إنشاء ملف SQL: {filename}")
    print(f"📊 إجمالي الدروس: {len(MATH_LESSONS) + len(PHYSICS_LESSONS) + len(ARABIC_LESSONS) + len(ENGLISH_LESSONS)}")
    print(f"   - الرياضيات: {len(MATH_LESSONS)} درس")
    print(f"   - الفيزياء: {len(PHYSICS_LESSONS)} درس")
    print(f"   - العربية: {len(ARABIC_LESSONS)} درس")
    print(f"   - الإنجليزية: {len(ENGLISH_LESSONS)} درس")
    
    return filename

if __name__ == "__main__":
    print("=" * 50)
    print("📚 إضافة دروس تجريبية للمنصة")
    print("=" * 50)
    
    filename = generate_sql()
    
    print("\n💡 الخطوات التالية:")
    print("   1. افتح Supabase Dashboard")
    print("   2. SQL Editor → New Query")
    print("   3. انسخ محتوى الملف التالي:")
    print(f"      cat {filename}")
    print("   4. الصقه في SQL Editor")
    print("   5. اضغط Run")
    print("\n✨ بعد الإضافة، ستظهر الدروس في موقعك!")
