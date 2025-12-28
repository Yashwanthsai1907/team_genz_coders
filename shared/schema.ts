import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const roadmaps = sqliteTable("roadmaps", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  topic: text("topic").notNull(),
  goal: text("goal").notNull(),
  skillLevel: text("skill_level").notNull(),
  timePerWeek: integer("time_per_week").notNull(),
  duration: integer("duration").notNull(),
  learningStyle: text("learning_style").notNull(),
  details: text("details"),
  phases: text("phases", { mode: "json" }).notNull(),
  status: text("status").notNull().default("active"), // active, paused, completed
  progress: integer("progress").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const milestones = sqliteTable("milestones", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  roadmapId: text("roadmap_id").notNull().references(() => roadmaps.id),
  phaseId: text("phase_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  resources: text("resources", { mode: "json" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

export const userProgress = sqliteTable("user_progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  roadmapId: text("roadmap_id").notNull().references(() => roadmaps.id),
  totalHours: integer("total_hours").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastActivity: integer("last_activity", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({
  id: true,
  userId: true,
  status: true,
  progress: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  completed: true,
  completedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

// Form schemas for frontend validation
export const roadmapFormSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  goal: z.enum(["project-building", "exam-preparation", "concept-mastery"]),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  timePerWeek: z.number().min(1).max(40),
  duration: z.number().min(1).max(52),
  learningStyle: z.array(z.string()).min(1),
  details: z.string().optional(),
});

export type RoadmapFormData = z.infer<typeof roadmapFormSchema>;
