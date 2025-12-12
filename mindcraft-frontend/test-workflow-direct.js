// Direct Workflow Test Script
// Run with: node test-workflow-direct.js

const WEBHOOK_URL = "https://n8n.cloudmateria.com/webhook-test/generate-challenge";
const BACKEND_URL = "http://localhost:3000";

async function testBackend() {
  console.log("🔍 Testing backend connection...");
  try {
    const response = await fetch(`${BACKEND_URL}/`);
    const text = await response.text();
    console.log("✅ Backend is running:", text);
    return true;
  } catch (error) {
    console.error("❌ Backend connection failed:", error.message);
    console.log("💡 Make sure backend is running: cd mindcraft-backend && npm run dev");
    return false;
  }
}

async function testSkillPaths() {
  console.log("\n🔍 Testing skill paths endpoint...");
  try {
    const response = await fetch(`${BACKEND_URL}/api/skill-paths?isActive=true`);
    const data = await response.json();
    console.log("✅ Skill paths found:", data.data?.length || 0);
    if (data.data && data.data.length > 0) {
      console.log("   First skill path:", data.data[0].name);
    } else {
      console.log("⚠️  No active skill paths found in database");
    }
    return data.data?.length > 0;
  } catch (error) {
    console.error("❌ Skill paths endpoint failed:", error.message);
    return false;
  }
}

async function testWebhook() {
  console.log("\n🚀 Testing n8n webhook...");
  console.log("   URL:", WEBHOOK_URL);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Webhook responded successfully!");
      console.log("   Response:", JSON.stringify(data, null, 2));
      return true;
    } else {
      console.error("❌ Webhook returned error:", response.status);
      console.error("   Response:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Webhook request failed:", error.message);
    console.log("💡 Check if workflow is active in n8n");
    return false;
  }
}

async function testWebhookWithSkillPath(skillPathId) {
  console.log(`\n🚀 Testing webhook with specific skill path: ${skillPathId}`);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skillPathId: skillPathId,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Webhook responded successfully!");
      console.log("   Response:", JSON.stringify(data, null, 2));
      return true;
    } else {
      console.error("❌ Webhook returned error:", response.status);
      console.error("   Response:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Webhook request failed:", error.message);
    return false;
  }
}

async function main() {
  console.log("🧪 MindCraft AI Challenge Generator - Direct Test\n");
  console.log("=" .repeat(50));

  // Test 1: Backend connection
  const backendOk = await testBackend();
  if (!backendOk) {
    console.log("\n❌ Backend is not running. Please start it first.");
    process.exit(1);
  }

  // Test 2: Skill paths endpoint
  const skillPathsOk = await testSkillPaths();
  if (!skillPathsOk) {
    console.log("\n⚠️  No active skill paths found. The workflow will fail.");
    console.log("   Create at least one active skill path in your database.");
  }

  // Test 3: Webhook
  console.log("\n" + "=".repeat(50));
  await testWebhook();

  console.log("\n" + "=".repeat(50));
  console.log("✅ Test complete!");
  console.log("\n💡 Next steps:");
  console.log("   1. Check n8n execution logs for detailed workflow run");
  console.log("   2. Verify challenge was created in your database");
  console.log("   3. Check backend logs for any errors");
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === "undefined") {
  console.error("❌ This script requires Node.js 18+ or install node-fetch");
  console.log("   Install: npm install node-fetch");
  process.exit(1);
}

main().catch(console.error);

