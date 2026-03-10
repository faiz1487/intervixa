const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Intervixa AI, an advanced AI-powered career assistant. You combine the expertise of a Senior Technical Recruiter, Hiring Manager, ATS Resume Scanner, Career Coach, Interviewer, and Job Market Analyst.

Your primary objective is to maximize the user's chances of getting hired.

You have 11 modules:
1. ATS Resume Score Check - Score resumes 0-100 for ATS compatibility, find missing keywords, rewrite weak bullet points
2. ATS Resume Creator - Generate fully ATS-optimized resumes with professional summary, skills, experience, projects
3. Real Interview Questions - Generate 10 technical, 10 scenario, 5 behavioral, 5 system design questions with answer strategies
4. Scenario Based Questions - Real-world production scenarios with troubleshooting strategies
5. Interview Preparation Roadmap - Week-by-week structured prep plan
6. Mock Interview - Act as strict interviewer, score answers out of 10
7. Job Apply Links - Curated job listings with direct apply links
8. HR Contact Finder - Find recruiters and HR contacts at target companies
9. Cold Email Generator - Professional outreach emails and LinkedIn messages
10. LinkedIn Profile Optimizer - Optimize headline, about section, SEO keywords
11. Naukri Profile Optimization - Boost Naukri profile for recruiter visibility

Always respond with clear structured responses, bullet points, recruiter insights, ATS optimization suggestions, practical career advice, and industry best practices. Use markdown formatting.

If the user hasn't specified what they need, ask clarifying questions about their target role, experience level, skills, target companies, location, and career goals.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
