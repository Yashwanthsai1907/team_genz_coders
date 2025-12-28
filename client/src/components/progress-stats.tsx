import { Flame, CheckCircle, Clock, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressStatsProps {
  stats: {
    streak: number;
    completedMilestones: number;
    totalMilestones: number;
    totalHours: number;
    completedProjects: number;
  };
}

export default function ProgressStats({ stats }: ProgressStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="card-hover" data-testid="card-streak">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flame className="text-primary" size={20} />
            </div>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1" data-testid="text-streak">
            {stats.streak}
          </div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </CardContent>
      </Card>

      <Card className="card-hover" data-testid="card-milestones">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <CheckCircle className="text-secondary" size={20} />
            </div>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1" data-testid="text-milestones">
            {stats.completedMilestones}/{stats.totalMilestones}
          </div>
          <div className="text-sm text-muted-foreground">Milestones Completed</div>
        </CardContent>
      </Card>

      <Card className="card-hover" data-testid="card-hours">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="text-accent" size={20} />
            </div>
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1" data-testid="text-hours">
            {stats.totalHours}
          </div>
          <div className="text-sm text-muted-foreground">Hours Learned</div>
        </CardContent>
      </Card>

      <Card className="card-hover" data-testid="card-projects">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="text-primary" size={20} />
            </div>
            <span className="text-2xl">🏆</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1" data-testid="text-projects">
            {stats.completedProjects}
          </div>
          <div className="text-sm text-muted-foreground">Projects Built</div>
        </CardContent>
      </Card>
    </div>
  );
}
