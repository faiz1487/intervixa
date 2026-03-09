import logo from "@/assets/intervixa_logo.png";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Intervixa AI" className="h-6 w-auto" />
        <span className="font-display font-semibold text-sm">Intervixa AI</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Intervixa AI. Prepare smarter, get hired faster.
      </p>
    </div>
  </footer>
);

export default Footer;
