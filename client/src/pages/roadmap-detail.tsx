import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/header";
import RoadmapDisplay from "@/components/roadmap-display";
import { apiRequest } from "@/lib/queryClient";
import { generateRoadmapPDF } from "@/lib/pdf-export";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Roadmap, Milestone, UserProgress } from "@shared/schema";

interface RoadmapDetailResponse {
  roadmap: Roadmap;
  milestones: Milestone[];
  progress: UserProgress | null;
}

export default function RoadmapDetail() {
  const [, params] = useRoute("/roadmap/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const roadmapId = params?.id;

  const { data, isLoading, error } = useQuery<RoadmapDetailResponse>({
    queryKey: ["/api/roadmaps", roadmapId],
    enabled: !!roadmapId,
  });

  const toggleMilestoneMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      const response = await apiRequest("PATCH", `/api/milestones/${milestoneId}/toggle`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roadmaps", roadmapId] });
      toast({
        title: "Progress Updated!",
        description: "Your milestone progress has been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update milestone. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownloadPDF = () => {
    if (data?.roadmap && data?.milestones) {
      generateRoadmapPDF(data.roadmap, data.milestones);
      toast({
        title: "PDF Downloaded!",
        description: "Your roadmap has been saved as a PDF.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-lg border border-border mb-8">
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.roadmap) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Card>
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-error-title">
                Roadmap Not Found
              </h2>
              <p className="text-muted-foreground" data-testid="text-error-description">
                The roadmap you're looking for doesn't exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-muted/30">
        <RoadmapDisplay
          roadmap={data.roadmap}
          milestones={data.milestones || []}
          onToggleMilestone={(milestoneId) => toggleMilestoneMutation.mutate(milestoneId)}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>
    </div>
  );
}
