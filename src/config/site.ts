/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit this file to update personal links.
 * ─────────────────────────────────────────────────────────────
 *  Values can also be overridden with environment variables
 *  (see .env.example). Env vars win over the defaults below.
 */

export const siteConfig = {
  name: "Vishal",
  fullName: "Kumar Vishal",
  title: "Vishal — Data Science & Analytics Portfolio",
  description:
    "Portfolio of Kumar Vishal, MS Data Science & Management student at IIT Ropar × IIM Amritsar. Data analytics, business analytics and machine learning projects.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-portfolio.vercel.app",
  location: "Patna, Bihar, India",

  /** GitHub username used for the live repository showcase. */
  githubUsername:
    process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "Kumarvishal1225nn",

  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kumar.vishal.iitropar@gmail.com",
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ??
    "https://www.linkedin.com/in/kumar-vishal-73aa69236/",

  /** Put your resume at /public/resume/Vishal_Resume.pdf */
  resumePath: "/resume/Vishal_Resume.pdf",

  /** Replace /public/images/profile.jpg to change the hero photo. */
  profileImage: "/images/profile.jpg",

  /**
   * Contribution graph image (third-party, public). Set to false to hide.
   * Rendered from ghchart.rshah.org using your username.
   */
  showContributionGraph: true,
} as const;

export const githubUrl = `https://github.com/${siteConfig.githubUsername}`;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
