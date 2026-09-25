export type ExperienceRole = {
  company: string;
  title: string;
  period: string;
  highlights: string[];
};

export type ProjectCaseStudy = {
  problem: string;
  solution: string;
  architecture: string;
  features: string[];
  technology: string[];
  challenges: string[];
  outcome: string;
};

export type Project = {
  id: string;
  name: string;
  stack: string[];
  description: string;
  keyFeatures: string[];
  missionObjective: string;
  liveDemo: string | null;
  github: string | null;
  caseStudy: ProjectCaseStudy;
  /** Visual archetype for garage staging */
  archetype:
    | "showroom"
    | "logistics"
    | "medtech"
    | "comms"
    | "crm"
    | "portal";
};

export type Education = {
  degree: string;
  institution: string;
  period: string;
};

export type LocationId =
  | "engineering-hq"
  | "dev-lab"
  | "project-garage"
  | "ai-lab"
  | "performance-center"
  | "university"
  | "connect-hub";

export type WorldLocation = {
  id: LocationId;
  name: string;
  shortName: string;
  district: string;
  interactionLabel: string;
  position: [number, number, number];
  /** Camera approach position when entering */
  approachCam: [number, number, number];
  /** Look-at when arriving */
  lookAt: [number, number, number];
  radius: number;
  mapColor: string;
};

export type Mission = {
  id: string;
  number: string;
  title: string;
  objective: string;
  reward: string;
  locationId: LocationId;
};

export type GraphicsQuality = "auto" | "low" | "medium" | "high";

/** In-world systems — not webpage sections */
export type WorldSystem =
  | "none"
  | "experience"
  | "projects"
  | "project-detail"
  | "skills"
  | "ai"
  | "performance"
  | "education"
  | "contact"
  | "pause"
  | "missions";

export type WorldMode = "explore" | "transit" | "interior";

/** @deprecated use WorldSystem */
export type PanelType = WorldSystem;
