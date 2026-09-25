import type {
  Education,
  ExperienceRole,
  Mission,
  Project,
  WorldLocation,
} from "@/types/portfolio";

export const PROFILE = {
  name: "Karanvir Singh",
  title: "Full-Stack Engineer",
  subtitle: "MERN Stack Developer",
  experienceYears: "4+",
  tagline: "Explore Karanvir's Developer World.",
  cityName: "KARANVIR CITY",
  worldCodename: "KARANVIR // DEVELOPER WORLD",
  systemId: "KARANVIR.SINGH",
  stackLine: "REACT • NEXT.JS • NODE.JS • TYPESCRIPT",
  email: "karanvir011998@gmail.com",
  phone: "+91 8437333427",
  phoneHref: "tel:+918437333427",
  emailHref: "mailto:karanvir011998@gmail.com",
  linkedin: "https://www.linkedin.com/in/karanvir-singh-a72a61196/",
  github: "https://github.com/karanvirsingh011998",
  contactQuote: "Let's build something worth shipping.",
  aiStatement:
    "I use AI to accelerate development while keeping architecture, engineering decisions and code quality human-driven.",
} as const;

/** Hero rotating roles — fixed slot, no layout shift */
export const HERO_ROLES = [
  "FULL-STACK ENGINEER",
  "MERN STACK DEVELOPER",
  "NEXT.JS DEVELOPER",
  "FRONTEND ENGINEER",
  "BACKEND ENGINEER",
  "REACT DEVELOPER",
  "TYPESCRIPT DEVELOPER",
  "AI APPLICATION DEVELOPER",
  "GENERATIVE AI DEVELOPER",
  "PRODUCT ENGINEER",
] as const;

export const EXPERIENCE: ExperienceRole[] = [
  {
    company: "Lumino Guru",
    title: "Software Engineer (MERN)",
    period: "Nov 2024 — Present",
    highlights: [
      "React.js",
      "Next.js",
      "SSR / SSG",
      "Component architecture",
      "REST APIs",
      "Performance optimization",
      "Code splitting",
      "Lazy loading",
      "Memoization",
      "Code reviews",
      "Mentoring",
      "Production debugging",
    ],
  },
  {
    company: "Wits Innovation Lab",
    title: "MERN Stack Developer",
    period: "May 2022 — Oct 2024",
    highlights: [
      "MERN applications",
      "REST APIs",
      "JWT",
      "OAuth",
      "RBAC",
      "Admin dashboards",
      "MongoDB",
      "Socket.io",
      "CI/CD",
      "Vercel",
      "Render",
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "jc-automax-admin",
    name: "JC Automax — Admin Portal",
    stack: ["React", "Node.js", "MongoDB", "Tailwind", "shadcn/ui"],
    description:
      "Admin portal for managing automotive business operations with a modern React interface and Node.js backend.",
    keyFeatures: ["INVENTORY", "USERS", "PARTNERS", "RBAC", "ANALYTICS"],
    missionObjective:
      "Build a complete management system for vehicles, users and partners.",
    liveDemo: null,
    github: null,
    archetype: "showroom",
    caseStudy: {
      problem:
        "Operations needed a centralized admin surface for managing automotive business data and workflows.",
      solution:
        "Built a React admin portal backed by Node.js and MongoDB with a Tailwind and shadcn/ui component system.",
      architecture:
        "React SPA communicating with Node.js REST APIs and MongoDB for persistent operational data.",
      features: [
        "Admin dashboards",
        "CRUD workflows",
        "Responsive layout",
        "Reusable UI primitives",
      ],
      technology: ["React", "Node.js", "MongoDB", "Tailwind", "shadcn/ui"],
      challenges: [
        "Structuring reusable admin components",
        "Keeping API contracts consistent across modules",
      ],
      outcome:
        "Delivered an operational admin portal for day-to-day automotive business management.",
    },
  },
  {
    id: "jc-automax-web",
    name: "JC Automax — Main Website",
    stack: ["React", "Tailwind"],
    description:
      "Public-facing marketing and information website for JC Automax built with React and Tailwind.",
    keyFeatures: ["LANDING", "BRAND", "RESPONSIVE", "SECTIONS"],
    missionObjective:
      "Ship a modern public web presence for automotive services and brand identity.",
    liveDemo: null,
    github: null,
    archetype: "portal",
    caseStudy: {
      problem:
        "The business needed a modern public website to present services and brand identity.",
      solution:
        "Designed and implemented a React site with Tailwind for responsive presentation.",
      architecture:
        "Client-rendered React application with modular page sections and utility-first styling.",
      features: [
        "Landing experience",
        "Responsive breakpoints",
        "Reusable content blocks",
      ],
      technology: ["React", "Tailwind"],
      challenges: [
        "Balancing visual polish with maintainable component structure",
      ],
      outcome: "Shipped a polished public website for JC Automax.",
    },
  },
  {
    id: "postkodes",
    name: "Postkodes",
    stack: ["MERN"],
    description:
      "Full-stack MERN application built for shipping and logistics-oriented workflows.",
    keyFeatures: ["ROUTES", "PACKAGES", "TRACKING", "API LAYER"],
    missionObjective:
      "Deliver end-to-end postal and logistics workflows on a MERN stack.",
    liveDemo: null,
    github: null,
    archetype: "logistics",
    caseStudy: {
      problem:
        "Needed a full-stack application supporting product workflows around postal and delivery use cases.",
      solution:
        "Implemented a MERN stack application spanning MongoDB, Express, React, and Node.js.",
      architecture:
        "React frontend with Express REST APIs and MongoDB persistence.",
      features: [
        "End-to-end MERN delivery",
        "REST API integration",
        "Persistent data models",
      ],
      technology: ["MongoDB", "Express", "React", "Node.js"],
      challenges: [
        "Coordinating frontend state with backend data contracts",
      ],
      outcome: "Delivered a working MERN application for the Postkodes product surface.",
    },
  },
  {
    id: "flahyhealth",
    name: "Flahyhealth",
    stack: ["Next.js", "Node.js"],
    description:
      "Health-focused web application built with Next.js on the frontend and Node.js services.",
    keyFeatures: ["SSR ROUTES", "SERVICES", "HEALTH UI", "API BRIDGE"],
    missionObjective:
      "Build a health-focused Next.js application with Node.js service integration.",
    liveDemo: null,
    github: null,
    archetype: "medtech",
    caseStudy: {
      problem:
        "Required a modern web application for health-related product experiences.",
      solution:
        "Built with Next.js for the web layer and Node.js for backend services.",
      architecture:
        "Next.js frontend with Node.js APIs supporting application workflows.",
      features: [
        "Server-rendered routes where appropriate",
        "API integration",
        "Modular page composition",
      ],
      technology: ["Next.js", "Node.js"],
      challenges: [
        "Structuring Next.js routes and backend boundaries cleanly",
      ],
      outcome: "Shipped Flahyhealth as a Next.js and Node.js application.",
    },
  },
  {
    id: "community-schools",
    name: "Community Schools",
    stack: ["React", "Node.js", "MongoDB", "Socket.io"],
    description:
      "Community and education platform with real-time capabilities powered by Socket.io.",
    keyFeatures: ["LIVE FEED", "SOCKETS", "COMMUNITY", "MERN CORE"],
    missionObjective:
      "Create real-time community interactions for schools.",
    liveDemo: null,
    github: null,
    archetype: "comms",
    caseStudy: {
      problem:
        "Schools and communities needed interactive features that update in real time.",
      solution:
        "Built a MERN application with Socket.io for live communication patterns.",
      architecture:
        "React client, Express/Node services, MongoDB storage, and Socket.io channels.",
      features: [
        "Real-time updates",
        "Community interactions",
        "Full-stack MERN delivery",
      ],
      technology: ["MongoDB", "Express", "React", "Node.js", "Socket.io"],
      challenges: [
        "Keeping Socket.io events aligned with REST data models",
      ],
      outcome:
        "Delivered a community platform with live interaction support.",
    },
  },
  {
    id: "encapsulate-crm",
    name: "Encapsulate CRM Integration",
    stack: ["Next.js", "Node.js", "Capsule CRM API"],
    description:
      "CRM integration layer connecting product workflows with Capsule CRM through Next.js and Node.js.",
    keyFeatures: ["CRM SYNC", "API ORCH", "ENTITIES", "WORKFLOWS"],
    missionObjective:
      "Connect product workflows to Capsule CRM through a reliable integration layer.",
    liveDemo: null,
    github: null,
    archetype: "crm",
    caseStudy: {
      problem:
        "Product workflows needed reliable integration with Capsule CRM data and actions.",
      solution:
        "Implemented CRM integration using Next.js, Node.js, and the Capsule CRM API.",
      architecture:
        "Next.js UI and Node.js services mediating Capsule CRM API requests.",
      features: [
        "CRM data sync patterns",
        "API orchestration",
        "Integration-focused UI flows",
      ],
      technology: ["Next.js", "Node.js", "Capsule CRM API"],
      challenges: [
        "Mapping product domain models to Capsule CRM entities",
        "Handling external API constraints safely",
      ],
      outcome:
        "Delivered Encapsulate CRM integration connecting application workflows to Capsule CRM.",
    },
  },
];

export const SKILLS = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "MongoDB",
  "Express",
  "Tailwind",
  "shadcn/ui",
  "Redux",
  "Zustand",
  "React Query",
  "Socket.io",
  "JWT",
  "OAuth",
  "Git",
  "GitHub",
  "Vercel",
  "Render",
] as const;

export const ARCHITECTURE_FLOW = [
  "React",
  "Next.js",
  "Node.js",
  "MongoDB",
] as const;

export const ARCHITECTURE_SIDES = [
  "REST APIs",
  "Authentication",
  "RBAC",
  "Socket.io",
] as const;

export const AI_NODES = [
  "LLMs",
  "Prompt Engineering",
  "AI Code Generation",
  "Debugging",
  "Refactoring",
  "Testing",
  "Documentation",
] as const;

export const AI_TOOLS = [
  "Cursor",
  "Claude",
  "Lovable",
  "Replit",
  "CodeRabbit",
] as const;

export const AI_WORKFLOW = [
  "IDEA",
  "PROMPT",
  "IMPLEMENT",
  "DEBUG",
  "TEST",
  "REFACTOR",
  "SHIP",
] as const;

export const PERFORMANCE_TOPICS = [
  "Code Splitting",
  "Lazy Loading",
  "Memoization",
  "API Optimization",
  "Database Query Optimization",
  "SSR",
  "SSG",
  "Core Web Vitals",
  "SEO",
] as const;

export const EDUCATION: Education[] = [
  {
    degree: "MCA",
    institution: "Punjab Technical University",
    period: "2018 — 2020",
  },
  {
    degree: "BCA",
    institution: "Panjab University",
    period: "2015 — 2018",
  },
];

/** Compact city layout — positions in world units */
export const LOCATIONS: WorldLocation[] = [
  {
    id: "engineering-hq",
    name: "Engineering HQ",
    shortName: "HQ",
    district: "ENGINEERING DISTRICT",
    interactionLabel: "ENTER EXPERIENCE",
    position: [-18, 0, -14],
    approachCam: [-18, 6, -4],
    lookAt: [-18, 3, -14],
    radius: 4.5,
    mapColor: "#5b8def",
  },
  {
    id: "project-garage",
    name: "Project Garage",
    shortName: "Garage",
    district: "BUILD DISTRICT",
    interactionLabel: "ENTER GARAGE",
    position: [18, 0, -12],
    approachCam: [18, 5, -2],
    lookAt: [18, 2, -12],
    radius: 5,
    mapColor: "#f0a46e",
  },
  {
    id: "dev-lab",
    name: "Dev Lab",
    shortName: "Dev Lab",
    district: "STACK DISTRICT",
    interactionLabel: "ENTER DEV LAB",
    position: [-16, 0, 12],
    approachCam: [-16, 5, 20],
    lookAt: [-16, 3, 12],
    radius: 4.5,
    mapColor: "#3dd6c6",
  },
  {
    id: "ai-lab",
    name: "AI Lab",
    shortName: "AI Lab",
    district: "RESEARCH DISTRICT",
    interactionLabel: "ENTER AI LAB",
    position: [16, 0, 14],
    approachCam: [16, 5, 22],
    lookAt: [16, 3, 14],
    radius: 4.5,
    mapColor: "#a78bfa",
  },
  {
    id: "performance-center",
    name: "Performance Center",
    shortName: "Perf",
    district: "OPTIMIZATION DISTRICT",
    interactionLabel: "ENTER PERFORMANCE",
    position: [0, 0, -20],
    approachCam: [0, 6, -10],
    lookAt: [0, 3, -20],
    radius: 4.5,
    mapColor: "#4ade80",
  },
  {
    id: "university",
    name: "University",
    shortName: "Edu",
    district: "ARCHIVES DISTRICT",
    interactionLabel: "ENTER EDUCATION",
    position: [-8, 0, 20],
    approachCam: [-8, 5, 28],
    lookAt: [-8, 2.5, 20],
    radius: 4,
    mapColor: "#fbbf24",
  },
  {
    id: "connect-hub",
    name: "Connect Hub",
    shortName: "Connect",
    district: "SIGNAL DISTRICT",
    interactionLabel: "MAKE CONTACT",
    position: [8, 0, 22],
    approachCam: [8, 5, 30],
    lookAt: [8, 3, 22],
    radius: 4.5,
    mapColor: "#fb7185",
  },
];

export const MISSIONS: Mission[] = [
  {
    id: "mission-01",
    number: "01",
    title: "Meet the Engineer",
    objective: "Visit Engineering HQ.",
    reward: "View Experience",
    locationId: "engineering-hq",
  },
  {
    id: "mission-02",
    number: "02",
    title: "Explore the Stack",
    objective: "Visit Dev Lab.",
    reward: "View Skills",
    locationId: "dev-lab",
  },
  {
    id: "mission-03",
    number: "03",
    title: "Enter the Garage",
    objective: "Explore Karanvir's projects.",
    reward: "View Projects",
    locationId: "project-garage",
  },
  {
    id: "mission-04",
    number: "04",
    title: "AI Research",
    objective: "Visit AI Lab.",
    reward: "Explore AI Workflow",
    locationId: "ai-lab",
  },
  {
    id: "mission-05",
    number: "05",
    title: "Make Contact",
    objective: "Reach Connect Hub.",
    reward: "Contact Karanvir",
    locationId: "connect-hub",
  },
];

export const SPAWN_POSITION: [number, number, number] = [0, 0.9, 6];

export const DISTRICT_LABELS = [
  { text: "EXPERIENCE", position: [-18, 0, -14] as [number, number, number] },
  { text: "PROJECTS", position: [18, 0, -12] as [number, number, number] },
  { text: "TECH STACK", position: [-16, 0, 12] as [number, number, number] },
  { text: "AI LAB", position: [16, 0, 14] as [number, number, number] },
  { text: "PERFORMANCE", position: [0, 0, -20] as [number, number, number] },
  { text: "EDUCATION", position: [-8, 0, 20] as [number, number, number] },
  { text: "CONTACT", position: [8, 0, 22] as [number, number, number] },
];
