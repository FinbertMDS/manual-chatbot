#!/bin/bash

cd "$(dirname "$0")/../terraform"
SERVER_IP=$(terraform output -raw ec2_public_ip)
cd "./.."
# 💡 Step 2: Generate .env for React frontend
cat <<EOF > frontend/.env
VITE_SERVER_URL=http://$SERVER_IP:3001
EOF

echo ".env created with SERVER_IP: $SERVER_IP"

# Build project
cd "frontend"
npm install
npm run build

# Upload to S3
aws s3 sync dist/ s3://manual-chatbot-frontend --delete

# Invalidate CloudFront cache
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Origins.Items[0].DomainName=='manual-chatbot-frontend.s3.ap-northeast-1.amazonaws.com'].Id" \
  --output text)

aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Deployed to S3 + CloudFront"
