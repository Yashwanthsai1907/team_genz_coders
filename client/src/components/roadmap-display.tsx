import { useState } from "react";
import { ChevronDown, ChevronUp, Check, Lock, ArrowRight, Download, Share, Play, BookOpen, GraduationCap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Roadmap, Milestone } from "@shared/schema";

interface RoadmapDisplayProps {
  roadmap: Roadmap;
  milestones: Milestone[];
  onToggleMilestone: (milestoneId: string) => void;
  onDownloadPDF: () => void;
}

export default function RoadmapDisplay({ 
  roadmap, 
  milestones, 
  onToggleMilestone, 
  onDownloadPDF 
}: RoadmapDisplayProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const togglePhase = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const phases = roadmap.phases as any[];
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.completed).length;
  
  const getPhaseStatus = (phaseId: string, phaseIndex: number) => {
    const phaseMilestones = milestones.filter(m => m.phaseId === phaseId);
    const completed = phaseMilestones.filter(m => m.completed).length;
    const total = phaseMilestones.length;
    
    if (completed === total) return "completed";
    if (completed > 0) return "in-progress";
    
    // Make the first incomplete phase automatically "in-progress"
    // Check if all previous phases are completed
    const allPreviousPhasesCompleted = phases
      .slice(0, phaseIndex)
      .every(prevPhase => {
        const prevPhaseMilestones = milestones.filter(m => m.phaseId === prevPhase.id);
        const prevCompleted = prevPhaseMilestones.filter(m => m.completed).length;
        return prevCompleted === prevPhaseMilestones.length && prevPhaseMilestones.length > 0;
      });
    
    if (allPreviousPhasesCompleted) return "in-progress";
    
    return "upcoming";
  };

  const getPhaseProgress = (phaseId: string) => {
    const phaseMilestones = milestones.filter(m => m.phaseId === phaseId);
    const completed = phaseMilestones.filter(m => m.completed).length;
    return phaseMilestones.length > 0 ? (completed / phaseMilestones.length) * 100 : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Roadmap Header */}
      <Card className="shadow-lg border border-border mb-8">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3" data-testid="badge-roadmap-generated">
                <Check size={14} />
                Roadmap Generated
              </Badge>
              
              <CardTitle className="text-3xl mb-2" data-testid="text-roadmap-title">
                {roadmap.title}
              </CardTitle>
              
              <CardDescription className="text-base mb-4" data-testid="text-roadmap-description">
                A comprehensive {roadmap.duration}-week journey for {roadmap.topic}
              </CardDescription>
              
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span data-testid="text-phase-count">{phases.length} Phases</span>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span data-testid="text-milestone-count">{totalMilestones} Milestones</span>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span data-testid="text-time-commitment">{roadmap.timePerWeek} hours/week</span>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span data-testid="text-total-duration">{roadmap.duration} weeks total</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={onDownloadPDF} 
                variant="secondary"
                data-testid="button-download-pdf"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
              <Button variant="outline" data-testid="button-share">
                <Share size={16} />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Overall Progress</span>
              <span className="text-sm font-semibold text-primary" data-testid="text-overall-progress">
                {Math.round((completedMilestones / totalMilestones) * 100)}%
              </span>
            </div>
            <Progress value={(completedMilestones / totalMilestones) * 100} className="h-3" />
            <p className="text-xs text-muted-foreground" data-testid="text-progress-summary">
              {completedMilestones} of {totalMilestones} milestones completed • Keep going!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Phases */}
      <div className="space-y-6">
        {phases.map((phase, phaseIndex) => {
          const phaseMilestones = milestones.filter(m => m.phaseId === phase.id);
          const phaseStatus = getPhaseStatus(phase.id, phaseIndex);
          const phaseProgress = getPhaseProgress(phase.id);
          const isExpanded = expandedPhases.has(phase.id);

          return (
            <Card 
              key={phase.id} 
              className={`shadow-lg border overflow-hidden ${
                phaseStatus === "in-progress" ? "border-primary" : "border-border"
              }`}
              data-testid={`card-phase-${phase.id}`}
            >
              <CardHeader 
                className={`cursor-pointer ${
                  phaseStatus === "completed" 
                    ? "bg-gradient-to-r from-success/10 to-success/5" 
                    : phaseStatus === "in-progress"
                    ? "bg-gradient-to-r from-primary/10 to-primary/5"
                    : "bg-muted/30"
                }`}
                onClick={() => togglePhase(phase.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      phaseStatus === "completed"
                        ? "bg-success text-success-foreground"
                        : phaseStatus === "in-progress"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {phaseStatus === "completed" ? (
                        <Check size={20} />
                      ) : phaseStatus === "in-progress" ? (
                        <ArrowRight size={20} />
                      ) : (
                        <Lock size={20} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl" data-testid={`text-phase-title-${phase.id}`}>
                          Phase {phaseIndex + 1}: {phase.title}
                        </CardTitle>
                        <Badge 
                          variant={
                            phaseStatus === "completed" 
                              ? "secondary" 
                              : phaseStatus === "in-progress"
                              ? "default"
                              : "outline"
                          }
                          data-testid={`badge-phase-status-${phase.id}`}
                        >
                          {phaseStatus === "completed" ? (
                            <>
                              <Check size={12} />
                              Completed
                            </>
                          ) : phaseStatus === "in-progress" ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                              In Progress
                            </>
                          ) : (
                            "Upcoming"
                          )}
                        </Badge>
                      </div>
                      
                      <CardDescription className="mb-3" data-testid={`text-phase-description-${phase.id}`}>
                        {phase.description}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" data-testid={`text-phase-weeks-${phase.id}`}>
                          {phase.weeks} weeks
                        </Badge>
                        <Badge variant="outline" data-testid={`text-phase-milestones-${phase.id}`}>
                          {phaseMilestones.length} milestones
                        </Badge>
                      </div>

                      {phaseStatus === "in-progress" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-semibold text-primary" data-testid={`text-phase-progress-${phase.id}`}>
                              {Math.round(phaseProgress)}%
                            </span>
                          </div>
                          <Progress value={phaseProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground" data-testid={`text-phase-progress-summary-${phase.id}`}>
                            {phaseMilestones.filter(m => m.completed).length} of {phaseMilestones.length} milestones completed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="p-6">
                  <div className="relative milestone-timeline pl-12 space-y-6">
                    {phaseMilestones.map((milestone, index) => {
                      // Check if this milestone should be unlocked
                      const allPreviousCompleted = phaseMilestones
                        .slice(0, index)
                        .every(m => m.completed);
                      const isUnlocked = phaseStatus === "in-progress" && allPreviousCompleted;
                      
                      return (
                      <div key={milestone.id} className="relative">
                        <div className={`absolute left-[-2.75rem] w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                          milestone.completed
                            ? "bg-success text-success-foreground"
                            : isUnlocked
                            ? "bg-primary text-primary-foreground animate-pulse"
                            : "bg-muted border-2 border-border"
                        }`}>
                          {milestone.completed ? (
                            <Check size={16} />
                          ) : isUnlocked ? (
                            <ArrowRight size={16} />
                          ) : (
                            <Lock className="text-muted-foreground" size={16} />
                          )}
                        </div>
                        
                        <div className={`rounded-lg p-4 border ${
                          milestone.completed
                            ? "bg-muted/50 border-border"
                            : isUnlocked
                            ? "bg-card border-primary shadow-md"
                            : "bg-muted/30 border-border opacity-60"
                        }`} data-testid={`card-milestone-${milestone.id}`}>
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <h5 className="font-semibold text-foreground mb-1" data-testid={`text-milestone-title-${milestone.id}`}>
                                {milestone.title}
                              </h5>
                              <p className="text-sm text-muted-foreground mb-3" data-testid={`text-milestone-description-${milestone.id}`}>
                                {milestone.description}
                              </p>
                              
                              {milestone.resources && Array.isArray(milestone.resources) && milestone.resources.length > 0 ? (
                                <div className="space-y-4">
                                  <Tabs defaultValue="videos" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                      <TabsTrigger value="videos" className="text-xs">
                                        <Play size={12} className="mr-1" />
                                        Videos
                                      </TabsTrigger>
                                      <TabsTrigger value="articles" className="text-xs">
                                        <BookOpen size={12} className="mr-1" />
                                        Articles
                                      </TabsTrigger>
                                      <TabsTrigger value="courses" className="text-xs">
                                        <GraduationCap size={12} className="mr-1" />
                                        Courses
                                      </TabsTrigger>
                                    </TabsList>
                                    
                                    {["videos", "articles", "courses"].map((type) => (
                                      <TabsContent key={type} value={type} className="space-y-3 mt-3">
                                        {(milestone.resources as any[])
                                          .filter(resource => 
                                            type === "videos" ? resource.type === "video" :
                                            type === "articles" ? resource.type === "article" :
                                            resource.type === "course"
                                          )
                                          .slice(0, 3)
                                          .map((resource: any, resourceIndex: number) => (
                                            <div
                                              key={resourceIndex}
                                              className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer card-hover"
                                              onClick={() => window.open(resource.url, '_blank')}
                                              data-testid={`resource-${resource.type}-${resourceIndex}`}
                                            >
                                              <div className="w-16 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded flex items-center justify-center flex-shrink-0">
                                                {resource.type === "video" ? (
                                                  <Play size={16} className="text-primary" />
                                                ) : resource.type === "article" ? (
                                                  <BookOpen size={16} className="text-secondary" />
                                                ) : (
                                                  <GraduationCap size={16} className="text-accent" />
                                                )}
                                              </div>
                                              
                                              <div className="flex-1 min-w-0">
                                                <h6 className="font-medium text-foreground text-sm truncate mb-1" data-testid={`text-resource-title-${resourceIndex}`}>
                                                  {resource.title}
                                                </h6>
                                                <p className="text-xs text-muted-foreground mb-2" data-testid={`text-resource-source-${resourceIndex}`}>
                                                  {resource.source} • {resource.duration || resource.readTime || "Course"}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                  <Badge 
                                                    variant={
                                                      resource.type === "video" ? "destructive" :
                                                      resource.type === "article" ? "default" :
                                                      "secondary"
                                                    }
                                                    className="text-xs"
                                                  >
                                                    {resource.type === "video" ? (resource.source.includes("Search") ? resource.source : "YouTube") :
                                                     resource.type === "article" ? "Article" :
                                                     "Course"}
                                                  </Badge>
                                                  <Badge variant="outline" className="text-xs">
                                                    {resource.level}
                                                  </Badge>
                                                  <ExternalLink size={12} className="text-muted-foreground ml-auto" />
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                      </TabsContent>
                                    ))}
                                  </Tabs>
                                </div>
                              ) : null}
                            </div>
                            
                            <Checkbox
                              checked={milestone.completed}
                              onCheckedChange={() => onToggleMilestone(milestone.id)}
                              disabled={!isUnlocked && !milestone.completed}
                              className="mt-1"
                              data-testid={`checkbox-milestone-${milestone.id}`}
                            />
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
