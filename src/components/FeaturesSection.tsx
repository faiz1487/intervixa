import { motion } from "framer-motion";
import {
  FileSearch,
  FilePlus2,
  MessageSquareMore,
  AlertTriangle,
  Map,
  Mic,
  ExternalLink,
  UserSearch,
  Mail,
  Linkedin,
  Briefcase,
} from "lucide-react";

const modules = [
  { icon: FileSearch, title: "ATS Resume Score", desc: "Get an instant ATS compatibility score with keyword gap analysis." },
  { icon: FilePlus2, title: "Resume Creator", desc: "Generate fully ATS-optimized resumes tailored to any role." },
  { icon: MessageSquareMore, title: "Interview Questions", desc: "Role-specific technical, behavioral, and system design questions." },
  { icon: AlertTriangle, title: "Scenario Questions", desc: "Real-world production scenarios with ideal troubleshooting strategies." },
  { icon: Map, title: "Prep Roadmap", desc: "Week-by-week structured interview preparation plan." },
  { icon: Mic, title: "Mock Interview", desc: "AI interviewer scores your answers and suggests improvements." },
  { icon: ExternalLink, title: "Job Apply Links", desc: "Curated job listings with direct apply links from top boards." },
  { icon: UserSearch, title: "HR Contact Finder", desc: "Find recruiters and HR contacts at your target companies." },
  { icon: Mail, title: "Cold Email Generator", desc: "Professional outreach emails and LinkedIn messages." },
  { icon: Linkedin, title: "LinkedIn Optimizer", desc: "Optimize your headline, about section, and SEO keywords." },
  { icon: Briefcase, title: "Naukri Optimizer", desc: "Boost your Naukri profile for recruiter search visibility." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-28 relative" id="features">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            11 Powerful <span className="text-gradient">AI Modules</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to land your dream job — powered by AI that thinks like a recruiter.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {modules.map((mod) => (
            <motion.div
              key={mod.title}
              variants={item}
              className="group p-6 rounded-xl glass hover:border-primary/30 transition-all duration-300 hover:shadow-glow cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <mod.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{mod.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{mod.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
