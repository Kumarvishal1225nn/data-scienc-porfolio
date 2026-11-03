/**
 * ─────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — all text on the site lives here.
 *  Leave a field as `undefined` / `null` to hide it; nothing
 *  is shown that you haven't filled in.
 * ─────────────────────────────────────────────────────────────
 */

/* ---------- Journey (career roadmap) ---------- */

export type MilestoneState = "done" | "current" | "future";

export interface Milestone {
  id: string;
  state: MilestoneState;
  icon: "code" | "hotel" | "flask" | "grad" | "target";
  period?: string; // only verified dates
  title: string;
  org: string;
  /** One short line. */
  summary: string;
  details: string[];
}

export const journey: Milestone[] = [
  {
    id: "btech",
    state: "done",
    icon: "code",
    period: "2018 – 22",
    title: "B.Tech CS",
    org: "Lovely Professional University",
    summary: "Programming, databases, systems.",
    details: [],
  },
  {
    id: "hotel",
    state: "done",
    icon: "hotel",
    period: "2022 – 24",
    title: "Assistant Manager",
    org: "A.R. Hotel & Restaurant",
    summary: "29 months running daily operations.",
    details: [],
  },
  {
    id: "research",
    state: "done",
    icon: "flask",
    title: "Internships & research",
    org: "C-DAC · BSERC · IIT Guwahati · Annam.AI",
    summary: "From training to a production ML pipeline.",
    details: [
      "C-DAC Patna — AI & Data Science (Dec 2025 – Jan 2026)",
      "Bharat Space Education Research Centre — intern",
      "IIT Guwahati — summer research, Dr. Himanshu Gupta",
      "Annam.AI, IIT Ropar — Data Analyst intern (May – Jul 2026)",
    ],
  },
  {
    id: "msdsm",
    state: "current",
    icon: "grad",
    period: "2025 – 27",
    title: "MS Data Science & Management",
    org: "IIT Ropar × IIM Amritsar",
    summary: "ML + statistics, paired with management.",
    details: [],
  },
  {
    id: "next",
    state: "future",
    icon: "target",
    period: "2027 →",
    title: "Analytics & ML roles",
    org: "Data · Business · ML",
    summary: "Open to full-time roles after graduation.",
    details: [],
  },
];

/* ---------- Skills ---------- */

export const skillGroups = [
  {
    name: "Programming",
    note: "Writing analysis and pipelines",
    icon: "code",
    skills: ["Python", "SQL"],
  },
  {
    name: "Data analytics",
    note: "Cleaning, exploring, reporting",
    icon: "table",
    skills: ["Excel", "Pandas", "NumPy", "Power BI", "Tableau", "Exploratory data analysis", "Data visualization"],
  },
  {
    name: "Machine learning",
    note: "Modelling and evaluation",
    icon: "brain",
    skills: ["Scikit-learn", "LightGBM", "XGBoost", "NLP", "Time series analysis"],
  },
  {
    name: "Databases & cloud",
    note: "Storing and serving data",
    icon: "database",
    skills: ["PostgreSQL", "AWS", "Neo4j"],
  },
  {
    name: "Tools",
    note: "Day-to-day workflow",
    icon: "wrench",
    skills: ["Jupyter Notebook", "Git", "GitHub"],
  },
] as const;

/* ---------- Projects ---------- */

export type ProjectVisual =
  | "telemetry"
  | "taxi"
  | "retail"
  | "supply"
  | "tourism"
  | "walmart"
  | "aqi"
  | "risk";

export type ProjectCategory = "Machine learning" | "Analytics" | "BI dashboards";

export interface Project {
  id: string;
  title: string;
  /** One short line. Keep it under ~12 words. */
  tagline: string;
  visual: ProjectVisual;
  category: ProjectCategory;
  tech: string[];
  /** 2–4 very short bullets shown in the detail view. */
  highlights: string[];
  /** The big number on the card. Only verified numbers. Leave undefined to hide. */
  headline?: { value: string; label: string };
  /** Extra numbers for the detail view. Only verified numbers. */
  metrics?: { label: string; value: string }[];
  /** Real screenshots: put files in /public/images/projects/ and list them here. */
  screenshots?: { src: string; alt: string }[];
  repoUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  context?: string;
}

export const projects: Project[] = [
  {
    id: "telemetry",
    featured: true,
    title: "IoT telemetry reconstruction",
    context: "Annam.AI, IIT Ropar · in production",
    tagline: "Fills sensor outages across 143 weather stations with ML.",
    visual: "telemetry",
    category: "Machine learning",
    tech: ["Python", "LightGBM", "XGBoost", "AWS", "DynamoDB"],
    headline: { value: "143", label: "IoT sensors" },
    highlights: [
      "Every station resampled to 5-minute intervals",
      "Gap length picks the method: interpolation → ML ensemble → neighbour stations",
      "Runs on AWS Fargate + EventBridge, writes back to DynamoDB",
    ],
    metrics: [
      { label: "R²", value: "0.9911" },
      { label: "LightGBM RMSE", value: "0.7252" },
      { label: "Outages detected", value: "136" },
      { label: "Sampling grid", value: "5 min" },
    ],
  },
  {
    id: "tourism",
    title: "Himachal tourist vehicle flows",
    context: "Dissertation",
    tagline: "Seasonal tourist traffic: clusters, anomalies and forecasts.",
    visual: "tourism",
    category: "Machine learning",
    tech: ["Python", "K-Means", "Isolation Forest", "ARIMA"],
    headline: { value: "100,000", label: "rows analysed" },
    highlights: [
      "Dataset calibrated to real HP tourism statistics",
      "K-Means segments, Isolation Forest anomalies, ARIMA forecast",
      "14-section analysis notebook + report",
    ],
    metrics: [
      { label: "Rows", value: "100K" },
      { label: "Analysis sections", value: "14" },
    ],
  },
  {
    id: "walmart",
    title: "Walmart sales analytics",
    tagline: "SQL deep-dive into what sells, where and when.",
    visual: "walmart",
    category: "Analytics",
    tech: ["SQL", "Excel"],
    headline: { value: "10K+", label: "transactions" },
    highlights: [
      "Sales by branch, product line and time of day",
      "Revenue and customer-type breakdowns in SQL",
    ],
  },
  {
    id: "aqi",
    title: "Air quality forecasting dashboard",
    context: "Big Data & Data Visualization · group project",
    tagline: "Real-time AQI for Indian cities — gaps filled, next days forecast.",
    visual: "aqi",
    category: "Machine learning",
    tech: ["Python", "Time series", "CPCB data", "OpenAQ"],
    highlights: [
      "Monitoring, gap-filling and forecasting in one dashboard",
      "Data from CPCB / data.gov.in and OpenAQ",
    ],
  },
  {
    id: "risk",
    title: "Portfolio analytics & risk dashboard",
    tagline: "Returns, Sharpe ratio and drawdowns at a glance.",
    visual: "risk",
    category: "BI dashboards",
    tech: ["Python", "SQL", "Power BI"],
    highlights: ["Sharpe ratio and maximum drawdown tracking", "Interactive Power BI views"],
  },
  {
    id: "taxi",
    title: "NYC taxi network analytics",
    tagline: "How trips flow between city zones.",
    visual: "taxi",
    category: "Analytics",
    tech: ["Tableau", "SQL", "Graph analytics"],
    // headline: { value: "?", label: "trips" },  ← add the real number
    highlights: ["Zones as nodes, trips as weighted edges", "Demand by geography and hour"],
  },
  {
    id: "retail",
    title: "Retail BI dashboard",
    tagline: "Sales KPIs managers can read in five seconds.",
    visual: "retail",
    category: "BI dashboards",
    tech: ["Tableau", "Excel"],
    // headline: { value: "?", label: "orders" },  ← add the real number
    highlights: ["KPI views for sales and operations", "Built for decisions, not raw tables"],
  },
  {
    id: "supply",
    title: "Global supply chain network",
    tagline: "Mapping suppliers, flows and weak links.",
    visual: "supply",
    category: "Analytics",
    tech: ["Python", "SQL", "Network analysis"],
    // headline: { value: "?", label: "shipments" },  ← add the real number
    highlights: ["Suppliers and flows as a network", "Surfaces critical dependencies"],
  },
];

/* ---------- Experience ---------- */

export interface ExperienceItem {
  id: string;
  role: string;
  org: string;
  kind: "Work" | "Internship" | "Research" | "Training";
  period?: string;
  location?: string;
  points?: string[];
  certificateUrl?: string;
}

export const experience: ExperienceItem[] = [
  {
    id: "annam",
    role: "Data Analyst Intern",
    org: "Annam.AI, IIT Ropar",
    kind: "Internship",
    period: "May 2026 – Jul 2026",
    points: [
      "Shipped an ML gap-filling pipeline for 143 IoT stations to production",
      "Notebook → AWS (Terraform, Docker, Fargate)",
    ],
  },
  {
    id: "iitg",
    role: "Summer Research Intern",
    org: "IIT Guwahati — under Dr. Himanshu Gupta",
    kind: "Research",
  },
  {
    id: "cdac",
    role: "AI & Data Science Programme",
    org: "C-DAC Patna",
    kind: "Training",
    period: "Dec 2025 – Jan 2026",
  },
  {
    id: "bserc",
    role: "Intern",
    org: "Bharat Space Education Research Centre",
    kind: "Internship",
  },
  {
    id: "hotel",
    role: "Assistant Manager",
    org: "A.R. Hotel & Restaurant",
    kind: "Work",
    period: "Jul 2022 – Dec 2024 · 29 months",
  },
];

/* ---------- Education ---------- */

export const education = [
  {
    id: "msdsm",
    degree: "MS Data Science & Management",
    school: "IIT Ropar × IIM Amritsar",
    period: "2025 – 2027",
    current: true,
    note: "Joint programme pairing data science with management.",
  },
  {
    id: "btech",
    degree: "B.Tech, Computer Science",
    school: "Lovely Professional University",
    period: "2018 – 2022",
    current: false,
    note: "Undergraduate degree in computer science and engineering.",
  },
];
