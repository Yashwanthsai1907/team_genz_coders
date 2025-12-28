import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, BookOpen, Target, Clock, Play, Lightbulb, GraduationCap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { roadmapFormSchema, type RoadmapFormData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { title: "Topic & Goal", description: "What do you want to learn?" },
  { title: "Skill Level", description: "Where are you starting from?" },
  { title: "Time & Style", description: "How do you like to learn?" },
  { title: "Review", description: "Let's generate your roadmap" }
];

const learningGoals = [
  {
    id: "project-building",
    title: "Project Building",
    description: "Build real-world projects",
    icon: Target
  },
  {
    id: "exam-preparation", 
    title: "Exam Preparation",
    description: "Ace your exams",
    icon: GraduationCap
  },
  {
    id: "concept-mastery",
    title: "Concept Mastery", 
    description: "Deep understanding",
    icon: Lightbulb
  }
];

const learningStyles = [
  { id: "videos", label: "Video Tutorials" },
  { id: "articles", label: "Articles & Blogs" },
  { id: "hands-on", label: "Hands-on Projects" },
  { id: "interactive", label: "Interactive Courses" },
  { id: "books", label: "Books & Documentation" },
  { id: "community", label: "Community Learning" }
];

export default function RoadmapForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<RoadmapFormData>({
    resolver: zodResolver(roadmapFormSchema),
    defaultValues: {
      topic: "",
      goal: "project-building",
      skillLevel: "beginner",
      timePerWeek: 10,
      duration: 12,
      learningStyle: ["videos"],
      details: "",
    },
  });

  const generateRoadmapMutation = useMutation({
    mutationFn: async (data: RoadmapFormData) => {
      const response = await apiRequest("POST", "/api/roadmaps/generate", data);
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Roadmap Generated!",
        description: "Your personalized learning path is ready.",
      });
      navigate(`/roadmap/${result.roadmap.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: RoadmapFormData) => {
    generateRoadmapMutation.mutate(data);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className={`step-indicator flex-1 flex flex-col items-center relative z-10 ${index === steps.length - 1 ? 'last' : ''}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 shadow-lg transition-all ${
                index <= currentStep 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`} data-testid={`step-indicator-${index + 1}`}>
                {index + 1}
              </div>
              <span className={`text-sm font-medium ${
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" data-testid="progress-form" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-lg border border-border">
            <CardHeader>
              <CardTitle className="text-2xl" data-testid="text-step-title">
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription data-testid="text-step-description">
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Step 1: Topic & Goal */}
              {currentStep === 0 && (
                <div className="space-y-6 fade-in">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <BookOpen className="text-primary" size={16} />
                          Topic or Skill
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Full Stack Web Development, Machine Learning, Data Science" 
                            {...field}
                            data-testid="input-topic"
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about what you want to master
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <Target className="text-secondary" size={16} />
                          Learning Goal
                        </FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {learningGoals.map((goal) => {
                            const Icon = goal.icon;
                            return (
                              <Button
                                key={goal.id}
                                type="button"
                                variant={field.value === goal.id ? "default" : "outline"}
                                className={`p-4 h-auto text-left justify-start ${
                                  field.value === goal.id 
                                    ? "border-primary bg-primary/5" 
                                    : "hover:bg-muted"
                                }`}
                                onClick={() => field.onChange(goal.id)}
                                data-testid={`button-goal-${goal.id}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Icon className="text-primary" size={16} />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground">{goal.title}</div>
                                    <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <MessageSquare className="text-accent" size={16} />
                          Additional Details (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder="Any specific topics you want to focus on or skip? Preferred frameworks or tools?"
                            className="resize-none"
                            {...field}
                            data-testid="textarea-details"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Skill Level */}
              {currentStep === 1 && (
                <div className="space-y-6 fade-in">
                  <FormField
                    control={form.control}
                    name="skillLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Current Skill Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-skill-level">
                              <SelectValue placeholder="Select your skill level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner" data-testid="option-beginner">
                              Beginner - New to this topic
                            </SelectItem>
                            <SelectItem value="intermediate" data-testid="option-intermediate">
                              Intermediate - Some experience
                            </SelectItem>
                            <SelectItem value="advanced" data-testid="option-advanced">
                              Advanced - Experienced practitioner
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Time & Learning Style */}
              {currentStep === 2 && (
                <div className="space-y-6 fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="timePerWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Clock className="text-primary" size={16} />
                            Hours per Week
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={40}
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              data-testid="input-hours-week"
                            />
                          </FormControl>
                          <FormDescription>
                            How many hours can you dedicate weekly?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Total Duration (weeks)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={52}
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              data-testid="input-duration"
                            />
                          </FormControl>
                          <FormDescription>
                            How long do you want the roadmap to be?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="learningStyle"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Preferred Learning Styles</FormLabel>
                        <FormDescription>
                          Select all that apply to personalize your resources
                        </FormDescription>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          {learningStyles.map((style) => (
                            <FormField
                              key={style.id}
                              control={form.control}
                              name="learningStyle"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={style.id}
                                    className="flex flex-row items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(style.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, style.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== style.id
                                                )
                                              )
                                        }}
                                        data-testid={`checkbox-style-${style.id}`}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {style.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 4: Review & Generate */}
              {currentStep === 3 && (
                <div className="space-y-6 fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground" data-testid="text-review-title">Review Your Roadmap</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Topic:</span>
                          <span className="font-medium" data-testid="text-review-topic">{form.watch("topic")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Goal:</span>
                          <span className="font-medium" data-testid="text-review-goal">{form.watch("goal")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Skill Level:</span>
                          <span className="font-medium" data-testid="text-review-skill">{form.watch("skillLevel")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time per Week:</span>
                          <span className="font-medium" data-testid="text-review-time">{form.watch("timePerWeek")} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium" data-testid="text-review-duration">{form.watch("duration")} weeks</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Learning Styles:</span>
                          <span className="font-medium" data-testid="text-review-styles">{form.watch("learningStyle")?.length} selected</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">What happens next?</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• AI will generate your personalized roadmap</li>
                        <li>• Phases and milestones will be created</li>
                        <li>• Curated resources will be suggested</li>
                        <li>• Project ideas will be recommended</li>
                        <li>• Progress tracking will be set up</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <div className="flex items-center justify-between p-6 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                data-testid="button-previous"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  data-testid="button-next"
                >
                  Next Step
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={generateRoadmapMutation.isPending}
                  data-testid="button-generate"
                >
                  {generateRoadmapMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Generate Roadmap
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
