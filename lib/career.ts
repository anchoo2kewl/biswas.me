// Public career narrative. Team-size metrics intentionally belong only in the resume.
export type CareerChapter = {
  id: string; year: string; period: string; company: string; title: string;
  chapter: string; description: string; highlights: string[]; tags: string[];
  image: string; link?: string; note?: string; current?: boolean;
};

export const career: CareerChapter[] = [
  {
    id: "elastio", year: "2025", period: "Jan 2025 – Present", company: "Elastio", title: "VP of Engineering", chapter: "Security & resilience", current: true,
    description: "Building cloud-native ransomware detection, database security, and data protection. Leading through engineering managers while staying close to the systems we ship.",
    highlights: [
      "Developed patent-pending database-security technology for detecting database encryption and corruption.",
      "Bring the team-building and hiring experience developed at Veeva to recruiting and developing engineers and engineering managers at Elastio.",
      "Architect malware-scanning engines and AI-powered anomaly detection across enterprise backup and recovery workflows.",
      "Scale AWS and Azure security infrastructure for enterprise platforms with 99.99% uptime SLAs."
    ],
    tags: ["Patent-pending database security", "Hiring & team development", "Cloud resilience"], image: "/work-elastio.svg", link: "https://elastio.com"
  },
  {
    id: "veeva", year: "2024", period: "Mar 2024 – Jan 2025", company: "Veeva Systems", title: "Senior Engineering Manager", chapter: "A team, built from scratch",
    description: "Built the engineering team from scratch—hiring and developing engineers and managers to deliver contact-center capabilities in Veeva CRM.",
    highlights: [
      "Built the team from the ground up through hiring, onboarding, coaching, and manager development.",
      "Owned the full product delivery lifecycle for contact-center capabilities in Veeva CRM across global enterprise deployments.",
      "Carried this hands-on team-building and hiring experience into engineering leadership at Elastio."
    ],
    tags: ["Built from scratch", "Hiring & coaching", "Enterprise delivery"], image: "/work-veeva.svg", link: "https://veeva.com"
  },
  {
    id: "ibm", year: "2017", period: "Jul 2017 – Mar 2024", company: "IBM Turbonomic", title: "Senior Engineering Manager", chapter: "AI meets cloud infrastructure",
    description: "Grew from software engineer to engineering manager to senior engineering manager, building cloud orchestration, performance monitoring, and enterprise integrations.",
    highlights: [
      "Led globally distributed teams through multiple engineering managers, connecting technical direction with product delivery.",
      "Applied Granite LLMs to enterprise threat identification and automated code analysis.",
      "Reduced onboarding time 60% through DevOps automation and built high-throughput enterprise integrations."
    ],
    note: "Progression: Senior Software Engineer → Engineering Manager (2018) → Senior Engineering Manager (2021).",
    tags: ["AI & cloud", "Distributed systems", "Growing engineering leaders"], image: "/04.png", link: "https://www.ibm.com/products/turbonomic"
  },
  {
    id: "trend-micro", year: "2016", period: "2016 – 2017", company: "Trend Micro", title: "Senior Software Engineer", chapter: "Cloud security, hands-on",
    description: "Built cloud-security systems and online database migration tools, bringing security and reliability into the engineering of everyday operations.",
    highlights: ["Built distributed cloud-security systems for enterprise workloads.", "Developed online database migration tools enabling zero-downtime updates."],
    tags: ["Cloud security", "Database migration"], image: "/03.png", link: "https://trendmicro.com"
  },
  {
    id: "nearest", year: "2012", period: "2012 – 2014", company: "Nearest.com", title: "CTO & Co-Founder", chapter: "The startup chapter",
    description: "Co-founded and built location-search infrastructure. A startup chapter in turning a product idea into systems that work under real demand.",
    highlights: ["Architected fault-tolerant, autoscaling infrastructure on AWS and OpenStack.", "Built location-search systems serving millions of queries."],
    tags: ["Co-founder", "Product architecture", "AWS & OpenStack"], image: "/02.png"
  },
  {
    id: "carleton", year: "2011", period: "2011 – 2019", company: "Carleton University", title: "PhD, Electrical & Computer Engineering", chapter: "Research alongside the craft",
    description: "Studied how machine learning can improve cloud middleware performance. Research that still shapes how I think about distributed systems and practical AI.",
    highlights: ["Completed a PhD in Electrical & Computer Engineering in 2019.", "Researched machine learning for cloud middleware performance optimization.", "Pursued research alongside startup and engineering work; the dates overlap intentionally."],
    tags: ["Machine learning", "Cloud research"], image: "/01.png", link: "https://carleton.ca"
  },
  {
    id: "foundations", year: "2007", period: "2007 – 2012", company: "Early engineering roles", title: "TCS · Global Travel Solution · 2PiRad", chapter: "Where it started",
    description: "From communication systems and airline booking to enterprise SAP BI. The foundations of a career spent building software and asking how systems work.",
    highlights: ["Engineering work in communication systems beginning in 2007.", "Built airline reservation software at Global Travel Solution in 2009.", "Worked on enterprise SAP BI at Tata Consultancy Services from 2009 to 2012."],
    tags: ["Systems foundations", "Enterprise software"], image: "/concept-travel.svg"
  }
];
