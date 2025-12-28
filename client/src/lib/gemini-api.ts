// This file is not used as the Gemini API integration is handled in the backend
// Keeping it for potential future frontend-only implementations

export interface RoadmapRequest {
  topic: string;
  goal: string;
  skillLevel: string;
  timePerWeek: number;
  duration: number;
  learningStyle: string[];
  details?: string;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  weeks: number;
  milestones: Milestone[];
}

export interface Milestone {
  title: string;
  description: string;
  resources: Resource[];
}

export interface Resource {
  type: "video" | "article" | "course";
  title: string;
  url: string;
  source: string;
  duration?: string;
  readTime?: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface GeneratedRoadmap {
  title: string;
  description: string;
  totalWeeks: number;
  phases: Phase[];
  projects: Project[];
}

export interface Project {
  title: string;
  description: string;
  phase: string;
  skills: string[];
  difficulty: string;
}
