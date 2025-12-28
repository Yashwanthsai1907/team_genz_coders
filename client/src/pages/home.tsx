import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, ArrowRight, Calendar, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import ProgressStats from "@/components/progress-stats";
import type { Roadmap } from "@shared/schema";

export default function Home() {
  const { data: roadmaps, isLoading } = useQuery<Roadmap[]>({
    queryKey: ["/api/roadmaps"],
  });

  interface StatsResponse {
    streak: number;
    completedMilestones: number;
    totalMilestones: number;
    totalHours: number;
    completedProjects: number;
    totalRoadmaps: number;
    activeRoadmaps: number;
  }

  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ["/api/stats"],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Progress Dashboard Section */}
      {stats && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="text-progress-title">
                Your Learning Progress
              </h3>
              <p className="text-muted-foreground">Track your achievements and stay motivated</p>
            </div>
            <ProgressStats stats={stats} />
          </div>
        </section>
      )}

      {/* My Roadmaps Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="text-roadmaps-title">
                My Learning Roadmaps
              </h3>
              <p className="text-muted-foreground">All your personalized learning paths in one place</p>
            </div>
            <Link href="/create">
              <Button className="px-6 py-3 font-semibold" data-testid="button-new-roadmap">
                <Plus size={16} />
                New Roadmap
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-muted rounded-t-xl" />
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                      <div className="h-2 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !roadmaps || roadmaps.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <BarChart className="text-muted-foreground" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2" data-testid="text-no-roadmaps">
                  No roadmaps yet
                </h4>
                <p className="text-muted-foreground mb-6">
                  Create your first AI-powered learning roadmap to get started
                </p>
                <Link href="/create">
                  <Button data-testid="button-create-first">
                    <Plus size={16} />
                    Create Your First Roadmap
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.map((roadmap) => (
                <Card 
                  key={roadmap.id} 
                  className={`overflow-hidden card-hover cursor-pointer ${
                    roadmap.status === "active" ? "border-primary shadow-lg" : ""
                  }`}
                  data-testid={`card-roadmap-${roadmap.id}`}
                >
                  <Link href={`/roadmap/${roadmap.id}`}>
                    <a>
                      <div className={`h-40 relative overflow-hidden ${
                        roadmap.status === "active" 
                          ? "gradient-bg" 
                          : roadmap.status === "completed"
                          ? "bg-gradient-to-br from-success to-accent"
                          : "bg-gradient-to-br from-secondary to-primary opacity-75"
                      }`}>
                        <div className="absolute top-4 right-4">
                          <Badge 
                            variant={
                              roadmap.status === "active" ? "default" :
                              roadmap.status === "completed" ? "secondary" :
                              "outline"
                            }
                            className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                            data-testid={`badge-status-${roadmap.id}`}
                          >
                            {roadmap.status === "active" && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />}
                            {roadmap.status.charAt(0).toUpperCase() + roadmap.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="text-xl font-bold text-white mb-1" data-testid={`text-roadmap-title-${roadmap.id}`}>
                            {roadmap.title}
                          </h4>
                          <p className="text-sm text-white/80" data-testid={`text-roadmap-meta-${roadmap.id}`}>
                            {roadmap.duration} weeks • {roadmap.timePerWeek}h/week
                          </p>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-semibold text-foreground">Progress</span>
                          <span 
                            className={`text-sm font-semibold ${
                              roadmap.status === "completed" ? "text-success" : "text-primary"
                            }`}
                            data-testid={`text-progress-${roadmap.id}`}
                          >
                            {roadmap.progress}%
                          </span>
                        </div>
                        
                        <Progress 
                          value={roadmap.progress} 
                          className={`h-2 mb-4 ${
                            roadmap.status === "completed" ? "[&>div]:bg-success" : ""
                          }`}
                        />
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar size={12} />
                            <span data-testid={`text-last-updated-${roadmap.id}`}>
                              {roadmap.updatedAt ? formatDate(roadmap.updatedAt) : "Just created"}
                            </span>
                          </div>
                          <ArrowRight 
                            className={`${
                              roadmap.status === "completed" ? "text-success" : "text-primary"
                            } hover:translate-x-1 transition-transform`} 
                            size={16}
                          />
                        </div>
                      </CardContent>
                    </a>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
