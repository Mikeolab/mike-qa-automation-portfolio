# 🔒 SECURE Environment Template
# Copy this file to .env and replace placeholder values with your actual credentials
# NEVER commit .env files to version control!

# ===========================================
# API CONFIGURATION
# ===========================================

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Twilio Configuration
TWILIO_ACCOUNT_SID=AC_your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# ===========================================
# DATABASE CONFIGURATION
# ===========================================

DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# ===========================================
# APPLICATION CONFIGURATION
# ===========================================

NODE_ENV=development
PORT=3000
API_URL=https://api.yourdomain.com
WEBHOOK_URL=https://yourdomain.com/webhook

# ===========================================
# SECURITY NOTES
# ===========================================
# 1. Use strong, unique passwords
# 2. Rotate API keys regularly
# 3. Use environment-specific values
# 4. Never share these credentials
# 5. Use a password manager
