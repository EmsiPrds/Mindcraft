#!/bin/bash

# MindCraft AI Challenge Generator - Webhook Test Script
# Usage: ./test-webhook.sh [skill-path-id]

WEBHOOK_URL="http://localhost:5678/webhook/generate-challenge"

# Check if skill path ID is provided
if [ -z "$1" ]; then
  echo "🚀 Generating challenges for ALL active skill paths..."
  curl -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d '{}'
else
  echo "🚀 Generating challenge for skill path: $1"
  curl -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "{\"skillPathId\": \"$1\"}"
fi

echo ""
echo "✅ Request sent! Check n8n execution logs for results."

