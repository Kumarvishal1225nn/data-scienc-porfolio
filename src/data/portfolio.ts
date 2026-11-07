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
    org: "C-DAC · BSERC · IIT Ropar · Annam.AI",
    summary: "From training to a production ML pipeline.",
    details: [
      "C-DAC Patna — AI & Data Science (Dec 2025 – Jan 2026)",
      "Bharat Space Education Research Centre — intern",
      "IIT Ropar — summer research, Prof. Abhilasha Nanda",
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
    skills: ["Python", "SQL", "R"],
  },
  {
    name: "Data analytics",
    note: "Cleaning, exploring, reporting",
    icon: "table",
    skills: ["Advanced Excel", "Power BI", "DAX", "Tableau", "Pandas", "NumPy", "Data modeling", "Exploratory data analysis", "Data visualization"],
  },
  {
    name: "Machine learning",
    note: "Modelling and evaluation",
    icon: "brain",
    skills: ["Statistics", "Scikit-learn", "LightGBM", "XGBoost", "Random Forest", "Anomaly detection", "NLP", "Time series analysis"],
  },
  {
    name: "Databases & cloud",
    note: "Storing and serving data",
    icon: "database",
    skills: ["AWS", "Docker", "PostgreSQL", "Neo4j"],
  },
  {
    name: "Tools",
    note: "Day-to-day workflow",
    icon: "wrench",
    skills: ["Jupyter Notebook", "Git", "GitHub"],
  },
  {
    name: "Business",
    note: "Turning analysis into decisions",
    icon: "briefcase",
    skills: ["Requirements analysis", "Root-cause analysis", "Data storytelling", "Stakeholder management", "Ownership"],
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
  | "risk"
  | "sentiment";

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
    tech: ["Python", "LightGBM", "XGBoost", "AWS", "Docker", "DynamoDB"],
    headline: { value: "143", label: "IoT sensors" },
    highlights: [
      "Every station resampled to 5-minute intervals",
      "Gap length picks the method: interpolation → ML ensemble → neighbour stations",
      "Docker on AWS Fargate + EventBridge, Terraform; idempotent DynamoDB write-back",
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
    title: "Tourism demand forecasting",
    context: "Dissertation",
    tagline: "Seasonal tourist traffic: clusters, anomalies and forecasts.",
    visual: "tourism",
    category: "Machine learning",
    tech: ["Python", "K-Means", "Isolation Forest", "ARIMA"],
    headline: { value: "100,000", label: "vehicle records" },
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
    tagline: "Sales KPIs by branch, product line and month — in SQL.",
    visual: "walmart",
    category: "Analytics",
    tech: ["SQL", "Business analytics"],
    headline: { value: "10K+", label: "transactions" },
    highlights: [
      "Joins, aggregations and GROUP BY across 10,000+ transactions",
      "Found seasonal peaks and under-performing categories",
      "KPI-based recommendations on branch focus and product mix",
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
      "Integrated CPCB and OpenAQ data for Indian cities",
      "Gap-filled missing readings, then forecast",
      "Interactive dashboard on top",
    ],
  },
  {
    id: "risk",
    title: "Portfolio analytics & risk",
    tagline: "Returns, volatility, Sharpe and drawdown in one Power BI view.",
    visual: "risk",
    category: "BI dashboards",
    tech: ["Python", "SQL", "Power BI", "DAX"],
    highlights: ["Data model + DAX measures in Power BI", "Tracks returns, volatility, Sharpe ratio and drawdown", "Analysis done in Python and SQL"],
  },
  {
    id: "sentiment",
    title: "Text sentiment analysis",
    context: "C-DAC Patna",
    tagline: "Reads text and labels it positive or negative.",
    visual: "sentiment",
    category: "Machine learning",
    tech: ["Python", "NLP", "TF-IDF", "Linear SVM"],
    highlights: ["NLP preprocessing → TF-IDF features", "Linear SVM classifier, tested on unseen text"],
    repoUrl: "https://github.com/Kumarvishal1225nn/Text-Sentiment-Analysis",
  },
  {
    id: "taxi",
    title: "NYC taxi analytics",
    tagline: "Finding the city's high-traffic hubs and corridors.",
    visual: "taxi",
    category: "Analytics",
    tech: ["Tableau", "Neo4j", "Graph analytics"],
    headline: { value: "263", label: "city zones" },
    highlights: ["Trips analysed across all 263 NYC taxi zones", "Neo4j graph: zones as nodes, trips as edges", "Tableau visuals of hubs and corridors"],
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
  /** Optional photo shown at the top of the card. Files live in /public/images/experience/. */
  photo?: { src: string; alt: string; position?: string };
}

export const experience: ExperienceItem[] = [
  {
    id: "annam",
    role: "Data Analyst Intern",
    org: "Annam.AI, IIT Ropar",
    photo: { src: "/images/experience/annam.jpg", alt: "Vishal at the Annam.AI office, IIT Ropar", position: "60% 45%" },
    kind: "Internship",
    period: "May 2026 – Jul 2026",
    points: [
      "Shipped a production pipeline filling telemetry gaps for ~143 IoT stations",
      "3-tier engine: interpolation → LightGBM + RF ensemble → inverse-distance weighting",
      "AWS: Docker on Fargate, EventBridge, Terraform — cut cost by replacing a Step Functions fan-out",
      "Idempotent DynamoDB write-back, anomaly checks, 26-page design doc",
    ],
  },
  {
    id: "iitg",
    role: "Summer Research Intern",
    org: "IIT Ropar — under Prof. Abhilasha Nanda",
    photo: { src: "/images/experience/iit-ropar-research.jpg", alt: "Vishal with Prof. Abhilasha Nanda at IIT Ropar", position: "50% 30%" },
    kind: "Research",
  },
  {
    id: "cdac",
    role: "AI & Data Science Trainee",
    org: "C-DAC Patna",
    kind: "Training",
    period: "Dec 2025 – Jan 2026",
    points: ["Certified training: Python, Pandas, NumPy, EDA, ML", "Built an NLP text sentiment classifier"],
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
    points: ["Ran kitchen, service and front-desk operations", "Forecast stock demand to cut wastage and stock-outs", "Root-cause analysis of guest complaints → new workflows"],
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

/* ---------- Certifications & responsibilities ---------- */

export const certifications: { name: string; issuer?: string }[] = [
  { name: "SQL for Data Analytics", issuer: "Internshala" },
  { name: "Power BI Data Modeling with DAX" },
  { name: "Excel Analytics" },
  { name: "McKinsey Forward Program", issuer: "McKinsey & Company" },
];

export const responsibilities = [
  {
    role: "Mess Committee Coordinator",
    org: "IIT Ropar",
    point: "Turned recurring student complaints into menu and service changes.",
  },
];
