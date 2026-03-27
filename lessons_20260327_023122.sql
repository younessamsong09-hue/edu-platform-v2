-- ============================================
-- إضافة دروس تجريبية للمنصة
-- ============================================

-- دروس الرياضيات
INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'الأعداد الصحيحة', 'الأعداد الصحيحة', 'تعريف الأعداد الصحيحة، العمليات عليها، خصائصها', 'jtm', 1, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'المعادلات من الدرجة الأولى', 'المعادلات من الدرجة الأولى', 'حل المعادلات من الدرجة الأولى بمجهول واحد', 'jtm', 1, 2, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'المتراجحات', 'المتراجحات', 'حل المتراجحات من الدرجة الأولى', 'jtm', 1, 3, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'الهندسة المستوية', 'الهندسة المستوية', 'المثلثات، الدائرة، النظريات الأساسية', 'jtm', 2, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'النسب المثلثية', 'النسب المثلثية', 'الجيب، جيب التمام، الظل', 'jtm', 2, 2, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'الدوال', 'الدوال', 'تعريف الدوال، المجال، والمدى', '1bac', 1, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'النهايات', 'النهايات', 'تعريف النهايات، قواعد الحساب', '1bac', 1, 2, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'الاشتقاق', 'الاشتقاق', 'قواعد الاشتقاق، تطبيقات', '1bac', 2, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'المتتاليات', 'المتتاليات', 'المتتاليات الحسابية والهندسية', '1bac', 2, 2, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(1, 'المعادلات من الدرجة الثانية', 'المعادلات من الدرجة الثانية', 'المميز، حل المعادلات التربيعية', '2bac', 1, 1, true);

-- دروس الفيزياء
INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(2, 'الحركة', 'الحركة', 'تعريف الحركة، السرعة، التسارع', 'jtm', 1, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(2, 'القوى', 'القوى', 'أنواع القوى، قانون نيوتن الأول', 'jtm', 1, 2, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(2, 'الطاقة', 'الطاقة', 'أنواع الطاقة، تحولاتها', 'jtm', 2, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(2, 'قوانين نيوتن', 'قوانين نيوتن', 'القوانين الثلاثة للحركة', '1bac', 1, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(2, 'الكهرباء', 'الكهرباء', 'التيار الكهربائي، قانون أوم', '1bac', 2, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(2, 'المغناطيسية', 'المغناطيسية', 'المجالات المغناطيسية، الحث', '2bac', 1, 1, true);

-- دروس اللغة العربية
INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(3, 'أقسام الكلمة', 'أقسام الكلمة', 'الاسم، الفعل، الحرف', 'jtm', 1, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(3, 'المبتدأ والخبر', 'المبتدأ والخبر', 'تعريف المبتدأ والخبر، أحكامهما', 'jtm', 1, 2, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(3, 'الفعل الماضي', 'الفعل الماضي', 'صياغة الفعل الماضي، إعرابه', 'jtm', 2, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(3, 'الفعل المضارع', 'الفعل المضارع', 'صياغة الفعل المضارع، إعرابه', 'jtm', 2, 2, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(3, 'البلاغة', 'البلاغة', 'التشبيه، الاستعارة، الكناية', '2bac', 1, 1, true);

-- دروس اللغة الإنجليزية
INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(5, 'Present Simple', 'Present Simple', 'المضارع البسيط: التكوين، الاستخدام', 'jtm', 1, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(5, 'Past Simple', 'Past Simple', 'الماضي البسيط: الأفعال المنتظمة والشاذة', 'jtm', 1, 2, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(5, 'Future Simple', 'Future Simple', 'المستقبل البسيط: will و going to', 'jtm', 1, 3, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(5, 'Present Continuous', 'Present Continuous', 'المضارع المستمر: التكوين، الاستخدام', '1bac', 1, 1, true);

INSERT INTO lessons (subject_id, title, title_ar, description, level, chapter, order_num, is_published) VALUES
(5, 'Passive Voice', 'Passive Voice', 'المبني للمجهول في جميع الأزمنة', '2bac', 1, 1, true);
