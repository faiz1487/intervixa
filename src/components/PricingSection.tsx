import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Get started with basic career tools",
    features: [
      "3 AI mock interviews/month",
      "Basic resume analysis",
      "Interview question bank",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    desc: "For serious job seekers",
    features: [
      "Unlimited AI mock interviews",
      "Advanced resume analyzer",
      "Performance analytics",
      "Personalized prep roadmaps",
      "Cold email generator",
      "LinkedIn & Naukri optimizer",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For teams and institutions",
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "Custom question templates",
      "API access",
      "Dedicated account manager",
      "SSO integration",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-32 relative" id="pricing">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 block">Pricing</span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your career goals. Upgrade or cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl transition-all duration-300 ${
                plan.popular
                  ? "glass border-primary/50 shadow-glow scale-[1.02]"
                  : "glass hover:border-primary/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                  <span className="text-xs font-semibold text-primary-foreground">Most Popular</span>
                </div>
              )}

              <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-5">{plan.desc}</p>

              <div className="mb-6">
                <span className="text-4xl font-display font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full rounded-xl py-6 font-semibold ${
                  plan.popular
                    ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                } transition-all`}
              >
                <Link to="/login">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
