import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Sparkles, Loader2, FileDown, Copy, Pencil, CheckCircle2,
  AlertTriangle, TrendingUp, Search, Target, Upload,
} from "lucide-react";
import { parseResumeFile } from "@/lib/resume-parser";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ResumePreview from "@/components/ats-resume/ResumePreview";
import ATSScoreCard from "@/components/ats-resume/ATSScoreCard";
import { exportToPDF, exportToDOCX } from "@/lib/resume-export";

export interface ResumeData {
  professionalSummary: string;
  technicalSkills: string[];
  experience: { title: string; company: string; duration: string; bullets: string[] }[];
  projects: { name: string; description: string; bullets: string[] }[];
  education: { degree: string; institution: string; year: string }[];
  certifications: string[];
}

export interface ATSAnalysis {
  atsScore: number;
  keywordMatch: number;
  missingKeywords: string[];
  improvements: string[];
}

const ATSResumeBuilder = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const text = await parseResumeFile(file);
      setResumeText(text);
      toast.success(`Parsed "${file.name}" successfully!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse file.");
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!resumeText.trim() && !targetRole.trim()) {
      toast.error("Please paste your resume or specify a target role.");
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ats-resume", {
        body: { resumeText, jobDescription, yearsOfExperience, skills, targetRole },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResumeData(data.resume);
      setAtsAnalysis(data.atsAnalysis);
      toast.success("Resume generated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!resumeData) return;
    const text = formatResumeAsText(resumeData);
    await navigator.clipboard.writeText(text);
    toast.success("Resume copied to clipboard!");
  };

  const handleDownloadPDF = () => {
    if (!previewRef.current) return;
    exportToPDF(previewRef.current);
    toast.success("PDF download started!");
  };

  const handleDownloadDOCX = () => {
    if (!resumeData) return;
    exportToDOCX(resumeData);
    toast.success("DOCX download started!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-border/30 px-4 py-3 flex items-center gap-3 shrink-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate("/chat")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold text-sm">Intervixa AI — ATS Resume Builder</h1>
          <p className="text-xs text-muted-foreground">Build ATS-optimized resumes with AI</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Input Section */}
            <div className="space-y-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">📄 Paste Existing Resume</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your current resume text here..."
                    rows={8}
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">📋 Job Description <span className="text-muted-foreground">(optional)</span></label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description to match keywords..."
                    rows={5}
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">🎯 Target Role</label>
                    <input
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. DevOps Engineer"
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">📅 Years of Experience</label>
                    <input
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">🛠 Key Skills</label>
                    <input
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. AWS, Docker, K8s"
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-primary text-primary-foreground h-12 rounded-xl shadow-glow hover:opacity-90 transition-opacity font-semibold text-sm"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating ATS Resume...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Generate ATS Resume</>
                  )}
                </Button>
              </motion.div>

              {/* ATS Score Card */}
              <AnimatePresence>
                {atsAnalysis && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <ATSScoreCard analysis={atsAnalysis} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Preview Section */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {resumeData ? (
                  <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="glass rounded-2xl overflow-hidden">
                      <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
                        <h2 className="font-display font-semibold text-sm">AI Generated Resume</h2>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="text-xs">
                            <Pencil className="w-3.5 h-3.5 mr-1" /> {isEditing ? "Done" : "Edit"}
                          </Button>
                        </div>
                      </div>
                      <div ref={previewRef} className="p-6">
                        <ResumePreview data={resumeData} isEditing={isEditing} onChange={setResumeData} />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Button onClick={handleDownloadPDF} variant="outline" className="rounded-xl text-xs h-10">
                        <FileDown className="w-3.5 h-3.5 mr-1" /> PDF
                      </Button>
                      <Button onClick={handleDownloadDOCX} variant="outline" className="rounded-xl text-xs h-10">
                        <FileDown className="w-3.5 h-3.5 mr-1" /> DOCX
                      </Button>
                      <Button onClick={handleCopy} variant="outline" className="rounded-xl text-xs h-10">
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                      </Button>
                      <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="rounded-xl text-xs h-10">
                        <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      <Target className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2 text-foreground">Resume Preview</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Fill in your details on the left and click "Generate ATS Resume" to see your optimized resume here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatResumeAsText(data: ResumeData): string {
  let text = "";
  text += "PROFESSIONAL SUMMARY\n" + data.professionalSummary + "\n\n";
  text += "TECHNICAL SKILLS\n" + data.technicalSkills.join(", ") + "\n\n";
  text += "PROFESSIONAL EXPERIENCE\n";
  data.experience.forEach((exp) => {
    text += `${exp.title} | ${exp.company} | ${exp.duration}\n`;
    exp.bullets.forEach((b) => (text += `• ${b}\n`));
    text += "\n";
  });
  text += "PROJECTS\n";
  data.projects.forEach((p) => {
    text += `${p.name} — ${p.description}\n`;
    p.bullets.forEach((b) => (text += `• ${b}\n`));
    text += "\n";
  });
  text += "EDUCATION\n";
  data.education.forEach((e) => (text += `${e.degree} | ${e.institution} | ${e.year}\n`));
  text += "\nCERTIFICATIONS\n";
  data.certifications.forEach((c) => (text += `• ${c}\n`));
  return text;
}

export default ATSResumeBuilder;
