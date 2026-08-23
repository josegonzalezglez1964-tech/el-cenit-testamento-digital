# ============================================
# EN USO ACTUALMENTE (obligatorias para arrancar)
# ============================================

# Base de datos PostgreSQL (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/elcenit?schema=public"

# NextAuth (Credentials provider, sesión JWT)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secreto-con-openssl-rand-base64-32"

# ============================================
# ROADMAP / NO IMPLEMENTADO TODAVÍA EN CÓDIGO
# (déjalas vacías o coméntalas si no las necesitas aún)
# ============================================

# Cache / colas
REDIS_URL="redis://localhost:6379"

# Firma con DNIe / certificado digital (AFirma / eIDAS)
AFIRMA_URL="https://afirma.redsara.es"
AFIRMA_APP_ID="your-app-id"

# Registro en blockchain (Alastria)
BLOCKCHAIN_RPC_URL="https://rpc.alastria.io"
BLOCKCHAIN_CONTRACT_ADDRESS="0x..."
BLOCKCHAIN_PRIVATE_KEY="0x..."

# Sello de tiempo (TSA)
TSA_URL="http://tss.ants.gob.es"
TSA_USERNAME="your-tsa-username"
TSA_PASSWORD="your-tsa-password"

# Envío de email (SMTP tipo SendGrid)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-smtp-password"

# SMS / notificaciones (Twilio)
TWILIO_SID="your-twilio-sid"
TWILIO_TOKEN="your-twilio-token"
TWILIO_PHONE="+34600000000"
