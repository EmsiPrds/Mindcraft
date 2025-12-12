# Seed Data Setup Guide

This guide explains how to set up the initial data (skill paths and challenges) for MindCraft to work properly.

## Quick Start

After starting your backend server, you can seed the database using the admin endpoints:

### 1. Seed Skill Paths
```bash
POST http://localhost:3000/api/admin/seed/skill-paths
```

This creates 6 skill paths:
- Graphic Design
- Web Development
- UI/UX Design
- Writing
- Photography
- Animation

### 2. Seed Challenges
```bash
POST http://localhost:3000/api/admin/seed/challenges
```

This creates sample challenges for each skill path (3 challenges per path).

### 3. Seed Everything at Once
```bash
POST http://localhost:3000/api/admin/seed/all
```

This runs both seed operations in sequence.

## How Daily Challenges Work

### For Users with a Selected Skill Path:
1. The system finds the next challenge in their selected skill path based on their progress
2. Users can complete multiple challenges per day, but each challenge only once per day
3. After completing a challenge, they automatically get the next one in the sequence
4. Progress is tracked per skill path (not globally)

### For Users without a Selected Skill Path:
1. The system provides a random challenge from all available challenges
2. It tries to avoid challenges the user has done in the last 7 days
3. Users should select a skill path for a more structured learning experience

### Daily Reset Logic:
- Each challenge can only be completed once per day
- The "day" resets at midnight (00:00:00) in the server's timezone
- Users can complete multiple different challenges in one day
- After completing a challenge, they can immediately access the next one

## Testing the Daily Challenge System

1. **Create a user account** via registration
2. **Select a skill path** (e.g., "Graphic Design")
3. **View dashboard** - you should see "Day 1" challenge
4. **Complete the challenge** - submit your work
5. **Return to dashboard** - you should now see "Day 2" challenge
6. **Complete Day 2** - you'll get Day 3, and so on

## Creating Custom Challenges

You can create challenges via the admin API:

```bash
POST /api/challenges
{
  "title": "Your Challenge Title",
  "description": "Brief description",
  "instructions": "Detailed instructions for the challenge",
  "skillPathId": "skill_path_id_here",
  "difficulty": "beginner", // or "intermediate" or "advanced"
  "dayNumber": 1,
  "xpReward": 100,
  "coinReward": 10,
  "estimatedTime": 30, // minutes
  "tags": ["tag1", "tag2"],
  "isActive": true
}
```

## Notes

- Challenges are assigned based on `dayNumber` in the skill path
- Users progress through challenges sequentially (Day 1, Day 2, Day 3...)
- The system prevents duplicate submissions of the same challenge on the same day
- Users can switch skill paths at any time, and their progress is saved per path

