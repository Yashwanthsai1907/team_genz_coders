import { Link } from "wouter";
import { Plus, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="gradient-bg py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center text-white">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6" data-testid="badge-ai-powered">
          <Sparkles className="text-yellow-300" size={16} />
          <span className="text-sm font-medium">Powered by Gemini 2.5 Pro AI</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-hero-title">
          Create Your Personalized Learning Journey
        </h2>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
          Generate AI-powered study plans with milestones, curated resources, and project ideas tailored to your goals
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 px-8 py-3 font-semibold"
              data-testid="button-create-roadmap"
            >
              <Plus size={20} />
              Create New Roadmap
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 font-semibold hover:bg-white/30 border-white/30"
            data-testid="button-watch-demo"
          >
            <Play size={20} />
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
