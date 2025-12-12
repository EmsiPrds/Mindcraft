/**
 * Seed Script for Creating Sample Challenges
 * Run this script to populate the database with sample challenges for testing
 * 
 * Usage: Call via admin endpoint POST /api/admin/seed/challenges
 */

import SkillPath from "@/models/skillPath.model";
import Challenge from "@/models/challenge.model";

// Sample challenges data
const sampleChallenges = [
  // Graphic Design Path
  {
    skillPathName: "Graphic Design",
    challenges: [
      {
        title: "Create a Color Palette",
        description: "Design a cohesive color palette with 5 colors",
        instructions: "Create a color palette that works well together. Consider primary, secondary, and accent colors. Use a tool like Coolors or Adobe Color.",
        difficulty: "beginner" as const,
        dayNumber: 1,
        xpReward: 100,
        coinReward: 10,
        estimatedTime: 30,
        tags: ["color", "design", "palette"],
      },
      {
        title: "Design a Logo",
        description: "Create a simple logo for a fictional brand",
        instructions: "Design a logo that represents a brand. Keep it simple, memorable, and scalable. Consider typography and iconography.",
        difficulty: "beginner" as const,
        dayNumber: 2,
        xpReward: 150,
        coinReward: 15,
        estimatedTime: 60,
        tags: ["logo", "branding", "design"],
      },
      {
        title: "Typography Poster",
        description: "Create a poster showcasing typography",
        instructions: "Design a poster that highlights typography. Experiment with different fonts, sizes, and layouts. Focus on readability and visual hierarchy.",
        difficulty: "intermediate" as const,
        dayNumber: 3,
        xpReward: 200,
        coinReward: 20,
        estimatedTime: 90,
        tags: ["typography", "poster", "layout"],
      },
    ],
  },
  // Web Development Path
  {
    skillPathName: "Web Development",
    challenges: [
      {
        title: "Build a Landing Page",
        description: "Create a simple landing page with HTML and CSS",
        instructions: "Build a landing page for a product or service. Include a hero section, features, and a call-to-action. Use modern CSS techniques.",
        difficulty: "beginner" as const,
        dayNumber: 1,
        xpReward: 150,
        coinReward: 15,
        estimatedTime: 120,
        tags: ["html", "css", "landing-page"],
      },
      {
        title: "Interactive Button Component",
        description: "Create an interactive button with hover effects",
        instructions: "Build a button component with smooth hover animations. Use CSS transitions or JavaScript. Make it visually appealing and accessible.",
        difficulty: "beginner" as const,
        dayNumber: 2,
        xpReward: 100,
        coinReward: 10,
        estimatedTime: 45,
        tags: ["css", "javascript", "component"],
      },
      {
        title: "Responsive Navigation Bar",
        description: "Design and code a responsive navigation bar",
        instructions: "Create a navigation bar that works on desktop and mobile. Include a hamburger menu for mobile. Use flexbox or grid for layout.",
        difficulty: "intermediate" as const,
        dayNumber: 3,
        xpReward: 200,
        coinReward: 20,
        estimatedTime: 90,
        tags: ["responsive", "navigation", "mobile"],
      },
    ],
  },
  // Writing Path
  {
    skillPathName: "Writing",
    challenges: [
      {
        title: "Write a Short Story",
        description: "Write a 500-word short story",
        instructions: "Write a complete short story with a beginning, middle, and end. Focus on character development and a clear narrative arc.",
        difficulty: "beginner" as const,
        dayNumber: 1,
        xpReward: 100,
        coinReward: 10,
        estimatedTime: 60,
        tags: ["fiction", "storytelling", "creative"],
      },
      {
        title: "Blog Post",
        description: "Write a 800-word blog post on a topic you're passionate about",
        instructions: "Write an engaging blog post with a clear introduction, body paragraphs, and conclusion. Include a compelling headline.",
        difficulty: "beginner" as const,
        dayNumber: 2,
        xpReward: 120,
        coinReward: 12,
        estimatedTime: 75,
        tags: ["blog", "content", "writing"],
      },
    ],
  },
];

/**
 * Seed challenges into the database
 * Make sure to run this after skill paths are created
 */
export const seedChallenges = async () => {
  try {
    for (const pathData of sampleChallenges) {
      // Find the skill path
      const skillPath = await SkillPath.findOne({ name: pathData.skillPathName }).exec();
      
      if (!skillPath) {
        console.log(`Skill path "${pathData.skillPathName}" not found. Skipping...`);
        continue;
      }

      // Create challenges for this path
      for (const challengeData of pathData.challenges) {
        // Check if challenge already exists
        const existing = await Challenge.findOne({
          skillPathId: skillPath._id,
          dayNumber: challengeData.dayNumber,
        }).exec();

        if (!existing) {
          await Challenge.create({
            ...challengeData,
            skillPathId: skillPath._id,
            isActive: true,
            aiGenerated: false,
          });
          console.log(`Created challenge: ${challengeData.title} (Day ${challengeData.dayNumber})`);
        } else {
          console.log(`Challenge already exists: ${challengeData.title} (Day ${challengeData.dayNumber})`);
        }
      }

      // Update skill path challenge count
      const count = await Challenge.countDocuments({
        skillPathId: skillPath._id,
        isActive: true,
      }).exec();
      
      skillPath.totalChallenges = count;
      await skillPath.save();
      console.log(`Updated ${pathData.skillPathName} with ${count} challenges`);
    }

    console.log("✅ Challenges seeded successfully!");
  } catch (error) {
    console.error("Error seeding challenges:", error);
    throw error;
  }
};


