"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/* =========================================================
   PROJECT DATA
========================================================= */

const projects = [
  {
    id: 1,
    title: "SMART TRACE TMT",
    category: "AI VISION • IIoT • TRACEABILITY",
    icon: "🏭",
    type: "factory",
    description:
      "End-to-end vision-based steel traceability system connecting furnace operations to finished TMT production.",
    features: [
      "Furnace monitoring",
      "Ladle identification",
      "Billet tracking",
      "OCR and heat number recognition",
      "QR code generation",
      "PLC and MES integration",
      "Spectrometer data integration",
      "Label printing",
    ],
    technologies: [
      "Python",
      "OpenCV",
      "OCR",
      "PLC",
      "MES",
      "Jetson",
      "IIoT",
    ],
    color: "green",
  },
  {
    id: 2,
    title: "LADLE TRACKING SYSTEM",
    category: "AI VISION • OCR",
    icon: "🔥",
    type: "ladle",
    description:
      "AI vision system for identifying and tracking ladles in high-temperature steel manufacturing environments.",
    features: [
      "Ladle number detection",
      "Industrial camera monitoring",
      "OCR integration",
      "Real-time tracking",
      "Dashboard visualization",
    ],
    technologies: ["Python", "OpenCV", "PaddleOCR", "Industrial Camera"],
    color: "orange",
  },
  {
    id: 3,
    title: "BILLET TRACKING SYSTEM",
    category: "AI VISION • AUTOMATION",
    icon: "▦",
    type: "billet",
    description:
      "Automated billet monitoring and production traceability system using industrial cameras and OCR.",
    features: [
      "Billet identification",
      "OCR-based tracking",
      "Production traceability",
      "Database integration",
      "Edge processing",
    ],
    technologies: ["Python", "OpenCV", "OCR", "Jetson Orin"],
    color: "cyan",
  },
  {
    id: 4,
    title: "FURNACE MONITORING",
    category: "AI VISION • INDUSTRY 4.0",
    icon: "🔥",
    type: "furnace",
    description:
      "Computer vision solution for furnace safety and industrial process monitoring.",
    features: [
      "Real-time furnace monitoring",
      "Safety monitoring",
      "Vision analytics",
      "Process observation",
      "Industrial dashboard integration",
    ],
    technologies: ["AI Vision", "Python", "OpenCV", "IIoT"],
    color: "orange",
  },
  {
    id: 5,
    title: "Parle Biscuits QUALITY INSPECTION",
    category: "AI VISION • QUALITY INSPECTION",
    icon: "🍪",
    type: "vision",
    description:
      "High-speed quality inspection system for Parle Biscuits in industrial food production.",
    features: [
      "Shape validation",
      "Broken piece detection",
      "Crack inspection",
      "Colour variation monitoring",
      "PLC and rejection integration",
    ],
    technologies: ["Baumer Camera", "OpenCV", "PLC", "Edge AI"],
    color: "yellow",
  },
  {
    id: 6,
    title: "STEEL SHEET DEFECT DETECTION",
    category: "AI VISION • QUALITY",
    icon: "◫",
    type: "scan",
    description:
      "AI vision system for identifying scratches, dents and surface abnormalities.",
    features: [
      "Surface defect detection",
      "High-speed inspection",
      "Industrial camera integration",
      "Continuous production monitoring",
    ],
    technologies: ["Basler", "Python", "OpenCV", "AI Vision"],
    color: "blue",
  },
  {
    id: 7,
    title: "FOREIGN PARTICLE DETECTION",
    category: "AI VISION • QUALITY",
    icon: "◉",
    type: "particle",
    description:
      "Machine vision solution for detecting contamination and foreign particles.",
    features: [
      "Foreign particle detection",
      "Quality validation",
      "Industrial vision",
      "Production monitoring",
    ],
    technologies: ["OpenCV", "Python", "AI Vision", "Industrial Camera"],
    color: "purple",
  },
  {
    id: 8,
    title: "INDUSTRIAL OCR SYSTEM",
    category: "AI VISION • TRACEABILITY",
    icon: "🔍",
    type: "ocr",
    description:
      "High-speed OCR system for heat numbers, serial numbers and industrial traceability.",
    features: [
      "Text detection",
      "Heat number recognition",
      "Serial number OCR",
      "Database connectivity",
      "Production traceability",
    ],
    technologies: ["PaddleOCR", "OpenCV", "Python", "Edge AI"],
    color: "cyan",
  },
  {
    id: 9,
    title: "PACKAGING INSPECTION",
    category: "AI VISION • QUALITY",
    icon: "📦",
    type: "package",
    description:
      "Vision-based packaging verification for labels, dimensions and presence checks.",
    features: [
      "Label verification",
      "Presence detection",
      "Dimension checks",
      "Packaging compliance",
    ],
    technologies: ["OpenCV", "Python", "AI Vision", "Automation"],
    color: "green",
  },
  {
    id: 10,
    title: "DIGITAL ANDON DEVICE",
    category: "IIoT • SMART FACTORY",
    icon: "📡",
    type: "andon",
    description:
      "QR-based maintenance ticketing and escalation solution for shop-floor communication.",
    features: [
      "QR-based issue reporting",
      "Maintenance escalation",
      "Real-time alerts",
      "IIoT dashboard",
    ],
    technologies: ["Embedded C", "Python", "IIoT", "Dashboard"],
    color: "green",
  },
  {
    id: 11,
    title: "SMART BIN PICK-TO-LIGHT",
    category: "IIoT • AUTOMATION",
    icon: "💡",
    type: "pick",
    description:
      "Load-cell and wireless validation system for error-proof material picking.",
    features: [
      "Pick validation",
      "Load-cell integration",
      "Wireless communication",
      "Error-proofing",
    ],
    technologies: ["IIoT", "Sensors", "Embedded", "Automation"],
    color: "yellow",
  },
  {
    id: 12,
    title: "ENGRAVING SYSTEM",
    category: "AUTOMATION • DATABASE",
    icon: "✦",
    type: "engrave",
    description:
      "Server-driven engraving system integrated with production databases.",
    features: [
      "Production database integration",
      "Automated engraving workflow",
      "Server connectivity",
      "Manufacturing integration",
    ],
    technologies: ["C#", "SQL", "Automation", "Industrial Systems"],
    color: "purple",
  },
  {
    id: 13,
    title: "MODEL FACTORY AUTOMATION",
    category: "MES • AUTOMATION",
    icon: "⚙",
    type: "factory",
    description:
      "MES-enabled smart factory environment with real-time monitoring.",
    features: [
      "MES integration",
      "Real-time monitoring",
      "Data acquisition",
      "Automated workflows",
    ],
    technologies: ["MES", "PLC", "IIoT", "SCADA"],
    color: "blue",
  },
  {
    id: 14,
    title: "ENERGY MONITORING SYSTEM",
    category: "IIoT • ANALYTICS",
    icon: "⚡",
    type: "energy",
    description:
      "Industrial energy monitoring platform for voltage, current and consumption analysis.",
    features: [
      "Voltage monitoring",
      "Current monitoring",
      "Energy analytics",
      "Consumption trends",
    ],
    technologies: ["C#.NET", "SQL", "IIoT", "Dashboard"],
    color: "yellow",
  },
  {
    id: 15,
    title: "COUNTER DATA MONITORING",
    category: "IIoT • ANALYTICS",
    icon: "📊",
    type: "analytics",
    description:
      "Cloud-connected system for production, rejection and rework monitoring.",
    features: [
      "Production monitoring",
      "Rejection tracking",
      "Rework analytics",
      "Cloud dashboard",
    ],
    technologies: ["C#.NET", "SQL", "Cloud", "IIoT"],
    color: "cyan",
  },
  {
    id: 16,
    title: "AI ROBOTIC ARM",
    category: "AI VISION • ROBOTICS",
    icon: "🦾",
    type: "robot",
    description:
      "Vision-guided robotic system using object detection and intelligent manipulation.",
    features: [
      "Object detection",
      "Vision guidance",
      "Robotic manipulation",
      "Autonomous operation",
    ],
    technologies: ["Python", "OpenCV", "AI", "Robotics"],
    color: "purple",
  },
  {
    id: 17,
    title: "AUTONOMOUS GUIDED VEHICLE",
    category: "IIoT • ROBOTICS",
    icon: "🚚",
    type: "agv",
    description:
      "IIoT-enabled autonomous material handling system.",
    features: [
      "Autonomous navigation",
      "Material handling",
      "Production connectivity",
      "Industrial automation",
    ],
    technologies: ["Robotics", "IIoT", "Sensors", "Automation"],
    color: "green",
  },
  {
    id: 18,
    title: "SOIL TESTING DEVICE",
    category: "PATENT • IIoT • EDGE AI",
    icon: "🌱",
    type: "soil",
    description:
      "Smart agriculture device for rapid soil analysis using IoT and edge computing.",
    features: [
      "Multiple soil parameters",
      "Rapid analysis",
      "Edge computing",
      "IoT connectivity",
    ],
    technologies: ["IoT", "Edge AI", "Embedded Systems", "Sensors"],
    color: "green",
  },
];

/* =========================================================
   SKILLS
========================================================= */

const skills = [
  {
    title: "AI & COMPUTER VISION",
    icon: "◉",
    description:
      "Building real-time machine vision systems for detection, OCR and industrial inspection.",
    skills: [
      "Python",
      "OpenCV",
      "YOLO",
      "TensorFlow",
      "PyTorch",
      "PaddleOCR",
      "Roboflow",
      "Labelme",
      "AI/ML",
    ],
  },
  {
    title: "GENERATIVE AI",
    icon: "✦",
    description:
      "Developing intelligent applications using LLMs, RAG pipelines and vector databases.",
    skills: [
      "OpenAI GPT",
      "LangChain",
      "LlamaIndex",
      "Prompt Engineering",
      "RAG",
      "FAISS",
      "Pinecone",
      "pgvector",
      "ChromaDB",
    ],
  },
  {
    title: "FULL STACK DEVELOPMENT",
    icon: "⌘",
    description:
      "Developing scalable industrial applications from frontend to backend APIs.",
    skills: [
      "React.js",
      "JavaScript",
      "TypeScript",
      "FastAPI",
      "Flask",
      "Django",
      "REST APIs",
      "PostgreSQL",
      "MySQL",
      "SQL Server",
    ],
  },
  {
    title: "IIoT & INDUSTRY 4.0",
    icon: "◈",
    description:
      "Connecting machines, sensors and industrial systems for smart factory solutions.",
    skills: [
      "MQTT",
      "OPC-UA",
      "Modbus",
      "TCP/IP",
      "RS485",
      "RS232",
      "Profinet",
      "LoRaWAN",
      "BLE",
      "Zigbee",
    ],
  },
  {
    title: "AUTOMATION & ROBOTICS",
    icon: "⚙",
    description:
      "Integrating intelligent software with machines, PLCs and robotics.",
    skills: [
      "PLC Integration",
      "MES",
      "SCADA",
      "HMI",
      "Sensors",
      "Robotics",
      "Industrial Automation",
    ],
  },
  {
    title: "EDGE & CLOUD",
    icon: "⬡",
    description:
      "Deploying AI solutions from edge devices to cloud infrastructure.",
    skills: [
      "NVIDIA Jetson",
      "Jetson Orin Nano",
      "Jetson Orin NX",
      "Raspberry Pi",
      "Docker",
      "AWS",
      "Azure",
      "GCP",
      "CI/CD",
      "GitHub",
    ],
  },
];

/* =========================================================
   EXPERIENCE
========================================================= */

const experience = [
  {
    period: "SEP 2025 — PRESENT",
    role: "APPLICATION ENGINEER LEAD",
    company: "Prescient Technologies Pvt. Ltd.",
    icon: "◉",
    points: [
      "Leading AI Vision, IIoT and Industrial Automation projects.",
      "Developing industrial and intelligent applications.",
      "Managing projects from requirement gathering to deployment.",
      "Working on Edge AI, PLC integration and smart manufacturing.",
    ],
    tags: ["AI Vision", "IIoT", "PLC", "Edge AI"],
  },
  {
    period: "OCT 2024 — AUG 2025",
    role: "IIoT SOLUTION ENGINEER",
    company: "Smarth Udyog Technology & Forum",
    icon: "◈",
    points: [
      "Delivered Industry 4.0 and Smart Factory solutions.",
      "Developed industrial dashboards and IIoT monitoring platforms.",
      "Worked on PLC, MES and industrial integration.",
      "Supported customer deployment and optimization.",
    ],
    tags: ["Industry 4.0", "MES", "MQTT", "IIoT"],
  },
  {
    period: "DEC 2022 — OCT 2024",
    role: "IoT ENGINEER",
    company: "Smarth Udyog Technology & Forum",
    icon: "⚙",
    points: [
      "Developed IoT monitoring and automation solutions.",
      "Worked on Digital Andon and smart manufacturing applications.",
      "Integrated sensors and industrial communication systems.",
    ],
    tags: ["IoT", "Automation", "Sensors", "Dashboards"],
  },
  {
    period: "2020 — 2022",
    role: "ASSOCIATE ENGINEER",
    company: "Intelligence Techsol Pvt. Ltd.",
    icon: "⌘",
    points: [
      "Developed automation software and IoT monitoring systems.",
      "Worked on industrial analytics platforms.",
      "Built experience in industrial digitalization.",
    ],
    tags: ["C#", "SQL", "IoT", "Automation"],
  },
];

/* =========================================================
   PATENTS
========================================================= */

const patents = [
  {
    number: "PATENT 01",
    icon: "📡",
    title: "INDOOR OPERATOR TRACKING SYSTEM",
    description:
      "UWB-enabled IIoT solution for real-time operator location tracking and industrial monitoring.",
    tags: ["UWB", "IIoT", "Real-Time Tracking", "Safety"],
    color: "cyan",
  },
  {
    number: "PATENT 02",
    icon: "🌱",
    title: "SOIL TESTING DEVICE",
    description:
      "IoT and edge computing based innovation designed for rapid soil analysis.",
    tags: ["IoT", "Edge Computing", "Sensors", "Smart Agriculture"],
    color: "green",
  },
];

const awards = [
  {
    year: "JUN 2025",
    title: "APPRECIATION AWARD",
    description: "Recognition for Digital Andon Devices.",
  },
  {
    year: "AUG 2024",
    title: "BREAKTHROUGH AWARD",
    description: "Recognition for completing a high-impact project.",
  },
  {
    year: "MAY 2024",
    title: "EXCELLENCE PERFORMER AWARD",
    description: "Recognition for strong project performance.",
  },
  {
    year: "APR 2024",
    title: "APPRECIATION AWARD",
    description: "Recognition for Sticker Data Integration Project.",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Home() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);

  const [activeSkill, setActiveSkill] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("ALL");

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const filteredProjects =
    projectFilter === "ALL"
      ? projects
      : projects.filter((project) =>
          project.category.includes(projectFilter)
        );

  return (
    <main className="portfolio">
      {/* MOUSE GLOW */}

      <div
        className="mouse-glow"
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      />

      {/* BACKGROUND */}

      <div className="cyber-grid" />
      <div className="noise-layer" />

      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />
      <div className="background-orb orb-three" />

      <div className="background-particles">
        {[...Array(55)].map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: `${(index * 17) % 100}%`,
              animationDelay: `${index * 0.18}s`,
              animationDuration: `${5 + (index % 7)}s`,
            }}
          />
        ))}
      </div>

      {/* NAVIGATION */}

      <nav className="navbar">
        <a href="#home" className="brand">
          <motion.div
            className="brand-logo"
            whileHover={{
              rotate: 360,
              scale: 1.1,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            KP
          </motion.div>

          <div>
            <strong>KUNAL PAWAR</strong>
            <span>AI • VISION • IIoT • ROBOTICS</span>
          </div>
        </a>

        <div className={`nav-menu ${menuOpen ? "show" : ""}`}>
          {[
            ["HOME", "#home"],
            ["ABOUT", "#about"],
            ["EXPERIENCE", "#experience"],
            ["PROJECTS", "#projects"],
            ["SKILLS", "#skills"],
            ["CONTACT", "#contact"],
          ].map(([name, link]) => (
            <a
              key={name}
              href={link}
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </a>
          ))}
        </div>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section id="home" className="hero section">
        <div className="hero-content">
          <motion.div
            className="availability"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span />
            ENGINEERING THE FUTURE OF INDUSTRY
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="hero-code-line">
              <span>{"<"}</span>
              INDUSTRY_4.0
              <span>{"/>"}</span>
            </div>

            <h1>
              BUILDING
              <br />
              <span>INTELLIGENT</span>
              <br />
              INDUSTRIAL SYSTEMS
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            AI Vision, IIoT, Robotics and Industrial Automation professional
            building intelligent systems for the future of manufacturing.
          </motion.p>

          <div className="hero-actions">
            <a href="#projects" className="primary-button">
              EXPLORE PROJECTS
              <span>→</span>
            </a>

            <a href="/resume.pdf" download className="secondary-button">
              DOWNLOAD RESUME
              <span>↓</span>
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>5+</strong>
              <span>YEARS EXPERIENCE</span>
            </div>

            <div>
              <strong>18+</strong>
              <span>ENGINEERING PROJECTS</span>
            </div>

            <div>
              <strong>2</strong>
              <span>PATENT INNOVATIONS</span>
            </div>

            <div>
              <strong>30+</strong>
              <span>TECHNOLOGIES</span>
            </div>
          </div>
        </div>

        {/* =================================================
            PROFILE SYSTEM
        ================================================= */}

        <div className="profile-system">
          <div className="profile-energy-ring ring-one" />
          <div className="profile-energy-ring ring-two" />

          <div className="profile-orbit orbit-outer">
            <span className="orbit-dot dot-one" />
            <span className="orbit-dot dot-two" />
            <span className="orbit-dot dot-three" />
          </div>

          <div className="profile-orbit orbit-middle" />

          {/* PROFILE FRAME */}

          <motion.div
            className="profile-frame"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* SCAN BACKGROUND */}

            <div className="profile-scan" />

            {/* CYBER CORNERS */}

            <div className="profile-corners">
              <span />
              <span />
              <span />
              <span />
            </div>

            {/* =============================================
                SHARP ORIGINAL PROFILE IMAGE
            ============================================= */}

            <Image
              src="/profile.png"
              alt="Kunal Pawar"
              fill
              priority
              className="profile-image profile-image-sharp"
            />

            {/* =============================================
                BLURRED / TRANSPARENT HALF
            ============================================= */}

            <div className="profile-blur-layer">
              <Image
                src="/profile.png"
                alt="Kunal Pawar hologram"
                fill
                priority
                className="profile-image profile-image-blur"
              />
            </div>

            {/* SMOOTH AI TRANSITION */}

            <div className="profile-half-fade" />

            {/* AI SCANNING BEAM */}

            <div className="profile-ai-scan">
              <span />
            </div>

            {/* DIGITAL PARTICLES */}

            <div className="profile-digital-particles">
              {[...Array(18)].map((_, index) => (
                <i
                  key={index}
                  style={{
                    top: `${(index * 17) % 100}%`,
                    left: `${55 + ((index * 11) % 45)}%`,
                    animationDelay: `${index * 0.15}s`,
                  }}
                />
              ))}
            </div>

            {/* EXISTING OVERLAY */}

            <div className="profile-overlay" />

            {/* FACE DETECTION TARGET */}

            {/* <div className="face-target">
              <span />
              <span />
              <span />
              <span />
            </div> */}

            {/* DIGITAL LABEL */}

            <div className="profile-data-label">
              <span>AI SUBJECT</span>
              <strong>KU_PAWAR_01</strong>
            </div>
          </motion.div>

          {/* AI VISION CARD */}

          <motion.div
            className="hud-card card-vision"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <div className="hud-icon ai-icon">◉</div>

            <div>
              <strong>AI VISION</strong>
              <span>Object Detection</span>
              <span>OCR • Inspection</span>
            </div>
          </motion.div>

          {/* AUTOMATION CARD */}

          <motion.div
            className="hud-card card-automation"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
            }}
          >
            <div className="hud-icon gear-icon">⚙</div>

            <div>
              <strong>AUTOMATION</strong>
              <span>PLC Integration</span>
              <span>Industry 4.0</span>
            </div>
          </motion.div>

          {/* ROBOTICS CARD */}

          <motion.div
            className="hud-card card-robotics"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            <div className="hud-icon robot-icon">🦾</div>

            <div>
              <strong>ROBOTICS</strong>
              <span>Vision Guided</span>
              <span>Autonomous Systems</span>
            </div>
          </motion.div>

          {/* EDGE AI CARD */}

          <motion.div
            className="hud-card card-edge"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
            }}
          >
            <div className="hud-icon edge-icon">⬡</div>

            <div>
              <strong>EDGE AI</strong>
              <span>Jetson Orin</span>
              <span>Real-time Intelligence</span>
            </div>
          </motion.div>

          <div className="profile-system-status">
            <span />
            SYSTEM ONLINE
          </div>
        </div>

        <div className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <b>⌄</b>
        </div>
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section id="about" className="section about-section">
        <div className="section-header">
          <span>01 / ABOUT ME</span>

          <h2>
            CONNECTING
            <br />
            <em>INTELLIGENCE WITH INDUSTRY</em>
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-description glass-panel">
            <div className="about-number">01</div>

            <p className="lead-text">
              I design and deploy intelligent engineering systems that connect
              Artificial Intelligence with real-world industrial operations.
            </p>

            <p>
              My work spans AI Vision, Industrial IoT, PLC integration,
              Robotics, Edge AI, industrial dashboards and full-stack
              applications.
            </p>

            <div className="focus-list">
              <div>
                <span>01</span>
                AI VISION SYSTEMS
              </div>

              <div>
                <span>02</span>
                INDUSTRIAL IIoT
              </div>

              <div>
                <span>03</span>
                ROBOTICS & AUTOMATION
              </div>

              <div>
                <span>04</span>
                EDGE & CLOUD AI
              </div>
            </div>
          </div>

          <div className="about-visual glass-panel">
            <div className="system-radar" />

            <div className="system-core">
              <small>ENGINEER</small>
              <span>KUNAL</span>
              <strong>AI + INDUSTRY</strong>
            </div>

            <motion.div
              className="system-node node-ai"
              whileHover={{ scale: 1.15 }}
            >
              👁
              <span>AI VISION</span>
            </motion.div>

            <motion.div
              className="system-node node-iot"
              whileHover={{ scale: 1.15 }}
            >
              📡
              <span>IIoT</span>
            </motion.div>

            <motion.div
              className="system-node node-plc"
              whileHover={{ scale: 1.15 }}
            >
              ⚙
              <span>PLC</span>
            </motion.div>

            <motion.div
              className="system-node node-robot"
              whileHover={{ scale: 1.15 }}
            >
              🦾
              <span>ROBOTICS</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}

      <section id="experience" className="section experience-section">
        <div className="section-header">
          <span>02 / EXPERIENCE</span>
          <h2>PROFESSIONAL JOURNEY</h2>
        </div>

        <div className="experience-timeline">
          <div className="timeline-line" />

          {experience.map((item) => (
            <motion.div
              className="experience-card"
              key={`${item.company}-${item.period}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ x: 8 }}
            >
              <div className="timeline-dot">
                <span />
              </div>

              <div className="experience-date">{item.period}</div>

              <div className="experience-content">
                <div className="experience-icon">{item.icon}</div>

                <h3>{item.role}</h3>
                <h4>{item.company}</h4>

                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <div className="experience-tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}

      <section id="projects" className="section projects-section">
        <div className="section-header projects-title">
          <div>
            <span>03 / PROJECT PORTFOLIO</span>
            <h2>ENGINEERING PROJECTS</h2>

            <p>
              AI Vision, Industrial IoT, Automation and Robotics projects.
            </p>
          </div>

          <div className="project-count">{projects.length}+ SYSTEMS</div>
        </div>

        <div className="project-filter">
          {[
            "ALL",
            "AI VISION",
            "IIoT",
            "AUTOMATION",
            "ROBOTICS",
            "PATENT",
          ].map((filter) => (
            <button
              key={filter}
              className={projectFilter === filter ? "active" : ""}
              onClick={() => setProjectFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`project-card ${project.color}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              whileHover={{
                y: -12,
                rotateX: 2,
                rotateY: -2,
              }}
            >
              <div className="project-visual">
                <div className="project-grid-bg" />
                <div className="project-scan" />
                <div className="project-3d-shadow" />

                <div className={`project-icon-3d icon-${project.type}`}>
                  <span>{project.icon}</span>
                </div>

                <div className="project-status">
                  <i />
                  SYSTEM ACTIVE
                </div>

                <div className="project-id">
                  SYS-{String(project.id).padStart(2, "0")}
                </div>
              </div>

              <div className="project-body">
                <small>{project.category}</small>
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-tech">
                  {project.technologies.slice(0, 4).map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>

                <button onClick={() => setSelectedProject(project)}>
                  EXPLORE SYSTEM
                  <span>→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SKILLS */}

      <section id="skills" className="section skills-section">
        <div className="section-header">
          <span>04 / TECHNOLOGY STACK</span>
          <h2>ENGINEERING ARSENAL</h2>
        </div>

        <div className="skills-layout">
          <div className="skill-navigation">
            {skills.map((skill, index) => (
              <button
                key={skill.title}
                className={activeSkill === index ? "active" : ""}
                onClick={() => setActiveSkill(index)}
              >
                <span>{skill.icon}</span>
                {skill.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSkill}
              className="skill-display"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="skill-display-top">
                <div className="skill-icon-large">
                  {skills[activeSkill].icon}
                </div>

                <div>
                  <h3>{skills[activeSkill].title}</h3>
                  <p>{skills[activeSkill].description}</p>
                </div>
              </div>

              <div className="skill-cloud">
                {skills[activeSkill].skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    whileHover={{
                      scale: 1.12,
                      y: -6,
                    }}
                    animate={{
                      y: [0, index % 2 === 0 ? -5 : 5, 0],
                    }}
                    transition={{
                      duration: 3 + (index % 3),
                      repeat: Infinity,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* PATENTS */}

      <section className="section innovation-section">
        <div className="section-header">
          <span>05 / INNOVATION LAB</span>

          <h2>
            PATENTS &
            <br />
            <em>INNOVATION</em>
          </h2>
        </div>

        <div className="patents-grid">
          {patents.map((patent, index) => (
            <motion.div
              key={patent.title}
              className={`patent-card ${patent.color}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{
                y: -10,
                rotateX: 2,
              }}
            >
              <div className="patent-top">
                <span>{patent.number}</span>

                <div className="patent-status">
                  <i />
                  INNOVATION
                </div>
              </div>

              <div className="patent-visual">
                <div className="patent-energy" />
                <span>{patent.icon}</span>
                <div className="patent-orbit" />
              </div>

              <h3>{patent.title}</h3>
              <p>{patent.description}</p>

              <div className="patent-tags">
                {patent.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AWARDS */}

      <section className="section awards-section">
        <div className="section-header">
          <span>06 / RECOGNITION</span>
          <h2>ACHIEVEMENTS & AWARDS</h2>
        </div>

        <div className="awards-grid">
          {awards.map((award) => (
            <motion.div
              key={`${award.year}-${award.title}`}
              className="award-card"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <div className="award-year">{award.year}</div>

              <div className="award-icon">✦</div>

              <h3>{award.title}</h3>
              <p>{award.description}</p>

              <div className="award-line" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* EDUCATION */}

      <section className="section education-section">
        <div className="section-header">
          <span>07 / EDUCATION</span>
          <h2>ACADEMIC FOUNDATION</h2>
        </div>

        <div className="education-grid">
          <motion.div
            className="education-card"
            whileHover={{ y: -8 }}
          >
            <div className="education-icon">
              <span>BE</span>
            </div>

            <div>
              <small>2017 — 2020</small>

              <h3>COMPUTER SCIENCE ENGINEERING</h3>

              <p>
                Sandip Institute of Technology & Research Center, Nashik
              </p>

              <strong>60%</strong>
            </div>
          </motion.div>

          <motion.div
            className="education-card"
            whileHover={{ y: -8 }}
          >
            <div className="education-icon">
              <span>DIP</span>
            </div>

            <div>
              <small>2013 — 2017</small>

              <h3>COMPUTER ENGINEERING</h3>

              <p>MET Polytechnic Bhujbal Knowledge City, Nashik</p>

              <strong>68.56%</strong>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}

      <section id="contact" className="section contact-section">
        <div className="contact-box">
          <div className="contact-main">
            <span>08 / LET&apos;S CONNECT</span>

            <h2>
              LET&apos;S BUILD
              <br />
              <em>THE FUTURE.</em>
            </h2>

            <p>
              Interested in AI Vision, Industrial IoT, Robotics or intelligent
              automation?
            </p>

            <div className="contact-status">
              <span />
              OPEN TO INNOVATIVE OPPORTUNITIES
            </div>
          </div>

          <div className="contact-actions">
            <a href="mailto:kunalpawar1713@gmail.com">
              <span>✉</span>

              <div>
                <small>EMAIL</small>
                <strong>kunalpawar1713@gmail.com</strong>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/kunal-pawar-b3728618a"
              target="_blank"
              rel="noreferrer"
            >
              <span>in</span>

              <div>
                <small>PROFESSIONAL NETWORK</small>
                <strong>LINKEDIN</strong>
              </div>
            </a>

            <a href="/resume.pdf" download>
              <span>↓</span>

              <div>
                <small>CAREER PROFILE</small>
                <strong>DOWNLOAD CV</strong>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer>
        <span>© {new Date().getFullYear()} KUNAL PAWAR</span>

        <span>AI VISION • IIoT • ROBOTICS • INDUSTRY 4.0</span>

        <span className="footer-status">
          <i />
          SYSTEM ONLINE
        </span>
      </footer>

      {/* PROJECT MODAL */}

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="project-modal"
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>

              <div className="modal-project-icon">
                {selectedProject.icon}
              </div>

              <small className="modal-category">
                {selectedProject.category}
              </small>

              <h2>{selectedProject.title}</h2>

              <p>{selectedProject.description}</p>

              <div className="system-architecture">
                <div>INPUT</div>
                <span>→</span>
                <div>AI ENGINE</div>
                <span>→</span>
                <div>EDGE</div>
                <span>→</span>
                <div>OUTPUT</div>
              </div>

              <div className="modal-section">
                <h3>SYSTEM CAPABILITIES</h3>

                <ul>
                  {selectedProject.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h3>TECHNOLOGY STACK</h3>

                <div className="modal-tech">
                  {selectedProject.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}