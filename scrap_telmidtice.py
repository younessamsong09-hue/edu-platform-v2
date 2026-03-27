#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكربت لجمع الدروس من منصة TelmidTice
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import os
from datetime import datetime

# المواد الدراسية
SUBJECTS = {
    1: {'name': 'الرياضيات', 'code': 'math', 'url': 'https://telmidtice.men.gov.ma/courses/math'},
    2: {'name': 'الفيزياء والكيمياء', 'code': 'physics', 'url': 'https://telmidtice.men.gov.ma/courses/physics'},
    3: {'name': 'اللغة العربية', 'code': 'arabic', 'url': 'https://telmidtice.men.gov.ma/courses/arabic'},
    4: {'name': 'اللغة الفرنسية', 'code': 'french', 'url': 'https://telmidtice.men.gov.ma/courses/french'},
    5: {'name': 'اللغة الإنجليزية', 'code': 'english', 'url': 'https://telmidtice.men.gov.ma/courses/english'},
}

def fetch_page(url, retry=3):
    """جلب صفحة مع إعادة المحاولة"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for i in range(retry):
        try:
            response = requests.get(url, headers=headers, timeout=30)
            if response.status_code == 200:
                return response
            else:
                print(f"  ⚠️ محاولة {i+1}: خطأ {response.status_code}")
        except Exception as e:
            print(f"  ⚠️ محاولة {i+1}: {e}")
        
        time.sleep(2)
    
    return None

def extract_lessons_from_page(soup, subject_id, subject_name):
    """استخراج الدروس من الصفحة"""
    lessons = []
    
    # البحث عن الروابط (حسب هيكل الصفحة)
    links = soup.find_all('a', href=True)
    
    for link in links:
        href = link.get('href', '')
        text = link.get_text(strip=True)
        
        # تصفية الروابط التي تحتوي على دروس
        if '/course/' in href or '/lesson/' in href:
            if len(text) > 5:  # تجنب الروابط القصيرة
                lessons.append({
                    'title': text,
                    'url': href if href.startswith('http') else f"https://telmidtice.men.gov.ma{href}",
                    'subject_id': subject_id,
                    'subject_name': subject_name,
                    'source': 'telmidtice'
                })
    
    return lessons

def scrape_telmidtice():
    """جمع جميع الدروس"""
    print("=" * 60)
    print("🤖 سكربت جمع الدروس من TelmidTice")
    print("=" * 60)
    
    all_lessons = []
    
    for subject_id, subject_info in SUBJECTS.items():
        print(f"\n📚 جاري جمع دروس {subject_info['name']}...")
        print(f"   الرابط: {subject_info['url']}")
        
        response = fetch_page(subject_info['url'])
        
        if response:
            soup = BeautifulSoup(response.content, 'html.parser')
            lessons = extract_lessons_from_page(soup, subject_id, subject_info['name'])
            
            if lessons:
                print(f"   ✅ تم العثور على {len(lessons)} درس")
                all_lessons.extend(lessons)
            else:
                print(f"   ⚠️ لم يتم العثور على دروس")
                
            # حفظ مؤقت لكل مادة
            temp_file = f"temp_{subject_info['code']}.json"
            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(lessons, f, ensure_ascii=False, indent=2)
            print(f"   💾 تم حفظ {len(lessons)} درس في {temp_file}")
        else:
            print(f"   ❌ فشل في جلب الصفحة")
        
        # تأخير بين المواد
        time.sleep(3)
    
    # حفظ جميع الدروس
    output_file = f"telmidtice_lessons_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_lessons, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 60)
    print(f"🎉 تم جمع {len(all_lessons)} درس بنجاح!")
    print(f"📁 تم الحفظ في: {output_file}")
    print("=" * 60)
    
    return all_lessons

def generate_sql(lessons):
    """توليد أوامر SQL لإضافة الدروس"""
    sql_lines = []
    sql_lines.append("-- دروس من TelmidTice")
    sql_lines.append("INSERT INTO lessons (subject_id, title, title_ar, description, video_url, level, is_published) VALUES")
    
    for i, lesson in enumerate(lessons):
        subject_id = lesson['subject_id']
        title_ar = lesson['title'].replace("'", "''")
        sql_lines.append(f"({subject_id}, '{title_ar}', '{title_ar}', 'درس من TelmidTice', '', 'jtm', true){',' if i < len(lessons)-1 else ';'}")
    
    sql_file = f"telmidtice_lessons_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    
    print(f"\n📝 تم توليد ملف SQL: {sql_file}")
    return sql_file

if __name__ == "__main__":
    print("بدء الجمع...")
    lessons = scrape_telmidtice()
    
    if lessons:
        print(f"\n📊 ملخص:")
        print(f"   إجمالي الدروس: {len(lessons)}")
        
        # إحصاء حسب المواد
        subjects_count = {}
        for l in lessons:
            subjects_count[l['subject_name']] = subjects_count.get(l['subject_name'], 0) + 1
        
        for subject, count in subjects_count.items():
            print(f"   📖 {subject}: {count} درس")
        
        # توليد ملف SQL
        generate_sql(lessons)
        
        print("\n💡 الخطوات التالية:")
        print("   1. افتح Supabase → SQL Editor")
        print("   2. انسخ محتوى ملف SQL")
        print("   3. الصقه في المحرر")
        print("   4. اضغط Run")
    else:
        print("\n❌ لم يتم العثور على أي دروس")
