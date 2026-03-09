import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-primary-foreground" />
        </div>
        <span className="font-display font-semibold text-sm">Intervixa AI</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Intervixa AI. Prepare smarter, get hired faster.
      </p>
    </div>
  </footer>
);

export default Footer;
