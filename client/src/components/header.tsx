import { Link, useLocation } from "wouter";
import { Route, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery<{ user: { username: string } }>({
    queryKey: ["/api/auth/me"],
  });

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        queryClient.clear();
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
        setLocation("/login");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout",
      });
    }
  };

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" data-testid="link-home">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
              <Route className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AI Roadmap Generator</h1>
              <p className="text-xs text-muted-foreground">Personalized Learning Paths</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location === "/dashboard" ? "text-foreground" : "text-muted-foreground"
              }`} 
              data-testid="link-dashboard"
            >
              Dashboard
            </Link>
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location === "/" ? "text-foreground" : "text-muted-foreground"
              }`} 
              data-testid="link-roadmaps"
            >
              My Roadmaps
            </Link>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-resources">
              Resources
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <Bell className="text-muted-foreground" size={16} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold hover:opacity-90 transition-opacity" data-testid="avatar-user">
                  {user?.user?.username?.[0]?.toUpperCase() || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.user?.username || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
