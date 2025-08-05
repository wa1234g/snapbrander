# SnapBrander - تعليمات النشر على CloudPanel

## متطلبات النظام

### 1. متطلبات السيرفر
- Ubuntu 20.04+ أو CentOS 8+
- CloudPanel مثبت ومُفعل
- PHP 8.1+
- Node.js 18+
- MySQL 8.0+ أو PostgreSQL 13+
- Redis (اختياري للكاش)
- LocalAI مثبت ومُفعل

### 2. متطلبات LocalAI
```bash
# تثبيت LocalAI
curl https://localai.io/install.sh | sh

# تشغيل LocalAI مع النماذج المطلوبة
localai run --models-path ./models --address 0.0.0.0:8080

# تحميل النماذج المطلوبة
localai models install mistral-7b-instruct
localai models install tinyllama
localai models install stable-diffusion
```

## خطوات النشر

### 1. رفع الملفات

#### Backend (Laravel)
```bash
# رفع ملفات Backend إلى مجلد الموقع
cd /home/cloudpanel/htdocs/snapbrander.com
git clone https://github.com/wa1234g/snapbrander.git .

# تثبيت Dependencies
composer install --optimize-autoloader --no-dev

# إعداد البيئة
cp .env.example .env
php artisan key:generate
```

#### Frontend (React)
```bash
# بناء Frontend
cd frontend
npm install
npm run build

# نسخ ملفات البناء
cp -r dist/* ../public/
```

### 2. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
mysql -u root -p
CREATE DATABASE snapbrander CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'snapbrander'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON snapbrander.* TO 'snapbrander'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# تشغيل Migrations
php artisan migrate
php artisan db:seed
```

### 3. إعداد ملف البيئة (.env)

```env
APP_NAME="SnapBrander"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://snapbrander.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=snapbrander
DB_USERNAME=snapbrander
DB_PASSWORD=strong_password

# LocalAI Configuration
LOCALAI_BASE_URL=http://localhost:8080
LOCALAI_API_KEY=your_api_key_here

# CloudPanel Configuration
CLOUDPANEL_API_URL=https://your-server.com:8443/api/v1
CLOUDPANEL_API_KEY=your_cloudpanel_api_key
CLOUDPANEL_DOMAIN=fureraa.com

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@snapbrander.com
MAIL_FROM_NAME="SnapBrander"

# Queue Configuration
QUEUE_CONNECTION=database

# Session Configuration
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Cache Configuration
CACHE_DRIVER=file
```

### 4. إعداد CloudPanel

#### إنشاء موقع جديد
```bash
# إنشاء موقع رئيسي
clpctl site:add:php --domainName=snapbrander.com --phpVersion=8.1 --vhostTemplate=Generic --siteUser=snapbrander --siteUserPassword=strong_password

# إعداد SSL
clpctl lets-encrypt:install:certificate --domainName=snapbrander.com
```

#### إعداد Subdomain Wildcard
```bash
# إضافة DNS Record للـ Wildcard
# *.fureraa.com A 192.168.1.100

# إعداد Nginx للـ Wildcard Subdomains
nano /etc/nginx/sites-available/wildcard-fureraa.conf
```

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name *.fureraa.com;
    
    ssl_certificate /etc/letsencrypt/live/fureraa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fureraa.com/privkey.pem;
    
    root /home/cloudpanel/htdocs/sites/$subdomain;
    index index.php index.html;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 5. إعداد Cron Jobs

```bash
# إضافة Cron Jobs
crontab -e

# إضافة هذه الأسطر
* * * * * cd /home/cloudpanel/htdocs/snapbrander.com && php artisan schedule:run >> /dev/null 2>&1
0 */6 * * * cd /home/cloudpanel/htdocs/snapbrander.com && php artisan snapbrander:archive-expired-trials
0 2 * * * cd /home/cloudpanel/htdocs/snapbrander.com && php artisan snapbrander:delete-archived-projects
```

### 6. إعداد Queue Worker

```bash
# إنشاء Systemd Service
nano /etc/systemd/system/snapbrander-worker.service
```

```ini
[Unit]
Description=SnapBrander Queue Worker
After=network.target

[Service]
Type=simple
User=cloudpanel
WorkingDirectory=/home/cloudpanel/htdocs/snapbrander.com
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# تفعيل الخدمة
systemctl enable snapbrander-worker
systemctl start snapbrander-worker
```

### 7. إعداد الصلاحيات

```bash
# إعداد صلاحيات الملفات
chown -R cloudpanel:cloudpanel /home/cloudpanel/htdocs/snapbrander.com
chmod -R 755 /home/cloudpanel/htdocs/snapbrander.com
chmod -R 775 /home/cloudpanel/htdocs/snapbrander.com/storage
chmod -R 775 /home/cloudpanel/htdocs/snapbrander.com/bootstrap/cache
```

### 8. تحسين الأداء

```bash
# تحسين Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# تحسين Composer
composer dump-autoload --optimize
```

## إعداد LocalAI للإنتاج

### 1. تثبيت النماذج
```bash
# إنشاء مجلد النماذج
mkdir -p /opt/localai/models

# تحميل النماذج
cd /opt/localai/models
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.q4_0.gguf
wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.q4_0.gguf
```

### 2. إعداد Systemd Service
```bash
nano /etc/systemd/system/localai.service
```

```ini
[Unit]
Description=LocalAI Service
After=network.target

[Service]
Type=simple
User=localai
WorkingDirectory=/opt/localai
ExecStart=/usr/local/bin/localai run --models-path ./models --address 0.0.0.0:8080
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable localai
systemctl start localai
```

## اختبار النظام

### 1. اختبار Backend
```bash
# اختبار API
curl -X GET https://snapbrander.com/api/health
curl -X GET https://snapbrander.com/api/templates
```

### 2. اختبار LocalAI
```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "mistral-7b-instruct", "messages": [{"role": "user", "content": "Hello"}]}'
```

### 3. اختبار CloudPanel Integration
```bash
# اختبار إنشاء موقع
php artisan tinker
>>> $service = app(\App\Services\CloudPanelService::class);
>>> $service->createSite('test-site', 'Test Site');
```

## الصيانة والمراقبة

### 1. مراقبة Logs
```bash
# Laravel Logs
tail -f /home/cloudpanel/htdocs/snapbrander.com/storage/logs/laravel.log

# Nginx Logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# LocalAI Logs
journalctl -u localai -f
```

### 2. النسخ الاحتياطي
```bash
# إنشاء script للنسخ الاحتياطي
nano /opt/backup-snapbrander.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/snapbrander"

# إنشاء مجلد النسخ الاحتياطي
mkdir -p $BACKUP_DIR

# نسخ احتياطي لقاعدة البيانات
mysqldump -u snapbrander -p snapbrander > $BACKUP_DIR/database_$DATE.sql

# نسخ احتياطي للملفات
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /home/cloudpanel/htdocs/snapbrander.com

# حذف النسخ القديمة (أكثر من 30 يوم)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

```bash
chmod +x /opt/backup-snapbrander.sh

# إضافة إلى Cron
echo "0 2 * * * /opt/backup-snapbrander.sh" | crontab -
```

## استكشاف الأخطاء

### 1. مشاكل شائعة

#### خطأ في الصلاحيات
```bash
chown -R cloudpanel:cloudpanel /home/cloudpanel/htdocs/snapbrander.com
chmod -R 775 storage bootstrap/cache
```

#### خطأ في قاعدة البيانات
```bash
php artisan migrate:fresh --seed
```

#### خطأ في LocalAI
```bash
systemctl restart localai
journalctl -u localai -n 50
```

### 2. مراقبة الأداء
```bash
# مراقبة استخدام الذاكرة
free -h

# مراقبة استخدام المعالج
top

# مراقبة مساحة القرص
df -h
```

## الأمان

### 1. إعداد Firewall
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 8443
ufw enable
```

### 2. تحديث النظام
```bash
apt update && apt upgrade -y
```

### 3. مراقبة الأمان
```bash
# تثبيت Fail2Ban
apt install fail2ban

# إعداد Fail2Ban للـ SSH
nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
```

هذا دليل شامل لنشر نظام SnapBrander على CloudPanel. تأكد من اتباع جميع الخطوات بعناية وإجراء اختبارات شاملة قبل التشغيل في بيئة الإنتاج.
