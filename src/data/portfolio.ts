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
  period?: string; // only verified dates
  title: string;
  org: string;
  summary: string;
  details: string[];
}

export const journey: Milestone[] = [
  {
    id: "btech",
    state: "done",
    period: "2018 – 2022",
    title: "B.Tech in Computer Science",
    org: "Lovely Professional University",
    summary:
      "Foundations in programming, data structures, databases and software engineering.",
    details: [
      "Built the computing fundamentals that later carried into data engineering and machine learning work.",
    ],
  },
  {
    id: "hotel",
    state: "done",
    period: "Jul 2022 – Dec 2024",
    title: "Assistant Manager",
    org: "A.R. Hotel & Restaurant",
    summary:
      "Ran day-to-day hotel and restaurant operations for 29 months.",
    details: [
      "Worked where operational decisions have immediate business consequences — the context I now bring to analytics problems.",
    ],
  },
  {
    id: "research",
    state: "done",
    title: "Internships & research",
    org: "C-DAC Patna · Bharat Space Education Research Centre · Annam.AI, IIT Ropar · IIT Guwahati",
    summary:
      "Moved into applied data science through training, research and production engineering work.",
    details: [
      "C-DAC Patna — AI & Data Science training programme (Dec 2025 – Jan 2026).",
      "Bharat Space Education Research Centre — internship.",
      "Annam.AI, IIT Ropar — Data Analyst intern (May – Jul 2026); built a production telemetry reconstruction pipeline on AWS.",
      "IIT Guwahati — summer research internship under Dr. Himanshu Gupta.",
    ],
  },
  {
    id: "msdsm",
    state: "current",
    period: "2025 – 2027",
    title: "MS Data Science & Management",
    org: "IIT Ropar × IIM Amritsar",
    summary:
      "A joint programme combining machine learning and statistics with management and business strategy.",
    details: [
      "Coursework spans predictive analytics, big data and visualisation, marketing research, and data security, privacy and ethics.",
    ],
  },
  {
    id: "next",
    state: "future",
    period: "From 2027",
    title: "Next: analytics & ML roles",
    org: "Data Analyst · Business Analyst · Machine Learning Engineer",
    summary:
      "The role I'm working toward: turning data into decisions inside a product, consulting or analytics team.",
    details: [
      "Open to full-time opportunities after graduation.",
    ],
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

export type ProjectVisual = "telemetry" | "taxi" | "retail" | "supply";

export interface Project {
  id: string;
  title: string;
  summary: string;
  visual: ProjectVisual;
  tech: string[];
  highlights: string[];
  /** Only verified numbers. */
  metrics?: { label: string; value: string }[];
  /** Set to a URL to show the button. */
  repoUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  context?: string;
}

export const projects: Project[] = [
  {
    id: "telemetry",
    featured: true,
    title: "IoT weather sensor telemetry reconstruction",
    context: "Annam.AI, IIT Ropar · deployed in production",
    summary:
      "A machine learning pipeline that reconstructs missing telemetry across 143 IoT weather sensors and writes the repaired series back to production storage.",
    visual: "telemetry",
    tech: ["Python", "Pandas", "LightGBM", "XGBoost", "Scikit-learn", "AWS"],
    highlights: [
      "Handles irregular sensor transmissions and resamples every station to a 5-minute frequency.",
      "Classifies each gap by length and picks a strategy: interpolation for micro gaps, an ML ensemble for short gaps, neighbour-assisted reconstruction for long ones.",
      "Feature engineering on time, lag and neighbouring-station signals, with model evaluation against held-out data.",
      "Runs on AWS (Fargate, EventBridge, DynamoDB) and writes reconstructed rows back idempotently.",
    ],
    metrics: [
      { label: "LightGBM RMSE", value: "0.7252" },
      { label: "R²", value: "0.9911" },
      { label: "Outage events detected", value: "136" },
      { label: "Sensors covered", value: "143" },
    ],
    repoUrl: undefined,
    demoUrl: undefined,
  },
  {
    id: "taxi",
    title: "NYC taxi network analytics",
    summary:
      "Analyses taxi transportation patterns, geographic demand and the network relationships between pickup and drop-off zones.",
    visual: "taxi",
    tech: ["Python", "SQL", "Graph analytics", "Data visualization"],
    highlights: [
      "Models zones as nodes and trips as weighted edges to study how demand moves through the city.",
      "Explores demand by geography and time.",
    ],
    repoUrl: undefined,
    demoUrl: undefined,
  },
  {
    id: "retail",
    title: "Retail business intelligence dashboard",
    summary:
      "A BI dashboard that helps management follow sales performance, KPIs and operational trends.",
    visual: "retail",
    tech: ["Tableau", "Excel", "Business analytics"],
    highlights: [
      "KPI views for sales performance and operational trends.",
      "Designed for managers who need the answer, not the raw table.",
    ],
    repoUrl: undefined,
    demoUrl: undefined,
  },
  {
    id: "supply",
    title: "Global supply chain network analysis",
    summary:
      "Explores supply chain networks — connections, dependencies and the operational structure behind them.",
    visual: "supply",
    tech: ["Python", "SQL", "Network analysis", "Data visualization"],
    highlights: [
      "Maps suppliers and flows as a network to surface dependencies.",
      "Visualises how the structure of the chain shapes operations.",
    ],
    repoUrl: undefined,
    demoUrl: undefined,
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
      "Built and deployed the telemetry reconstruction pipeline for 143 IoT weather stations, now running in production.",
      "Moved the pipeline from a notebook to a cost-optimised AWS deployment with Terraform, Docker and a design document.",
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
