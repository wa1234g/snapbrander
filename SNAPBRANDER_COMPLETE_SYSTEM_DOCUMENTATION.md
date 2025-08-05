# 📦 SnapBrander - دليل شامل لبناء نظام SaaS ذكي لتوليد مواقع WordPress

## 🎯 نظرة عامة على المشروع

**SnapBrander** هو نظام SaaS متكامل يتيح للعملاء إنشاء مواقع WordPress احترافية تلقائيًا باستخدام الذكاء الصناعي المحلي (LocalAI)، مع واجهة أمامية مخصصة تعتمد على React، وبنية خلفية تعتمد على Laravel، وCloudPanel لإنشاء مواقع مستقلة بملفات وقاعدة بيانات منفصلة.

### ✨ المزايا الأساسية
- واجهة متقدمة لإنشاء مواقع احترافية باستخدام الذكاء الاصطناعي
- دعم المواقع المتجرية والتجارية والشخصية
- دومين فرعي تلقائي مع إمكانية التعديل
- زرع القوالب تلقائيًا عبر TemplateKit
- توليد الموقع بالكامل دون تدخل يدوي
- تجربة مجانية 72 ساعة
- LocalAI فقط (بدون مزودات خارجية)
- دعم العملة الافتراضية (الجنيه المصري) وقابلة للتخصيص
- دعم كامل للغة العربية مع خط Cairo وتخطيط RTL
- تصميم UI/UX متقدم مع تأثيرات glassmorphism وانيميشن

---

## 🏗️ هيكل المشروع

```
snapbrander/
├── backend/                 # Laravel API Backend
│   ├── app/
│   │   ├── Models/         # Eloquent Models
│   │   ├── Http/Controllers/Api/  # API Controllers
│   │   ├── Services/       # Business Logic Services
│   │   ├── Jobs/          # Background Jobs
│   │   ├── Policies/      # Authorization Policies
│   │   └── Console/Commands/  # Artisan Commands
│   ├── database/
│   │   ├── migrations/    # Database Schema
│   │   └── seeders/       # Sample Data
│   └── routes/api.php     # API Routes
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── pages/         # Page Components
│   │   ├── contexts/      # React Contexts
│   │   ├── services/      # API Services
│   │   └── types/         # TypeScript Types
│   └── public/
└── docs/                  # Documentation
```

---

## 🗄️ قاعدة البيانات - الجداول الأساسية

### 1. جدول المستخدمين (users)
```sql
- id (Primary Key)
- name (اسم المستخدم)
- email (البريد الإلكتروني)
- password (كلمة المرور مشفرة)
- phone (رقم الهاتف)
- country (الدولة - كود ISO)
- language (اللغة المفضلة)
- currency (العملة المفضلة)
- email_verified_at
- created_at, updated_at
```

### 2. جدول المشاريع (projects)
```sql
- id (Primary Key)
- user_id (Foreign Key)
- name (اسم المشروع)
- business_type (نوع النشاط: company/store/landing)
- description (وصف المشروع)
- domain (النطاق الفرعي)
- status (الحالة: draft/generating/active/archived)
- trial_expires_at (انتهاء التجربة المجانية)
- template_id (Foreign Key)
- color_scheme (JSON - نظام الألوان)
- logo_path (مسار الشعار)
- modules (JSON - الموديولات المختارة)
- site_url (رابط الموقع المُنشأ)
- wp_admin_url (رابط لوحة تحكم WordPress)
- wp_username (اسم مستخدم WordPress)
- wp_password (كلمة مرور WordPress)
- created_at, updated_at
```

### 3. جدول الخطط (plans)
```sql
- id (Primary Key)
- name (اسم الخطة)
- price (السعر)
- currency (العملة)
- duration_days (مدة الخطة بالأيام)
- features (JSON - المزايا)
- is_active (نشط/غير نشط)
- created_at, updated_at
```

### 4. جدول القوالب (templates)
```sql
- id (Primary Key)
- name (اسم القالب)
- category (التصنيف: business/store/portfolio/blog/landing)
- preview_image (صورة المعاينة)
- template_kit_path (مسار ملف القالب)
- description (وصف القالب)
- is_active (نشط/غير نشط)
- created_at, updated_at
```

### 5. جدول طلبات الذكاء الاصطناعي (ai_requests)
```sql
- id (Primary Key)
- user_id (Foreign Key)
- type (نوع الطلب: description/logo/content/translation)
- prompt (النص المُدخل)
- response (الاستجابة)
- status (الحالة: pending/completed/failed)
- processing_time (وقت المعالجة)
- created_at, updated_at
```

### 6. جدول المسودات (drafts)
```sql
- id (Primary Key)
- user_id (Foreign Key)
- step_data (JSON - بيانات كل خطوة)
- current_step (الخطوة الحالية)
- created_at, updated_at
```

### 7. جداول إضافية
- **project_logs**: سجل العمليات على المشاريع
- **notifications**: الإشعارات
- **template_uploads**: رفع القوالب المخصصة
- **session_resume**: استكمال الجلسات
- **team_members**: أعضاء الفريق
- **modules**: الموديولات الاختيارية
- **project_addons**: الإضافات المثبتة
- **ai_chat_sessions**: جلسات الدردشة مع الذكاء الاصطناعي
- **settings**: إعدادات النظام
- **media_gallery**: معرض الوسائط
- **marketplace_items**: عناصر السوق
- **permissions**: الصلاحيات

---

## 🔌 API Endpoints - نقاط النهاية

### 🔐 المصادقة (Authentication)
```
POST /api/register          # تسجيل حساب جديد
POST /api/login             # تسجيل الدخول
POST /api/logout            # تسجيل الخروج
POST /api/refresh           # تحديث الرمز المميز
GET  /api/user              # بيانات المستخدم الحالي
```

### 🏗️ دورة حياة المشروع (Project Lifecycle)
```
POST /api/projects/init                    # بدء مشروع جديد
POST /api/ai/generate-description          # توليد وصف بالذكاء الاصطناعي
GET  /api/templates                        # قائمة القوالب
POST /api/projects/{id}/select-template    # اختيار قالب
POST /api/ai/generate-colors              # توليد نظام ألوان
POST /api/projects/{id}/set-colors        # حفظ نظام الألوان
POST /api/ai/generate-logo                # توليد شعار
POST /api/projects/{id}/upload-logo       # رفع شعار
POST /api/projects/{id}/generate-site     # إنشاء الموقع
```

### 🤖 الذكاء الاصطناعي (AI Operations)
```
POST /api/ai/generate-content    # توليد محتوى
POST /api/ai/translate          # ترجمة النصوص
POST /api/ai/chat              # مساعد ذكي
POST /api/ai/edit-image        # تعديل الصور
```

### 📝 إدارة المسودات (Draft Management)
```
GET  /api/drafts               # استرجاع المسودة
POST /api/drafts               # حفظ المسودة
PUT  /api/drafts/{id}          # تحديث المسودة
DELETE /api/drafts/{id}        # حذف المسودة
```

### ⚙️ الإعدادات والموديولات
```
GET  /api/modules              # قائمة الموديولات
GET  /api/settings             # إعدادات النظام
PUT  /api/settings             # تحديث الإعدادات
```

---

## 🎨 الواجهة الأمامية (Frontend React)

### 🧭 نموذج متعدد الخطوات (Multi-Step Wizard)

#### الخطوة 1: معلومات النشاط (BusinessInfoStep)
- اسم المشروع
- اسم النشاط التجاري
- نوع النشاط (شركة/متجر/صفحة هبوط)
- مجال العمل
- وصف النشاط (اختياري)

#### الخطوة 2: وصف المشروع (ProjectDescriptionStep)
- عرض الوصف المُولد بالذكاء الاصطناعي
- إمكانية التعديل والتخصيص
- زر إعادة التوليد

#### الخطوة 3: اختيار القالب (TemplateSelectionStep)
- معرض القوالب مع المعاينة
- تصنيف القوالب (أعمال/متجر/معرض أعمال/مدونة/صفحة هبوط)
- معاينة مباشرة للقالب

#### الخطوة 4: اختيار الألوان (ColorSelectionStep)
- نظم ألوان مُولدة بالذكاء الاصطناعي
- إمكانية التخصيص اليدوي
- معاينة مباشرة للألوان

#### الخطوة 5: الشعار (LogoStep)
- رفع شعار موجود
- توليد شعار بالذكاء الاصطناعي
- تعديل الشعار المُولد

#### الخطوة 6: الموديولات (ModulesStep)
- نموذج تواصل
- دردشة مباشرة
- نظام حجوزات
- ربط وسائل التواصل الاجتماعي
- تحليلات الموقع

#### الخطوة 7: إنشاء الموقع (GenerationStep)
- مراجعة نهائية لجميع الاختيارات
- زر "إنشاء موقعي الآن"
- شريط تقدم الإنشاء
- عرض بيانات الموقع المُنشأ

### 🎨 تصميم UI/UX المتقدم
- **خط Cairo**: مستخدم في جميع النصوص العربية
- **تخطيط RTL**: دعم كامل للغة العربية
- **Glassmorphism**: تأثيرات زجاجية شفافة
- **انيميشن متقدم**: تحريكات سلسة وجذابة
- **ألوان متدرجة**: خلفيات وأزرار بألوان متدرجة
- **تفاعلية عالية**: hover effects وtransitions
- **تصميم متجاوب**: يعمل على جميع الأجهزة

### 🔄 إدارة الحالة (State Management)
- **React Context**: لإدارة حالة المصادقة والنموذج
- **React Query**: لإدارة حالة الخادم والتخزين المؤقت
- **localStorage**: لحفظ المسودات محلياً

---

## 🤖 تكامل الذكاء الاصطناعي (LocalAI Integration)

### 🧠 النماذج المستخدمة
- **mistral-7b-instruct** أو **TinyLlama**: لتوليد النصوص والمحتوى
- **Stable Diffusion**: لتوليد الشعارات والصور
- **RemBG**: لإزالة خلفيات الصور

### 📝 المهام المدعومة
1. **توليد الوصف**: وصف تلقائي للمشروع بناءً على نوع النشاط
2. **توليد الشعار**: إنشاء شعارات احترافية
3. **كتابة المحتوى**: محتوى الصفحات والأقسام
4. **اختيار الألوان**: نظم ألوان مناسبة لنوع النشاط
5. **الترجمة**: ترجمة المحتوى حسب اللغة المحددة
6. **المساعد الذكي**: دردشة مع العميل داخل النموذج

### 🔧 خدمة LocalAI (LocalAIService)
```php
class LocalAIService
{
    public function generateDescription($businessType, $businessName)
    public function generateLogo($prompt, $style)
    public function generateColors($businessType)
    public function generateContent($contentType, $context)
    public function translateText($text, $targetLanguage)
    public function chatAssistant($message, $context)
}
```

---

## ☁️ تكامل CloudPanel

### 🌐 إنشاء المواقع التلقائي
1. **توليد دومين فرعي**: project-xyz.fureraa.com
2. **إنشاء موقع جديد**: موقع مستقل وليس multisite
3. **تثبيت WordPress**: أحدث إصدار مع Hello Elementor
4. **تثبيت WooCommerce**: للمتاجر الإلكترونية
5. **استيراد القالب**: تثبيت TemplateKit تلقائياً
6. **التخصيص التلقائي**: الألوان والشعار والمحتوى

### 🔧 خدمة CloudPanel (CloudPanelService)
```php
class CloudPanelService
{
    public function createSite($domain, $projectData)
    public function installWordPress($siteId)
    public function installWooCommerce($siteId)
    public function importTemplate($siteId, $templatePath)
    public function customizeSite($siteId, $customizations)
    public function archiveSite($siteId)
    public function deleteSite($siteId)
}
```

---

## ⏰ دورة حياة المشروع (Project Lifecycle)

### 1. بداية المشروع
- العميل يبدأ تعبئة النموذج
- حفظ تلقائي لكل خطوة في `drafts`
- إمكانية استكمال النموذج لاحقاً

### 2. اختيار القالب
- عرض القوالب المناسبة لنوع النشاط
- معاينة مباشرة للقالب
- حفظ الاختيار في `projects`

### 3. إنشاء الموقع
عند الضغط على "إنشاء موقعي":
- توليد دومين فرعي تلقائياً
- إنشاء موقع جديد على CloudPanel
- تثبيت WordPress + Hello Elementor
- تثبيت WooCommerce (للمتاجر)
- استيراد وتخصيص القالب
- تطبيق الألوان والشعار والمحتوى

### 4. التسليم
- عرض بيانات الدخول
- رابط الموقع الجديد
- بدء العداد التنازلي 72 ساعة

### 5. إدارة التجربة المجانية
- تنبيهات قبل انتهاء التجربة
- أرشفة الموقع عند انتهاء التجربة
- حذف نهائي بعد 3 أيام من الأرشفة

---

## 🔄 المهام الخلفية (Background Jobs)

### 1. إنشاء موقع WordPress (GenerateWordPressSite)
```php
class GenerateWordPressSite implements ShouldQueue
{
    public function handle()
    {
        // إنشاء الموقع على CloudPanel
        // تثبيت WordPress وWooCommerce
        // استيراد القالب
        // تخصيص المحتوى والألوان
        // إرسال إشعار للعميل
    }
}
```

### 2. أرشفة التجارب المنتهية (ArchiveExpiredTrials)
```php
class ArchiveExpiredTrials extends Command
{
    public function handle()
    {
        // البحث عن المشاريع المنتهية الصلاحية
        // أرشفة المواقع
        // إرسال تنبيهات للعملاء
    }
}
```

### 3. حذف المشاريع المؤرشفة (DeleteArchivedProjects)
```php
class DeleteArchivedProjects extends Command
{
    public function handle()
    {
        // حذف المشاريع المؤرشفة لأكثر من 3 أيام
        // تنظيف قاعدة البيانات
        // تنظيف ملفات الخادم
    }
}
```

---

## 🌍 دعم اللغة العربية

### 🎨 التصميم والخطوط
- **خط Cairo**: خط أساسي لجميع النصوص العربية
- **تخطيط RTL**: دعم كامل للاتجاه من اليمين لليسار
- **تنسيق العملة**: الجنيه المصري كعملة افتراضية
- **اختيار الدولة**: قائمة منسدلة بالدول العربية

### 🗣️ الترجمة والمحتوى
- **react-i18next**: نظام ترجمة متقدم
- **محتوى ديناميكي**: ترجمة تلقائية للمحتوى المُولد
- **لهجات محلية**: دعم اللهجات المختلفة (مصري، سعودي، إلخ)

### 💰 العملات المدعومة
- الجنيه المصري (EGP) - افتراضي
- الريال السعودي (SAR)
- الدرهم الإماراتي (AED)
- الدينار الكويتي (KWD)
- وعملات عربية أخرى

---

## 🔒 الأمان والصلاحيات

### 🛡️ المصادقة
- **Laravel Sanctum**: نظام مصادقة آمن
- **تشفير كلمات المرور**: bcrypt hashing
- **رموز الوصول**: JWT tokens للAPI

### 👥 إدارة الفرق (RBAC)
```php
// الأدوار المتاحة
- Owner: مالك المشروع
- Editor: محرر
- Viewer: مشاهد فقط

// الصلاحيات
- manage_project: إدارة المشروع
- edit_content: تعديل المحتوى
- use_ai: استخدام الذكاء الاصطناعي
- upload_media: رفع الوسائط
- manage_team: إدارة الفريق
```

---

## 📊 المزايا المستقبلية

### 🤖 مساعد ذكي متقدم
- دمج في لوحة تحكم WordPress
- تعديل ذكي للمحتوى والتصميم
- تحسين SEO تلقائي

### 🖼️ محرر صور بالذكاء الاصطناعي
- تعديل الشعارات والصور
- إزالة الخلفيات
- تحسين جودة الصور

### 🛍️ سوق داخلي (Marketplace)
- بيع وشراء القوالب
- شعارات جاهزة
- إضافات مخصصة

### 📈 تحليلات متقدمة
- تتبع الزوار
- تحليل الأداء
- تقارير التحويلات

### 🌐 تكامل SSO
- تسجيل دخول موحد Laravel ↔ WordPress
- إدارة مركزية للمستخدمين

---

## 🚀 التثبيت والإعداد

### 📋 متطلبات النظام
- PHP 8.1+
- Node.js 18+
- MySQL/PostgreSQL
- Redis (للطوابير)
- LocalAI Server
- CloudPanel Access

### ⚙️ إعداد Backend (Laravel)
```bash
# استنساخ المشروع
git clone https://github.com/wa1234g/snapbrander.git
cd snapbrander/backend

# تثبيت التبعيات
composer install

# إعداد البيئة
cp .env.example .env
php artisan key:generate

# إعداد قاعدة البيانات
php artisan migrate
php artisan db:seed

# تشغيل الطوابير
php artisan queue:work

# تشغيل الخادم
php artisan serve --port=8001
```

### 🎨 إعداد Frontend (React)
```bash
# الانتقال لمجلد Frontend
cd ../frontend

# تثبيت التبعيات
npm install

# إعداد البيئة
cp .env.example .env

# تشغيل خادم التطوير
npm run dev
```

### 🔧 إعداد LocalAI
```bash
# تثبيت LocalAI
curl -Lo local-ai "https://github.com/mudler/LocalAI/releases/download/{{< version >}}/local-ai-Linux-x86_64" && chmod +x local-ai

# تشغيل LocalAI
./local-ai --models-path ./models --context-size 512
```

---

## 🧪 الاختبار والتطوير

### 🔍 اختبار Backend
```bash
# تشغيل الاختبارات
php artisan test

# اختبار API endpoints
php artisan test --filter=ApiTest
```

### 🎯 اختبار Frontend
```bash
# اختبار الوحدة
npm run test

# اختبار E2E
npm run test:e2e
```

### 🐛 التصحيح (Debugging)
- **Laravel Telescope**: مراقبة الطلبات والاستعلامات
- **React DevTools**: تصحيح مكونات React
- **Browser DevTools**: تصحيح JavaScript وCSS

---

## 📚 الوثائق التقنية

### 🗂️ هيكل قاعدة البيانات
- [مخطط قاعدة البيانات](docs/database-schema.md)
- [علاقات الجداول](docs/relationships.md)

### 🔌 وثائق API
- [مرجع API كامل](docs/api-reference.md)
- [أمثلة الاستخدام](docs/api-examples.md)

### 🎨 دليل التصميم
- [نظام التصميم](docs/design-system.md)
- [مكونات UI](docs/ui-components.md)

---

## 🤝 المساهمة والتطوير

### 📝 إرشادات المساهمة
1. Fork المشروع
2. إنشاء branch جديد للميزة
3. Commit التغييرات
4. Push للـ branch
5. إنشاء Pull Request

### 🏷️ معايير الكود
- **PSR-12** للـ PHP
- **ESLint + Prettier** للـ JavaScript/TypeScript
- **تعليقات شاملة** للكود
- **اختبارات وحدة** لجميع الميزات

---

## 📞 الدعم والمساعدة

### 🐛 الإبلاغ عن الأخطاء
- [GitHub Issues](https://github.com/wa1234g/snapbrander/issues)
- وصف مفصل للمشكلة
- خطوات إعادة الإنتاج

### 💡 طلب ميزات جديدة
- [GitHub Discussions](https://github.com/wa1234g/snapbrander/discussions)
- وصف الميزة المطلوبة
- حالات الاستخدام

### 📧 التواصل
- البريد الإلكتروني: support@snapbrander.com
- التوثيق: [docs.snapbrander.com](https://docs.snapbrander.com)

---

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE) - راجع ملف LICENSE للتفاصيل.

---

## 🙏 شكر وتقدير

- فريق Laravel لإطار العمل الرائع
- فريق React لمكتبة UI المتقدمة
- مجتمع LocalAI للذكاء الاصطناعي المحلي
- فريق CloudPanel لحلول الاستضافة

---

**تم إنشاء هذا المشروع بواسطة Devin AI لـ @wa1234g**
**رابط جلسة Devin**: https://app.devin.ai/sessions/a6d228b3cd5f4b0bb1585558fec68911

---

*آخر تحديث: أغسطس 2025*
