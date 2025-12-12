# MindCraft AI Challenge Generator - Webhook Test Script (PowerShell)
# Usage: .\test-webhook.ps1 [skill-path-id]

param(
    [string]$SkillPathId = ""
)

$webhookUrl = "http://localhost:5678/webhook/generate-challenge"

if ([string]::IsNullOrEmpty($SkillPathId)) {
    Write-Host "🚀 Generating challenges for ALL active skill paths..." -ForegroundColor Green
    $body = @{} | ConvertTo-Json
} else {
    Write-Host "🚀 Generating challenge for skill path: $SkillPathId" -ForegroundColor Green
    $body = @{
        skillPathId = $SkillPathId
    } | ConvertTo-Json
}

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Request sent successfully!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

