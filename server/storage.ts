import { 
  type User, 
  type InsertUser, 
  type Roadmap, 
  type InsertRoadmap,
  type Milestone,
  type InsertMilestone,
  type UserProgress,
  type InsertUserProgress
} from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq, and } from "drizzle-orm";
import { users, roadmaps, milestones, userProgress } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Roadmap methods
  getRoadmap(id: string): Promise<Roadmap | undefined>;
  getRoadmapsByUserId(userId: string): Promise<Roadmap[]>;
  createRoadmap(roadmap: InsertRoadmap & { userId: string }): Promise<Roadmap>;
  updateRoadmap(id: string, updates: Partial<Roadmap>): Promise<Roadmap | undefined>;
  deleteRoadmap(id: string): Promise<boolean>;

  // Milestone methods
  getMilestonesByRoadmapId(roadmapId: string): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone | undefined>;
  toggleMilestoneCompletion(id: string): Promise<Milestone | undefined>;

  // User progress methods
  getUserProgress(userId: string, roadmapId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: string, roadmapId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private roadmaps: Map<string, Roadmap>;
  private milestones: Map<string, Milestone>;
  private userProgress: Map<string, UserProgress>;
  private dataFile: string;

  constructor() {
    this.dataFile = join(process.cwd(), "data.json");
    this.users = new Map();
    this.roadmaps = new Map();
    this.milestones = new Map();
    this.userProgress = new Map();
    this.loadData();
  }

  private loadData() {
    try {
      if (existsSync(this.dataFile)) {
        const data = JSON.parse(readFileSync(this.dataFile, "utf-8"));
        
        // Load users
        if (data.users) {
          Object.entries(data.users).forEach(([id, user]) => {
            this.users.set(id, user as User);
          });
        }
        
        // Load roadmaps
        if (data.roadmaps) {
          Object.entries(data.roadmaps).forEach(([id, roadmap]: [string, any]) => {
            this.roadmaps.set(id, {
              ...roadmap,
              createdAt: new Date(roadmap.createdAt),
              updatedAt: new Date(roadmap.updatedAt),
            });
          });
        }
        
        // Load milestones
        if (data.milestones) {
          Object.entries(data.milestones).forEach(([id, milestone]: [string, any]) => {
            this.milestones.set(id, {
              ...milestone,
              completedAt: milestone.completedAt ? new Date(milestone.completedAt) : null,
            });
          });
        }
        
        // Load user progress
        if (data.userProgress) {
          Object.entries(data.userProgress).forEach(([key, progress]: [string, any]) => {
            this.userProgress.set(key, {
              ...progress,
              lastActivity: new Date(progress.lastActivity),
            });
          });
        }
        
        console.log(`Loaded data: ${this.roadmaps.size} roadmaps, ${this.milestones.size} milestones`);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  private saveData() {
    try {
      const data = {
        users: Object.fromEntries(this.users),
        roadmaps: Object.fromEntries(this.roadmaps),
        milestones: Object.fromEntries(this.milestones),
        userProgress: Object.fromEntries(this.userProgress),
      };
      writeFileSync(this.dataFile, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.saveData();
    return user;
  }

  async getRoadmap(id: string): Promise<Roadmap | undefined> {
    return this.roadmaps.get(id);
  }

  async getRoadmapsByUserId(userId: string): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values()).filter(
      (roadmap) => roadmap.userId === userId
    );
  }

  async createRoadmap(roadmapData: InsertRoadmap & { userId: string }): Promise<Roadmap> {
    const id = randomUUID();
    const roadmap: Roadmap = {
      ...roadmapData,
      id,
      details: roadmapData.details ?? null,
      status: "active",
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.roadmaps.set(id, roadmap);
    this.saveData();
    return roadmap;
  }

  async updateRoadmap(id: string, updates: Partial<Roadmap>): Promise<Roadmap | undefined> {
    const roadmap = this.roadmaps.get(id);
    if (!roadmap) return undefined;

    const updatedRoadmap = {
      ...roadmap,
      ...updates,
      updatedAt: new Date(),
    };
    this.roadmaps.set(id, updatedRoadmap);
    this.saveData();
    return updatedRoadmap;
  }

  async deleteRoadmap(id: string): Promise<boolean> {
    const deleted = this.roadmaps.delete(id);
    if (deleted) this.saveData();
    return deleted;
  }

  async getMilestonesByRoadmapId(roadmapId: string): Promise<Milestone[]> {
    return Array.from(this.milestones.values()).filter(
      (milestone) => milestone.roadmapId === roadmapId
    ).sort((a, b) => a.order - b.order);
  }

  async createMilestone(milestoneData: InsertMilestone): Promise<Milestone> {
    const id = randomUUID();
    const milestone: Milestone = {
      ...milestoneData,
      id,
      completed: false,
      completedAt: null,
    };
    this.milestones.set(id, milestone);
    this.saveData();
    return milestone;
  }

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone | undefined> {
    const milestone = this.milestones.get(id);
    if (!milestone) return undefined;

    const updatedMilestone = { ...milestone, ...updates };
    this.milestones.set(id, updatedMilestone);
    this.saveData();
    return updatedMilestone;
  }

  async toggleMilestoneCompletion(id: string): Promise<Milestone | undefined> {
    const milestone = this.milestones.get(id);
    if (!milestone) return undefined;

    const updatedMilestone = {
      ...milestone,
      completed: !milestone.completed,
      completedAt: !milestone.completed ? new Date() : null,
    };
    this.milestones.set(id, updatedMilestone);
    this.saveData();
    return updatedMilestone;
  }

  async getUserProgress(userId: string, roadmapId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      (progress) => progress.userId === userId && progress.roadmapId === roadmapId
    );
  }

  async createUserProgress(progressData: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = {
      id,
      userId: progressData.userId,
      roadmapId: progressData.roadmapId,
      totalHours: progressData.totalHours ?? 0,
      streak: progressData.streak ?? 0,
      lastActivity: progressData.lastActivity ?? new Date(),
    };
    const key = `${progressData.userId}-${progressData.roadmapId}`;
    this.userProgress.set(key, progress);
    this.saveData();
    return progress;
  }

  async updateUserProgress(userId: string, roadmapId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const key = `${userId}-${roadmapId}`;
    const progress = this.userProgress.get(key);
    if (!progress) return undefined;

    const updatedProgress = { ...progress, ...updates };
    this.userProgress.set(key, updatedProgress);
    this.saveData();
    return updatedProgress;
  }
}

// SQLite Storage Implementation
export class SQLiteStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(dbPath: string = "./sqlite.db") {
    const sqlite = new Database(dbPath);
    this.db = drizzle(sqlite);
    console.log("SQLite database connected");
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  // Roadmap methods
  async getRoadmap(id: string): Promise<Roadmap | undefined> {
    const result = await this.db.select().from(roadmaps).where(eq(roadmaps.id, id)).limit(1);
    return result[0];
  }

  async getRoadmapsByUserId(userId: string): Promise<Roadmap[]> {
    return await this.db.select().from(roadmaps).where(eq(roadmaps.userId, userId));
  }

  async createRoadmap(roadmap: InsertRoadmap & { userId: string }): Promise<Roadmap> {
    const result = await this.db.insert(roadmaps).values({
      ...roadmap,
      details: roadmap.details ?? null,
      status: "active",
      progress: 0,
    }).returning();
    return result[0];
  }

  async updateRoadmap(id: string, updates: Partial<Roadmap>): Promise<Roadmap | undefined> {
    const result = await this.db
      .update(roadmaps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(roadmaps.id, id))
      .returning();
    return result[0];
  }

  async deleteRoadmap(id: string): Promise<boolean> {
    const result = await this.db.delete(roadmaps).where(eq(roadmaps.id, id)).returning();
    return result.length > 0;
  }

  // Milestone methods
  async getMilestonesByRoadmapId(roadmapId: string): Promise<Milestone[]> {
    return await this.db
      .select()
      .from(milestones)
      .where(eq(milestones.roadmapId, roadmapId))
      .orderBy(milestones.order);
  }

  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const result = await this.db.insert(milestones).values({
      ...milestone,
      completed: false,
      completedAt: null,
    }).returning();
    return result[0];
  }

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone | undefined> {
    const result = await this.db
      .update(milestones)
      .set(updates)
      .where(eq(milestones.id, id))
      .returning();
    return result[0];
  }

  async toggleMilestoneCompletion(id: string): Promise<Milestone | undefined> {
    const existing = await this.db.select().from(milestones).where(eq(milestones.id, id)).limit(1);
    if (!existing[0]) return undefined;

    const result = await this.db
      .update(milestones)
      .set({
        completed: !existing[0].completed,
        completedAt: !existing[0].completed ? new Date() : null,
      })
      .where(eq(milestones.id, id))
      .returning();
    return result[0];
  }

  // User progress methods
  async getUserProgress(userId: string, roadmapId: string): Promise<UserProgress | undefined> {
    const result = await this.db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.roadmapId, roadmapId)))
      .limit(1);
    return result[0];
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const result = await this.db.insert(userProgress).values({
      ...progress,
      totalHours: progress.totalHours ?? 0,
      streak: progress.streak ?? 0,
    }).returning();
    return result[0];
  }

  async updateUserProgress(userId: string, roadmapId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const result = await this.db
      .update(userProgress)
      .set(updates)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.roadmapId, roadmapId)))
      .returning();
    return result[0];
  }
}

// Use SQLite storage by default
export const storage = new SQLiteStorage();
