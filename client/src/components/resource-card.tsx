import { Play, BookOpen, GraduationCap, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Resource {
  type: "video" | "article" | "course";
  title: string;
  url: string;
  source: string;
  duration?: string;
  readTime?: string;
  level: "beginner" | "intermediate" | "advanced";
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

export default function ResourceCard({ resource, index }: ResourceCardProps) {
  const getResourceIcon = () => {
    switch (resource.type) {
      case "video":
        return <Play size={16} className="text-red-700" />;
      case "article":
        return <BookOpen size={16} className="text-blue-700" />;
      case "course":
        return <GraduationCap size={16} className="text-purple-700" />;
      default:
        return <BookOpen size={16} className="text-gray-700" />;
    }
  };

  const getResourceBadgeColor = () => {
    switch (resource.type) {
      case "video":
        return "destructive";
      case "article":
        return "default";
      case "course":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getResourceBackgroundColor = () => {
    switch (resource.type) {
      case "video":
        return "bg-red-100";
      case "article":
        return "bg-blue-100";
      case "course":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  const getResourceLabel = () => {
    switch (resource.type) {
      case "video":
        // Use dynamic source if it says "YouTube Search", otherwise use "YouTube"
        return resource.source.includes("Search") ? resource.source : "YouTube";
      case "article":
        return "Article";
      case "course":
        return "Course";
      default:
        return "Resource";
    }
  };

  const openResource = () => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="cursor-pointer card-hover transition-all duration-200 hover:shadow-md"
      onClick={openResource}
      data-testid={`resource-card-${resource.type}-${index}`}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className={`w-16 h-12 rounded flex items-center justify-center flex-shrink-0 ${getResourceBackgroundColor()}`}>
            {getResourceIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h6 
              className="font-medium text-foreground text-sm truncate mb-1" 
              data-testid={`resource-title-${index}`}
              title={resource.title}
            >
              {resource.title}
            </h6>
            
            <p className="text-xs text-muted-foreground mb-2" data-testid={`resource-source-${index}`}>
              {resource.source} • {resource.duration || resource.readTime || "Resource"}
            </p>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={getResourceBadgeColor() as any} 
                className="text-xs"
                data-testid={`resource-type-badge-${index}`}
              >
                {getResourceLabel()}
              </Badge>
              
              <Badge 
                variant="outline" 
                className="text-xs"
                data-testid={`resource-level-badge-${index}`}
              >
                {resource.level}
              </Badge>
              
              <ExternalLink 
                size={12} 
                className="text-muted-foreground ml-auto" 
                data-testid={`resource-external-icon-${index}`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
