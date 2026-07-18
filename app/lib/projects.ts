/* ----------------------------------------------------------------------------
 * Case-study content for the Work section detail pages.
 * All copy here is placeholder / dummy — swap for real narrative + assets later.
 * Structure mirrors a strong case study: Problem → Outcomes → Solution → Process.
 * --------------------------------------------------------------------------*/

export type Metric = { value: string; label: string };
export type ProblemPoint = { title: string; body: string };

export type MediaKind = "phone" | "panel" | "duo" | "chart" | "photos";

// A media slot renders a real image (or grid of images) when `image`/`images`
// is set; otherwise it falls back to an abstract `media` placeholder.
export type DetailSection = {
  title: string;
  body: string;
  media?: MediaKind;
  image?: string;
  images?: string[];
  caption?: string;
};

export type Project = {
  slug: string;
  company: string;
  year: string;
  role: string;
  title: string;
  overview: string;
  collaborators: string[];
  hero?: { image?: string; media?: MediaKind };
  problem: {
    heading: string;
    body: string;
    points: ProblemPoint[];
    media?: MediaKind;
    image?: string;
    images?: string[];
  };
  outcomes: { heading: string; body: string; metrics: Metric[] };
  solution: { heading: string; body: string; sections: DetailSection[] };
  process: {
    heading: string;
    body: string;
    note: string;
    media?: MediaKind;
    images?: string[];
  };
};

export const projects: Project[] = [
  {
    slug: "ambitio",
    company: "Ambitio",
    year: "2025",
    role: "Product Designer — end-to-end",
    title: "Driving 14% dashboard adoption through a strategic UX redesign",
    overview:
      "Rebuilt Ambitio's postgraduate application platform into a decision-making engine — turning a static status tracker into a dashboard that thousands of learners open every day to know exactly what to do next.",
    collaborators: ["Priya Nair", "Rahul Mehta", "Sana Iqbal"],
    hero: { media: "phone" },
    problem: {
      media: "duo",
      heading: "The dashboard told users what happened, not what to do",
      body: "By early 2025, the dashboard was the least-used surface in the product despite being the default landing screen. Learners bounced to WhatsApp and email to figure out their next step — the exact opposite of what a dashboard should do.",
      points: [
        {
          title: "Everything looked equally important",
          body: "Deadlines, essays, mentor notes and payments all shared the same visual weight, so nothing stood out. Users scanned, felt overwhelmed, and left.",
        },
        {
          title: "No sense of progress",
          body: "There was no clear signal of how far along an application was, so learners couldn't tell whether they were on track or falling behind.",
        },
        {
          title: "Actions were buried two taps deep",
          body: "The one thing a user came to do — submit the next task — sat inside nested menus, adding friction at the exact moment intent was highest.",
        },
      ],
    },
    outcomes: {
      heading: "A dashboard people actually return to",
      body: "Within seven weeks of rollout, the redesign moved the metrics that mattered — adoption, task completion, and time-to-next-action.",
      metrics: [
        { value: "+14%", label: "Dashboard weekly active adoption" },
        { value: "2.3×", label: "Faster to the next action" },
        { value: "−31%", label: "Support tickets about 'what's next'" },
      ],
    },
    solution: {
      heading: "Make the next best action impossible to miss",
      body: "We rebuilt the dashboard around a single question: what should this learner do right now? Everything else became supporting context.",
      sections: [
        {
          title: "A priority stack, not a list",
          body: "The redesign replaces the flat list with a prioritised stack that surfaces the single most urgent task at the top, with upcoming items collapsing neatly beneath it. Deadlines drive the order automatically, so learners never sort anything themselves.",
          media: "phone",
          caption: "Priority stack — the urgent task always sits on top",
        },
        {
          title: "Progress you can feel",
          body: "A glanceable progress meter gives learners an honest read on how far along each application is. Milestones light up as they're completed, turning a stressful process into a series of small, motivating wins.",
          media: "panel",
          caption: "Milestone progress across every application",
        },
        {
          title: "One tap to act",
          body: "Primary actions were pulled out of nested menus and onto the card itself. Submitting a task, booking a mentor, or paying a fee now takes a single, obvious tap at the moment of intent.",
          media: "duo",
        },
      ],
    },
    process: {
      media: "photos",
      heading: "Testing & rollout",
      body: "We shipped behind a flag to 5% of learners, ran moderated sessions with first-generation applicants, and iterated on the priority logic three times before the full rollout.",
      note: "The hardest part was tuning the ranking — early versions felt 'nagging' until we let users snooze non-urgent items.",
    },
  },
  {
    slug: "fibr",
    company: "Fibr.ai",
    year: "2025",
    role: "Website design & Framer development — end-to-end",
    title: "Driving 35% traffic growth through a strategic CMS design in Framer",
    overview:
      "At Fibr.ai, I led the design and development of their complete website infrastructure built on Framer — including agent-specific pages for Liv, Max, and Aya, and a scalable CMS for conversion rate optimization across all 50 US states.",
    collaborators: [],
    hero: { image: "/work/fibr/cro-agency.avif" },
    problem: {
      heading: "Scaling a CRO web presence across 50 states — without the maintenance overhead",
      body: "Fibr.ai needed a web presence that could target diverse geographic markets while holding to CRO best practices. It had to support multiple AI-agent pages with dynamic content and deliver localized experiences across all 50 US states — all without ballooning into an unmaintainable pile of pages.",
      points: [
        {
          title: "50 states, one team",
          body: "Every state needed its own localized, SEO-ready page. Hand-building and maintaining those manually would have been impossible for a lean team.",
        },
        {
          title: "Three distinct AI agents",
          body: "Liv, Max, and Aya each needed a conversion-optimized page with its own story and interactive elements — while still feeling like one coherent product.",
        },
        {
          title: "CRO best-practices, everywhere",
          body: "Consistency mattered: every page had to follow proven conversion patterns rather than drift as new content was added.",
        },
      ],
    },
    outcomes: {
      heading: "A scalable system that compounds traffic and efficiency",
      body: "The Framer build turned a manual, design-bound process into a content-driven system — unlocking geographic reach and measurable growth.",
      metrics: [
        { value: "+35%", label: "Increase in targeted traffic" },
        { value: "+20%", label: "Improvement in CAC efficiency" },
        { value: "50", label: "US states with localized CMS pages" },
      ],
    },
    solution: {
      heading: "Agent pages up front, a CMS engine underneath",
      body: "I designed and built the whole site in Framer: conversion-focused pages for each AI agent, a CMS architecture that scales to every state, and a dynamic FAQ system that the team can maintain from a spreadsheet.",
      sections: [
        {
          title: "Conversion-optimized AI agent pages",
          body: "Three dedicated pages — Aya (website monitoring), Liv (ad-to-page personalization), and Max (A/B testing) — each with interactive hero elements and layouts built around a clear, single conversion goal, while sharing one design language.",
          images: [
            "/work/fibr/aya.webp",
            "/work/fibr/liv.webp",
            "/work/fibr/max.avif",
          ],
          caption: "Agent pages for Aya, Liv, and Max",
        },
        {
          title: "A scalable CMS for 50 states",
          body: "A CMS architecture drives 50 state-specific pages from a single set of templates. Localized content and targeted messaging flow in through CMS fields, so the marketing team can expand into a new market without touching layout or code.",
          image: "/work/fibr/cro-agency.avif",
          caption: "One system, every market — on-brand by construction",
        },
        {
          title: "A dynamic FAQ system powered by Google Sheets",
          body: "I integrated Framer CMS with Google Sheets so the FAQ section — categories and answers alike — stays dynamic and easy to maintain. Non-technical teammates update a sheet and the site follows, no redeploy required.",
          image: "/work/fibr/faq.webp",
          caption: "CMS-driven FAQ, editable straight from a spreadsheet",
        },
      ],
    },
    process: {
      heading: "Key learnings",
      body: "Building this end-to-end sharpened four things: architecting for scalability from day one, integrating external data sources (Framer CMS × Google Sheets) cleanly, letting CRO principles drive design decisions, and working at the intersection of design and development to ship without a handoff.",
      note: "Designing and building in the same tool meant every CRO decision could be validated live — no gap between the mockup and the shipped page.",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
