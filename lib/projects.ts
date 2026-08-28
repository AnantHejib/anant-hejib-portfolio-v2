export type Project = {
  id: string;
  slug: string;
  type: string;
  status: string;
  title: string;
  headline: string;
  copy: string;
  challenge: string;
  approach: string;
  impact: string;
  outputs: string[];
  tags: string[];
  architecture: string[];
  proof: string;
  proofLabel: string;
  reportPath?: string;
  visual: "mapping" | "evasion" | "protocol" | "vision";
};

export const projects: Project[] = [
  {
    id: "01",
    slug: "autonomous-drone-mapping",
    type: "SPACE ROBOTICS / IRoC-U 2026",
    status: "FINALIST SYSTEM",
    title: "Autonomous Drone Mapping",
    headline: "Turning raw aerial imagery into a mission-ready terrain map.",
    copy: "A post-mission reconstruction pipeline for 12-metre lawnmower flights. It rejects weak frames, identifies stable overlap and constructs a unified orthomosaic.",
    challenge: "Aerial sequences contain blur, repeated terrain and inconsistent overlap. The system needed to recover a useful map from constrained flight data without treating every frame as equally reliable.",
    approach: "Quality gates remove blurred frames before SIFT features and FLANN matching establish candidate correspondences. Lowe’s ratio test reduces ambiguity, then RANSAC estimates robust homographies for perspective-aligned stitching.",
    impact: "Designed for high-fidelity recovery under edge-compute and flight-data constraints, and presented as part of an ISRO IRoC-U 2026 finalist system.",
    outputs: ["Laplacian blur rejection and keyframe selection", "SIFT / FLANN correspondence pipeline", "RANSAC homography and perspective-aligned stitching"],
    tags: ["PYTHON", "OPENCV", "SIFT", "RANSAC"],
    architecture: ["FLIGHT FRAMES", "QUALITY GATE", "FEATURE MATCH", "HOMOGRAPHY", "ORTHOMOSAIC"],
    proof: "https://github.com/AnantHejib/Drone_mapping",
    proofLabel: "Open full system report",
    reportPath: "/projects/autonomous-drone-mapping/technical-report",
    visual: "mapping",
  },
  {
    id: "02",
    slug: "boundary-evasion-gcs",
    type: "REAL-TIME AUTONOMY",
    status: "PUBLIC BUILD",
    title: "Boundary Evasion GCS",
    headline: "A vision loop that sees a boundary and produces an escape vector.",
    copy: "A live ground-control experience coupling an OpenCV perception engine with a Flask telemetry layer and a browser-based operational interface.",
    challenge: "The operator needed more than a camera feed: the system had to convert a detected visual boundary into a clear, normalized response that could be inspected in real time.",
    approach: "HSV segmentation isolates the boundary, contour filtering suppresses noise and the detected geometry is converted into normalized X/Y avoidance vectors. Flask exposes the stream and telemetry to the control interface.",
    impact: "Bridges perception and actionable navigation telemetry in one working loop, making autonomous behavior visible and debuggable to an operator.",
    outputs: ["Contour-based boundary detection and filtering", "Normalized real-time evasion vector calculation", "MJPEG vision stream and 10 Hz telemetry UI"],
    tags: ["PYTHON", "FLASK", "OPENCV", "JAVASCRIPT"],
    architecture: ["CAMERA", "HSV MASK", "CONTOURS", "ESCAPE VECTOR", "GCS"],
    proof: "https://github.com/AnantHejib/boundry-evasion-dash",
    proofLabel: "View technical source",
    visual: "evasion",
  },
  {
    id: "03",
    slug: "digital-legacy-protocol",
    type: "WEB3 / FUSION 2025",
    status: "HACKATHON PROTOTYPE",
    title: "Digital Legacy Protocol",
    headline: "Programmable crypto succession for unexpected loss of access.",
    copy: "A blockchain prototype that lets an owner define a controlled path for digital assets when they can no longer manage their wallet.",
    challenge: "Self-custodied assets can become permanently inaccessible after an unforeseen death. The design needed to preserve owner control while introducing a deliberate beneficiary path.",
    approach: "MetaMask establishes wallet ownership. A smart-contract model records beneficiary intent and governs the conditions under which a succession transfer can become eligible.",
    impact: "Explored a human problem in Web3: continuity of digital ownership without replacing self-custody with a centralized custodian.",
    outputs: ["MetaMask ownership and connection flow", "Beneficiary and succession-condition model", "Smart-contract-driven transfer prototype"],
    tags: ["SOLIDITY", "WEB3", "METAMASK", "BLOCKCHAIN"],
    architecture: ["OWNER", "POLICY", "INACTIVITY CHECK", "CONTRACT", "BENEFICIARY"],
    proof: "https://www.linkedin.com/in/anant-hejib-b277a82a2/",
    proofLabel: "View hackathon record",
    visual: "protocol",
  },
  {
    id: "04",
    slug: "robot-vision-systems",
    type: "INDUSTRIAL ROBOTICS",
    status: "8+ MONTHS INDUSTRY",
    title: "Robot Vision Systems",
    headline: "Computer vision engineered for robots—not demo notebooks.",
    copy: "Industry work at BlackHole Infiverse translating perception requirements into integration-ready computer-vision modules for robotic workflows.",
    challenge: "Robotic perception must survive real input variation, timing constraints and integration boundaries that controlled demonstrations often avoid.",
    approach: "I developed and iterated image-processing and detection workflows around robot-facing requirements, testing each stage as part of an operational pipeline rather than an isolated model.",
    impact: "Eight-plus months of hands-on product engineering across the boundary between software perception and physical robotic systems.",
    outputs: ["Robot-facing image-processing modules", "Detection and perception workflow development", "Iteration against real operational constraints"],
    tags: ["PYTHON", "YOLO", "OPENCV", "ROBOTICS"],
    architecture: ["SENSOR", "PREPROCESS", "DETECTION", "DECISION", "ROBOT"],
    proof: "https://www.linkedin.com/in/anant-hejib-b277a82a2/",
    proofLabel: "Verify experience",
    visual: "vision",
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
