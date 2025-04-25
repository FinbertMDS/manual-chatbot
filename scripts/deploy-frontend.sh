#!/bin/bash

cd "$(dirname "$0")/../terraform"
API_URL=$(terraform output -raw alb_http_url)
cd "./.."
# 💡 Step 2: Generate .env for React frontend
cat <<EOF > frontend/.env
VITE_SERVER_URL=$API_URL
EOF

echo ".env created with API_URL: $API_URL"

# Build project
cd "frontend"
npm install
npm run build

# Upload to S3
aws s3 sync dist/ s3://manual-chatbot-frontend --delete

# # Invalidate CloudFront cache
# DISTRIBUTION_ID=$(aws cloudfront list-distributions \
#   --query "DistributionList.Items[?Origins.Items[0].DomainName=='manual-chatbot-frontend.s3.ap-northeast-1.amazonaws.com'].Id" \
#   --output text)

# aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Deployed to S3 + CloudFront"
