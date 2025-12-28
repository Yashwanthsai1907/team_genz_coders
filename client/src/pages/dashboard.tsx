import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Award } from "lucide-react";
import Header from "@/components/header";
import ProgressStats from "@/components/progress-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const achievements = [
  {
    id: "first-milestone",
    title: "First Milestone",
    description: "Completed your first task",
    emoji: "🎯",
    unlocked: true,
  },
  {
    id: "bookworm",
    title: "Bookworm", 
    description: "Read 10 articles",
    emoji: "📚",
    unlocked: true,
  },
  {
    id: "code-master",
    title: "Code Master",
    description: "Built 3 projects", 
    emoji: "💻",
    unlocked: true,
  },
  {
    id: "phase-complete",
    title: "Phase Complete",
    description: "Complete Phase 2",
    emoji: "🔒",
    unlocked: false,
  },
];

interface StatsResponse {
  streak: number;
  completedMilestones: number;
  totalMilestones: number;
  totalHours: number;
  completedProjects: number;
  totalRoadmaps: number;
  activeRoadmaps: number;
}

export default function Dashboard() {
  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-dashboard-title">
              Learning Dashboard
            </h1>
            <p className="text-muted-foreground">Track your progress and achievements</p>
          </div>
          <Link href="/create">
            <Button data-testid="button-new-roadmap">
              <Plus size={16} />
              New Roadmap
            </Button>
          </Link>
        </div>

        {stats && (
          <div className="mb-12">
            <ProgressStats stats={stats} />
          </div>
        )}

        {/* Achievement Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-achievements-title">
              <Award className="text-secondary" size={20} />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex flex-col items-center text-center p-4 rounded-lg border ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
                      : "bg-muted/50 border-border opacity-50"
                  }`}
                  data-testid={`achievement-${achievement.id}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-primary to-secondary"
                      : "bg-muted"
                  }`}>
                    {achievement.emoji}
                  </div>
                  <div className="font-semibold text-sm text-foreground mb-1" data-testid={`text-achievement-title-${achievement.id}`}>
                    {achievement.title}
                  </div>
                  <div className="text-xs text-muted-foreground" data-testid={`text-achievement-description-${achievement.id}`}>
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
