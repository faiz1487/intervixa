import { motion } from "framer-motion";
import {
  Mic, FileSearch, Brain, Target, BarChart3, Shield,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "AI Mock Interviews",
    desc: "Practice with an AI interviewer that adapts to your role. Get scored answers, real-time feedback, and detailed improvement tips.",
    gradient: "from-primary/20 to-glow-secondary/20",
  },
  {
    icon: FileSearch,
    title: "Resume Analyzer",
    desc: "Upload your resume and get an instant ATS compatibility score, keyword analysis, and actionable improvement suggestions.",
    gradient: "from-glow-secondary/20 to-primary/20",
  },
  {
    icon: Brain,
    title: "Smart Question Bank",
    desc: "Role-specific interview questions covering technical, behavioral, and system design — tailored to your experience level.",
    gradient: "from-primary/20 to-glow-secondary/20",
  },
  {
    icon: Target,
    title: "Personalized Roadmaps",
    desc: "Get a week-by-week preparation plan customized for your target role, company, and timeline.",
    gradient: "from-glow-secondary/20 to-primary/20",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Track your progress over time with detailed charts showing score improvements, strengths, and areas to focus on.",
    gradient: "from-primary/20 to-glow-secondary/20",
  },
  {
    icon: Shield,
    title: "ATS Optimization",
    desc: "Ensure your resume passes Applicant Tracking Systems with keyword optimization and formatting suggestions.",
    gradient: "from-glow-secondary/20 to-primary/20",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-32 relative" id="features">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 block">Features</span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Everything You Need to <span className="text-gradient">Land the Job</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete AI-powered career toolkit designed to help you prepare smarter and get hired faster.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group relative p-8 rounded-2xl glass hover:border-primary/30 transition-all duration-300 hover:shadow-glow"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
