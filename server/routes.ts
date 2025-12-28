import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { roadmapFormSchema } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ==================== AUTH ROUTES ====================
  
  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Create user (no hashing for simple side project)
      const user = await storage.createUser({ username, password });
      
      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Login attempt for:", username);
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      console.log("User found:", user ? "yes" : "no");
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  
  // Get current user
  app.get("/api/auth/me", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    res.json({ 
      user: { 
        id: req.session.userId, 
        username: req.session.username 
      } 
    });
  });
  
  // ==================== ROADMAP ROUTES ====================
  
  // Generate roadmap with Gemini API
  app.post("/api/roadmaps/generate", requireAuth, async (req, res) => {
    try {
      const formData = roadmapFormSchema.parse(req.body);
      
      const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
      
      const prompt = `Create a detailed learning roadmap for the following requirements:
      
Topic: ${formData.topic}
Learning Goal: ${formData.goal}
Skill Level: ${formData.skillLevel}
Time per Week: ${formData.timePerWeek} hours
Duration: ${formData.duration} weeks
Learning Style: ${formData.learningStyle.join(", ")}
Additional Details: ${formData.details || "None"}

Please create a structured learning roadmap with the following format:
1. Generate 4-10 learning phases, each with a clear title and description
2. For each phase, create 3-8 specific milestones
3. For each milestone, provide curated resources including:
   - YouTube videos with search-optimized titles
   - Articles and tutorials from real educational websites
   - Online courses from known platforms
   - Project ideas to apply the learning

Return the response as a JSON object with this structure:
{
  "title": "Learning Path Title",
  "description": "Brief overview of the roadmap",
  "totalWeeks": ${formData.duration},
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase Title",
      "description": "Phase description",
      "weeks": 3,
      "milestones": [
        {
          "title": "Milestone Title",
          "description": "What the student will learn",
          "resources": [
            {
              "type": "video",
              "title": "Descriptive Video Title with Keywords",
              "url": "YOUTUBE_SEARCH:specific searchable video title and topic keywords for ${formData.skillLevel} level",
              "source": "YouTube",
              "duration": "45 min",
              "level": "beginner"
            },
            {
              "type": "article",
              "title": "Article Title",
              "url": "https://developer.mozilla.org/example",
              "source": "Website Name",
              "readTime": "10 min",
              "level": "beginner"
            },
            {
              "type": "course",
              "title": "Course Title",
              "url": "https://www.coursera.org/learn/example",
              "source": "Platform Name",
              "duration": "4 weeks",
              "level": "beginner"
            }
          ]
        }
      ]
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "Project description",
      "phase": "phase-1",
      "skills": ["skill1", "skill2"],
      "difficulty": "beginner"
    }
  ]
}

CRITICAL INSTRUCTIONS FOR VIDEO RESOURCES:
- For ALL video type resources, set the url field to: "YOUTUBE_SEARCH:detailed searchable query"
- The search query should include: topic name, specific concept, tutorial/guide keywords, and ${formData.skillLevel} level
- Example: "YOUTUBE_SEARCH:React hooks tutorial complete guide beginner 2024"
- Make search queries specific and likely to find high-quality educational content
- Use popular creator names if relevant (e.g., "traversy media", "freecodecamp", "net ninja")

FOR ARTICLES AND COURSES:
- Use real, well-known educational website domains (MDN, W3Schools, freeCodeCamp, Official Docs, etc.)
- For courses, use real platform URLs (Coursera, Udemy, edX, Pluralsight, etc.)
- Generic placeholder format: https://www.platformname.com/topic or https://docs.officialsite.com/topic

IMPORTANT: 
- Make sure all resources are relevant and high-quality for the ${formData.skillLevel} level
- Return ONLY valid JSON, no markdown formatting, no code blocks
- DO NOT include trailing commas in arrays or objects
- Ensure all strings are properly quoted and escaped
- Make sure all brackets and braces are properly closed`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response from Gemini with improved error handling
      let cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      // Remove any trailing commas before closing brackets/braces
      cleanedText = cleanedText
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
        .replace(/\n/g, ' ')             // Replace newlines with spaces
        .replace(/\s+/g, ' ');           // Normalize whitespace
      
      let roadmapData;
      try {
        roadmapData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Problematic JSON (first 500 chars):", cleanedText.substring(0, 500));
        console.error("Problematic JSON (last 500 chars):", cleanedText.substring(cleanedText.length - 500));
        throw new Error("Failed to parse AI response. Please try again.");
      }
      
      // Process YouTube search URLs - convert YOUTUBE_SEARCH: prefix to actual search URLs
      for (const phase of roadmapData.phases) {
        for (const milestone of phase.milestones) {
          for (const resource of milestone.resources) {
            if (resource.type === "video" && resource.url.startsWith("YOUTUBE_SEARCH:")) {
              // Extract the search query after "YOUTUBE_SEARCH:"
              const searchQuery = resource.url.replace("YOUTUBE_SEARCH:", "").trim();
              // Create a YouTube search URL
              resource.url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
              // Update source to indicate it's a search
              if (resource.source === "YouTube") {
                resource.source = "YouTube Search";
              }
            }
          }
        }
      }
      
      // Store the roadmap
      const userId = req.session.userId!;
      
      const roadmap = await storage.createRoadmap({
        userId,
        title: roadmapData.title,
        topic: formData.topic,
        goal: formData.goal,
        skillLevel: formData.skillLevel,
        timePerWeek: formData.timePerWeek,
        duration: formData.duration,
        learningStyle: formData.learningStyle.join(","),
        details: formData.details,
        phases: roadmapData.phases,
      });

      // Create milestones for each phase
      let milestoneOrder = 1;
      for (const phase of roadmapData.phases) {
        for (const milestone of phase.milestones) {
          await storage.createMilestone({
            roadmapId: roadmap.id,
            phaseId: phase.id,
            title: milestone.title,
            description: milestone.description,
            order: milestoneOrder++,
            resources: milestone.resources,
          });
        }
      }

      // Create user progress tracking
      await storage.createUserProgress({
        userId,
        roadmapId: roadmap.id,
        totalHours: 0,
        streak: 0,
        lastActivity: new Date(),
      });

      res.json({ 
        success: true, 
        roadmap: roadmap,
        generatedData: roadmapData 
      });
    } catch (error) {
      console.error("Error generating roadmap:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to generate roadmap. Please try again." 
      });
    }
  });

  // Get all roadmaps for user
  app.get("/api/roadmaps", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const roadmaps = await storage.getRoadmapsByUserId(userId);
      res.json(roadmaps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch roadmaps" });
    }
  });

  // Get specific roadmap with milestones
  app.get("/api/roadmaps/:id", requireAuth, async (req, res) => {
    try {
      const roadmap = await storage.getRoadmap(req.params.id);
      if (!roadmap) {
        return res.status(404).json({ error: "Roadmap not found" });
      }

      const milestones = await storage.getMilestonesByRoadmapId(req.params.id);
      const userId = req.session.userId!;
      const progress = await storage.getUserProgress(userId, req.params.id);

      res.json({
        roadmap,
        milestones,
        progress,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch roadmap" });
    }
  });

  // Toggle milestone completion
  app.patch("/api/milestones/:id/toggle", requireAuth, async (req, res) => {
    try {
      const milestone = await storage.toggleMilestoneCompletion(req.params.id);
      if (!milestone) {
        return res.status(404).json({ error: "Milestone not found" });
      }

      // Update roadmap progress
      const allMilestones = await storage.getMilestonesByRoadmapId(milestone.roadmapId);
      const completedCount = allMilestones.filter(m => m.completed).length;
      const progressPercentage = Math.round((completedCount / allMilestones.length) * 100);

      await storage.updateRoadmap(milestone.roadmapId, {
        progress: progressPercentage,
      });

      res.json({ success: true, milestone });
    } catch (error) {
      res.status(500).json({ error: "Failed to update milestone" });
    }
  });

  // Get user statistics
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const roadmaps = await storage.getRoadmapsByUserId(userId);
      
      let totalMilestones = 0;
      let completedMilestones = 0;
      let totalHours = 0;
      let completedProjects = 0;

      for (const roadmap of roadmaps) {
        const milestones = await storage.getMilestonesByRoadmapId(roadmap.id);
        totalMilestones += milestones.length;
        completedMilestones += milestones.filter(m => m.completed).length;
        
        const progress = await storage.getUserProgress(userId, roadmap.id);
        if (progress) {
          totalHours += progress.totalHours;
        }
      }

      // Calculate completed projects (assuming 1 project per completed phase)
      completedProjects = Math.floor(completedMilestones / 4); // Rough estimate

      res.json({
        streak: 12, // Mock streak for now
        completedMilestones,
        totalMilestones,
        totalHours,
        completedProjects,
        totalRoadmaps: roadmaps.length,
        activeRoadmaps: roadmaps.filter(r => r.status === "active").length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
