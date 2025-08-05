# SnapBrander - Final Deployment Guide

## 🚀 Production Deployment Steps

### 1. Server Requirements
- **CloudPanel Server** with PHP 8.1+, MySQL/PostgreSQL, Node.js 18+
- **LocalAI Server** running on port 8080 with required models
- **Domain/Subdomain** for the main application
- **SSL Certificate** for secure connections

### 2. Backend Deployment (Laravel)

#### Upload Backend Files
```bash
# Upload the entire backend directory to your CloudPanel server
scp -r /home/ubuntu/snapbrander/backend/ user@your-server:/path/to/snapbrander/
```

#### Environment Configuration
```bash
# Copy and configure environment file
cp .env.example .env

# Update these critical settings in .env:
APP_URL=https://your-domain.com
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=snapbrander_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# CloudPanel Configuration
CLOUDPANEL_URL=https://your-cloudpanel-server.com
CLOUDPANEL_API_KEY=your-actual-api-key
CLOUDPANEL_DEV_MODE=false

# LocalAI Configuration
LOCALAI_URL=http://localhost:8080
LOCALAI_DEV_MODE=false

# JWT Secret
JWT_SECRET=your-secure-jwt-secret-key
```

#### Database Setup
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database with initial data
php artisan db:seed
```

#### Queue and Scheduler Setup
```bash
# Start queue worker (use supervisor in production)
php artisan queue:work

# Add to crontab for scheduled tasks
* * * * * cd /path/to/snapbrander/backend && php artisan schedule:run >> /dev/null 2>&1
```

### 3. Frontend Deployment (React)

#### Build Frontend
```bash
cd frontend/

# Install dependencies
npm install

# Update API URL in .env
echo "VITE_API_URL=https://your-domain.com/api" > .env

# Build for production
npm run build
```

#### Deploy Built Files
```bash
# Upload dist folder to your web server
scp -r dist/ user@your-server:/path/to/web/root/
```

### 4. CloudPanel Site Configuration

#### Create Main Application Site
```bash
# Using CloudPanel CLI
clpctl site:add:php \
  --domainName=your-domain.com \
  --phpVersion=8.1 \
  --vhostTemplate=Laravel \
  --documentRoot=/path/to/snapbrander/backend/public
```

#### Configure Nginx/Apache
- Point document root to `backend/public`
- Enable URL rewriting for Laravel routes
- Configure SSL certificate
- Set up proper file permissions

### 5. LocalAI Server Setup

#### Install LocalAI
```bash
# Download and install LocalAI
curl -Lo local-ai "https://github.com/mudler/LocalAI/releases/download/v2.1.0/local-ai-Linux-x86_64"
chmod +x local-ai

# Create models directory
mkdir -p models/

# Download required models
wget -O models/mistral-7b-instruct.bin "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGML/resolve/main/mistral-7b-instruct-v0.1.q4_0.bin"
```

#### Start LocalAI Service
```bash
# Start LocalAI server
./local-ai --models-path=./models --address=0.0.0.0:8080

# Or create systemd service for production
sudo systemctl enable localai
sudo systemctl start localai
```

### 6. Production Configuration

#### File Permissions
```bash
# Set proper Laravel permissions
sudo chown -R www-data:www-data /path/to/snapbrander/backend/
sudo chmod -R 755 /path/to/snapbrander/backend/
sudo chmod -R 775 /path/to/snapbrander/backend/storage/
sudo chmod -R 775 /path/to/snapbrander/backend/bootstrap/cache/
```

#### Security Settings
```bash
# Disable debug mode
APP_DEBUG=false

# Set secure session settings
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=strict

# Configure CORS for production
FRONTEND_URL=https://your-domain.com
```

### 7. CloudPanel API Configuration

#### Generate API Key
1. Login to CloudPanel admin
2. Go to API section
3. Generate new API key
4. Update `CLOUDPANEL_API_KEY` in .env

#### Test CloudPanel Integration
```bash
# Test API connection
php artisan tinker
>>> app(App\Services\CloudPanelService::class)->testConnection()
```

### 8. Monitoring and Maintenance

#### Log Monitoring
```bash
# Monitor Laravel logs
tail -f storage/logs/laravel.log

# Monitor queue jobs
php artisan queue:monitor
```

#### Backup Strategy
```bash
# Database backup
php artisan backup:run

# File backup
rsync -av /path/to/snapbrander/ /backup/location/
```

### 9. Testing Production Deployment

#### Functionality Tests
1. **User Registration/Login** - Test authentication flow
2. **Wizard Completion** - Create test WordPress site
3. **Payment Processing** - Test subscription flow
4. **Admin Dashboard** - Verify admin functions
5. **Site Generation** - Confirm CloudPanel integration

#### Performance Tests
- Load testing with multiple concurrent users
- Database query optimization
- CDN configuration for static assets
- Caching strategy implementation

### 10. Go-Live Checklist

- [ ] Backend deployed and configured
- [ ] Frontend built and deployed
- [ ] Database migrated and seeded
- [ ] CloudPanel API configured and tested
- [ ] LocalAI server running with models
- [ ] SSL certificates installed
- [ ] DNS records configured
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Performance optimization complete
- [ ] Security audit passed
- [ ] User acceptance testing complete

## 🔧 Troubleshooting

### Common Issues

#### CloudPanel Connection Failed
- Verify API key is correct
- Check CloudPanel server accessibility
- Ensure firewall allows API connections

#### LocalAI Not Responding
- Check if LocalAI service is running
- Verify models are downloaded correctly
- Check port 8080 accessibility

#### Database Connection Issues
- Verify database credentials
- Check database server status
- Ensure database exists and is accessible

#### Frontend API Errors
- Verify CORS configuration
- Check API URL in frontend .env
- Ensure backend routes are accessible

## 📞 Support

For deployment assistance:
- Check Laravel logs: `storage/logs/laravel.log`
- Monitor queue jobs: `php artisan queue:monitor`
- Test API endpoints: Use Postman or curl
- Verify CloudPanel integration: Check project logs

---

**Deployment Status**: Ready for production deployment
**Estimated Deployment Time**: 2-4 hours depending on server setup
**Support**: All components tested and documented for smooth deployment
