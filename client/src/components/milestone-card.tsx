import { useState } from "react";
import { Check, Lock, ArrowRight, Play, BookOpen, GraduationCap, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { Milestone } from "@shared/schema";

interface MilestoneCardProps {
  milestone: Milestone;
  isActive: boolean;
  isUpcoming: boolean;
  onToggle: (milestoneId: string) => void;
}

export default function MilestoneCard({ 
  milestone, 
  isActive, 
  isUpcoming, 
  onToggle 
}: MilestoneCardProps) {
  const [activeTab, setActiveTab] = useState("videos");

  const resources = milestone.resources as any[] || [];
  const videoResources = resources.filter(r => r.type === "video");
  const articleResources = resources.filter(r => r.type === "article");
  const courseResources = resources.filter(r => r.type === "course");

  const getStatusIcon = () => {
    if (milestone.completed) {
      return <Check size={16} className="text-success-foreground" />;
    }
    if (isActive) {
      return <ArrowRight size={16} className="text-primary-foreground" />;
    }
    return <Lock size={16} className="text-muted-foreground" />;
  };

  const getStatusStyle = () => {
    if (milestone.completed) {
      return "bg-success text-success-foreground";
    }
    if (isActive) {
      return "bg-primary text-primary-foreground animate-pulse";
    }
    return "bg-muted border-2 border-border";
  };

  const getCardStyle = () => {
    if (milestone.completed) {
      return "bg-muted/50 border-border";
    }
    if (isActive) {
      return "bg-card border-primary shadow-md";
    }
    return "bg-muted/30 border-border opacity-60";
  };

  const openResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative">
      <div className={`absolute left-[-2.75rem] w-10 h-10 rounded-full flex items-center justify-center z-10 ${getStatusStyle()}`}>
        {getStatusIcon()}
      </div>
      
      <div className={`rounded-lg p-4 border ${getCardStyle()}`} data-testid={`milestone-card-${milestone.id}`}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h5 className="font-semibold text-foreground mb-1" data-testid={`milestone-title-${milestone.id}`}>
              {milestone.title}
            </h5>
            <p className="text-sm text-muted-foreground mb-3" data-testid={`milestone-description-${milestone.id}`}>
              {milestone.description}
            </p>
            
            {resources.length > 0 && isActive && (
              <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="videos" className="text-xs" data-testid={`tab-videos-${milestone.id}`}>
                      <Play size={12} className="mr-1" />
                      Videos ({videoResources.length})
                    </TabsTrigger>
                    <TabsTrigger value="articles" className="text-xs" data-testid={`tab-articles-${milestone.id}`}>
                      <BookOpen size={12} className="mr-1" />
                      Articles ({articleResources.length})
                    </TabsTrigger>
                    <TabsTrigger value="courses" className="text-xs" data-testid={`tab-courses-${milestone.id}`}>
                      <GraduationCap size={12} className="mr-1" />
                      Courses ({courseResources.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="videos" className="space-y-3 mt-3">
                    {videoResources.slice(0, 3).map((resource, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer card-hover"
                        onClick={() => openResource(resource.url)}
                        data-testid={`video-resource-${index}`}
                      >
                        <div className="w-16 h-12 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                          <Play size={16} className="text-red-700" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h6 className="font-medium text-foreground text-sm truncate mb-1" data-testid={`video-title-${index}`}>
                            {resource.title}
                          </h6>
                          <p className="text-xs text-muted-foreground mb-2" data-testid={`video-source-${index}`}>
                            {resource.source} • {resource.duration || "Video"}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">
                              {resource.source.includes("Search") ? resource.source : "YouTube"}
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

                  <TabsContent value="articles" className="space-y-3 mt-3">
                    {articleResources.slice(0, 3).map((resource, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer card-hover"
                        onClick={() => openResource(resource.url)}
                        data-testid={`article-resource-${index}`}
                      >
                        <div className="w-16 h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen size={16} className="text-blue-700" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h6 className="font-medium text-foreground text-sm truncate mb-1" data-testid={`article-title-${index}`}>
                            {resource.title}
                          </h6>
                          <p className="text-xs text-muted-foreground mb-2" data-testid={`article-source-${index}`}>
                            {resource.source} • {resource.readTime || "Article"}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">
                              Article
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

                  <TabsContent value="courses" className="space-y-3 mt-3">
                    {courseResources.slice(0, 3).map((resource, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer card-hover"
                        onClick={() => openResource(resource.url)}
                        data-testid={`course-resource-${index}`}
                      >
                        <div className="w-16 h-12 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                          <GraduationCap size={16} className="text-purple-700" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h6 className="font-medium text-foreground text-sm truncate mb-1" data-testid={`course-title-${index}`}>
                            {resource.title}
                          </h6>
                          <p className="text-xs text-muted-foreground mb-2" data-testid={`course-source-${index}`}>
                            {resource.source} • Course
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              Course
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
                </Tabs>
              </div>
            )}
          </div>
          
          <Checkbox
            checked={milestone.completed}
            onCheckedChange={() => onToggle(milestone.id)}
            disabled={isUpcoming}
            className="mt-1"
            data-testid={`milestone-checkbox-${milestone.id}`}
          />
        </div>
      </div>
    </div>
  );
}
