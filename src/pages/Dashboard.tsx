import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic, FileSearch, History, BarChart3, Settings, Sparkles,
  ArrowRight, LogOut, MessageSquareMore,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dashboardCards = [
  {
    icon: Mic,
    title: "Start AI Interview",
    desc: "Practice with an AI interviewer. Choose your role and difficulty level.",
    path: "/chat",
    color: "from-primary to-glow-secondary",
    prompt: "Start a mock interview session with me. Ask me one question at a time.",
  },
  {
    icon: FileSearch,
    title: "Resume Analyzer",
    desc: "Upload your resume and get instant ATS score with improvement tips.",
    path: "/chat",
    color: "from-glow-secondary to-primary",
    prompt: "I want to check my resume's ATS score. What do you need from me?",
  },
  {
    icon: MessageSquareMore,
    title: "Career Chat",
    desc: "Ask anything about your career — interview tips, job search, and more.",
    path: "/chat",
    color: "from-primary to-glow-secondary",
    prompt: "",
  },
  {
    icon: History,
    title: "Interview History",
    desc: "Review your past interviews, scores, and detailed feedback.",
    path: "/chat",
    color: "from-glow-secondary to-primary",
    prompt: "",
    comingSoon: true,
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Track your improvement over time with detailed progress charts.",
    path: "/chat",
    color: "from-primary to-glow-secondary",
    prompt: "",
    comingSoon: true,
  },
  {
    icon: Settings,
    title: "Profile Settings",
    desc: "Update your profile, preferences, and notification settings.",
    path: "/chat",
    color: "from-glow-secondary to-primary",
    prompt: "",
    comingSoon: true,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; avatar: string; email: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          name: meta?.full_name || meta?.name || session.user.email || "User",
          avatar: meta?.avatar_url || meta?.picture || "",
          email: session.user.email || "",
        });
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleCardClick = (card: typeof dashboardCards[0]) => {
    if (card.comingSoon) return;
    if (card.prompt) {
      navigate("/chat", { state: { initialPrompt: card.prompt } });
    } else {
      navigate(card.path);
    }
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/30 sticky top-0 z-50">
        <div className="container px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">Intervixa AI</span>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-secondary/50 px-2 py-1 transition-colors">
                  <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="container px-6 py-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Welcome back, <span className="text-gradient">{firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            What would you like to work on today?
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {dashboardCards.map((card) => (
            <motion.button
              key={card.title}
              variants={item}
              onClick={() => handleCardClick(card)}
              disabled={card.comingSoon}
              className={`group relative text-left p-6 rounded-2xl glass transition-all duration-300 ${
                card.comingSoon
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-primary/30 hover:shadow-glow cursor-pointer"
              }`}
            >
              {card.comingSoon && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  Coming Soon
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}>
                <card.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1.5">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{card.desc}</p>
              {!card.comingSoon && (
                <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
