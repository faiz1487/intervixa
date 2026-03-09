import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Google",
    content: "The AI mock interviews were incredibly realistic. I practiced system design questions and got detailed feedback that helped me clear my Google interview on the first try.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "DevOps Engineer at Amazon",
    content: "The resume analyzer found issues my friends missed. After optimizing for ATS, I started getting 3x more interview calls. Absolutely worth it!",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    role: "Data Scientist at Microsoft",
    content: "The personalized prep roadmap kept me on track for 4 weeks. The scenario questions were so close to what I actually got asked in the interview.",
    rating: 5,
  },
  {
    name: "Arjun Nair",
    role: "Backend Developer at Flipkart",
    content: "I used the cold email generator to reach out to recruiters. Got responses from 5 companies within a week. The LinkedIn optimizer was a game changer too.",
    rating: 5,
  },
  {
    name: "Meera Joshi",
    role: "Product Manager at Razorpay",
    content: "As a career switcher, I was nervous about interviews. The mock interview feature built my confidence and the feedback was actionable and specific.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Full Stack Developer at Swiggy",
    content: "From resume building to interview prep, this platform covers everything. I landed my dream job in just 3 weeks of preparation.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-32 bg-muted/20" id="testimonials">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Loved by <span className="text-gradient">10,000+ Professionals</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from people who transformed their careers with our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl glass hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed mb-5">"{t.content}"</p>
              <div>
                <p className="font-display font-semibold text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
