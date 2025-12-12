/**
 * Seed Script for Creating Sample Skill Paths
 * Run this to create initial skill paths in the database
 */

import SkillPath from "@/models/skillPath.model";

const sampleSkillPaths = [
  {
    name: "Graphic Design",
    description: "Master the art of visual communication through design principles, color theory, and creative software.",
    icon: "🎨",
    color: "#FF6B6B",
    difficulty: "beginner" as const,
    estimatedDuration: 30,
    order: 1,
  },
  {
    name: "Web Development",
    description: "Build modern, responsive websites and web applications using HTML, CSS, JavaScript, and frameworks.",
    icon: "💻",
    color: "#4ECDC4",
    difficulty: "beginner" as const,
    estimatedDuration: 60,
    order: 2,
  },
  {
    name: "UI/UX Design",
    description: "Create intuitive and beautiful user interfaces and experiences for digital products.",
    icon: "✨",
    color: "#95E1D3",
    difficulty: "intermediate" as const,
    estimatedDuration: 45,
    order: 3,
  },
  {
    name: "Writing",
    description: "Develop your writing skills through creative writing, blogging, and content creation.",
    icon: "✍️",
    color: "#F38181",
    difficulty: "beginner" as const,
    estimatedDuration: 30,
    order: 4,
  },
  {
    name: "Photography",
    description: "Learn composition, lighting, and editing techniques to capture stunning photographs.",
    icon: "📸",
    color: "#AA96DA",
    difficulty: "beginner" as const,
    estimatedDuration: 30,
    order: 5,
  },
  {
    name: "Animation",
    description: "Bring your ideas to life through 2D and 3D animation techniques and principles.",
    icon: "🎬",
    color: "#FCBAD3",
    difficulty: "intermediate" as const,
    estimatedDuration: 45,
    order: 6,
  },
];

/**
 * Seed skill paths into the database
 */
export const seedSkillPaths = async () => {
  try {
    for (const pathData of sampleSkillPaths) {
      const existing = await SkillPath.findOne({ name: pathData.name }).exec();
      
      if (!existing) {
        await SkillPath.create({
          ...pathData,
          isActive: true,
          totalChallenges: 0, // Will be updated when challenges are added
        });
        console.log(`✅ Created skill path: ${pathData.name}`);
      } else {
        console.log(`⏭️  Skill path already exists: ${pathData.name}`);
      }
    }

    console.log("✅ Skill paths seeded successfully!");
  } catch (error) {
    console.error("Error seeding skill paths:", error);
    throw error;
  }
};

