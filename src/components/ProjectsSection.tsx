import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Rocket } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { ProjectsBackground } from "./SectionBackgrounds";
import { trackSectionView } from "../services/analytics";

const ProjectsSection: React.FC = () => {
  const { isDarkMode } = useTheme();

  const [clickedProject, setClickedProject] = useState<number | null>(null);
  const [showMoreProjects, setShowMoreProjects] = useState(false);

  const handleProjectClick = (
    projectId: number,
    liveUrl: string,
    githubUrl: string
  ) => {
    setClickedProject(projectId);

    // Show animation for 1 second, then redirect
    setTimeout(() => {
      // Prioritize live demo URL, fall back to GitHub if live is "#"
      const targetUrl = liveUrl !== "#" ? liveUrl : githubUrl;
      if (targetUrl !== "#") {
        window.open(targetUrl, "_blank");
      }
      setClickedProject(null);
    }, 1000);
  };

  const projects = [
    {
      id: 1,
      title: "SuperApp",
      description:
        "AI-powered academic assistant with comprehensive study tools, note-taking capabilities, and intelligent learning recommendations. Features include smart scheduling, progress tracking, and collaborative study sessions.",
      tech: ["React", "Node.js", "AI/ML", "MongoDB", "Express"],
      image: "/superapp dp.png",
      github: "https://github.com/Akshayy67",
      live: "https://super-app.tech",
      status: "Completed",
    },
    {
      id: 2,
      title: "LRU Cache",
      description:
        "Interactive LRU Cache implementation with real-time visualization. Features dynamic screen updates, operation logging, and intuitive visual representation of cache operations with dark/light theme support.",
      tech: ["HTML", "CSS", "JavaScript", "Data Structures"],
      image: "/Lru dp.png",
      github: "https://github.com/Akshayy67",
      live: "https://lru-cache-iota.vercel.app/",
      status: "Completed",
    },
    {
      id: 3,
      title: "URL Shortener",
      description:
        "Fast and reliable URL shortening service with advanced analytics, custom aliases, and QR code generation. Perfect for social media, marketing campaigns, and tracking engagement with enterprise-grade security.",
      tech: ["Next.js", "Supabase", "TypeScript", "TailwindCSS"],
      image: "/url-shortener.svg",
      github: "https://github.com/Akshayy67",
      live: "https://url-shortner-five-sable.vercel.app/",
      status: "Completed",
    },
    {
      id: 4,
      title: "Contact Manager",
      description:
        "Advanced contact management system with Trie data structure implementation for efficient search. Features real-time search, contact categorization, and optimized data retrieval performance.",
      tech: ["React", "Trie Data Structure", "JavaScript", "CSS3"],
      image: "/contact dp.png",
      github: "https://github.com/Akshayy67",
      live: "https://contact-manager-trie.vercel.app/",
      status: "Completed",
    },
    {
      id: 5,
      title: "AVL Tree Visualizer",
      description:
        "Interactive AVL Tree visualization tool for understanding self-balancing binary search trees. Features step-by-step insertion, deletion, and rotation operations with educational animations.",
      tech: ["JavaScript", "HTML5 Canvas", "CSS3", "Data Structures"],
      image: "/avl-tree.svg",
      github: "https://github.com/Akshayy67",
      live: "https://avl-tree-visualizer-blue.vercel.app/",
      status: "Completed",
    },
    {
      id: 6,
      title: "Weather Dashboard",
      description:
        "Responsive weather application with real-time data, 7-day forecasts, and location-based services. Integrated with OpenWeatherMap API for accurate weather information and geolocation features.",
      tech: ["React", "API Integration", "CSS3", "JavaScript"],
      image: "/weather dp.png",
      github: "https://github.com/Akshayy67",
      live: "https://weather-dash-ten.vercel.app/",
      status: "Completed",
    },
  ];

  const additionalProjects = [
    {
      id: 7,
      title: "Todo List",
      description:
        "Modern task management application with intuitive interface, priority levels, and deadline tracking. Features include drag-and-drop functionality, categories, and progress visualization.",
      tech: ["React", "Local Storage", "CSS3", "JavaScript"],
      image: "/todo-app.svg",
      github: "https://github.com/Akshayy67",
      live: "https://todo-theta-bice-92.vercel.app/",
      status: "Completed",
    },
    {
      id: 8,
      title: "Version Control",
      description:
        "Custom version control system implementation demonstrating Git-like functionality. Features include branching, merging, commit history, and file tracking with command-line interface.",
      tech: ["Node.js", "File System", "CLI", "JavaScript"],
      image: "/version-control.svg",
      github: "https://github.com/Akshayy67/Version-control",
      live: "#",
      status: "Completed",
    },
    {
      id: 9,
      title: "Ecommerce Platform",
      description:
        "Full-stack e-commerce platform with React frontend and Node.js backend. Features include product management, shopping cart, user authentication, order processing, and admin dashboard.",
      tech: ["React", "Node.js", "Express", "SQLite", "Prisma"],
      image: "/ecommerce.svg",
      github: "https://github.com/Akshayy67/Ecommerce",
      live: "#",
      status: "Completed",
    },
    {
      id: 10,
      title: "Blog Platform",
      description:
        "Modern blogging platform with rich text editor, user authentication, and content management. Features include post creation, commenting system, and responsive design.",
      tech: ["JavaScript", "Node.js", "Express", "MongoDB"],
      image: "/blog-platform.svg",
      github: "https://github.com/Akshayy67/Blog-platform",
      live: "#",
      status: "Completed",
    },
    {
      id: 11,
      title: "Expense Tracker (Flutter)",
      description:
        "Cross-platform mobile expense tracking application built with Flutter. Features include expense categorization, budget management, visual analytics, and data persistence.",
      tech: ["Flutter", "Dart", "SQLite", "Charts"],
      image: "/expense-tracker.svg",
      github: "https://github.com/Akshayy67/Expense_tracker",
      live: "#",
      status: "Completed",
    },
    {
      id: 12,
      title: "Quiz App (Flutter)",
      description:
        "Interactive quiz application with multiple question types, scoring system, and progress tracking. Features include timed quizzes, result analytics, and customizable question sets.",
      tech: ["Flutter", "Dart", "State Management", "UI/UX"],
      image: "/quiz-app.svg",
      github: "https://github.com/Akshayy67/QuizApp_Flutter",
      live: "#",
      status: "Completed",
    },
  ];

  const displayedProjects = showMoreProjects
    ? [...projects, ...additionalProjects]
    : projects;

  const refProjects = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView("Projects");
        }
      },
      { threshold: 0.5 }
    );
    if (refProjects.current) observer.observe(refProjects.current);
    return () => {
      if (refProjects.current) observer.unobserve(refProjects.current);
    };
  }, []);

  return (
    <section
      id="projects"
      data-section="projects"
      className={`min-h-screen py-20 relative overflow-hidden ${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Background */}
      <ProjectsBackground />

      {/* Enhanced constellation effect */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${25 + Math.sin(i) * 20}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div ref={refProjects} className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className={`text-4xl md:text-6xl font-display font-bold mb-4 text-shadow-soft ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Featured <span className="interstellar-text">Projects</span>
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? "text-white/70" : "text-gray-600"
              }`}
            >
              A showcase of my development journey - from concept to deployment,
              each project represents a unique challenge and learning experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`group relative backdrop-blur-sm border rounded-xl overflow-hidden hover:border-orange-400/50 transition-all duration-500 cursor-pointer ${
                  isDarkMode
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/90 border-orange-100 text-gray-900 shadow-glow-md"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() =>
                  handleProjectClick(project.id, project.live, project.github)
                }
              >
                {/* Click Animation Overlay */}
                <AnimatePresence>
                  {clickedProject === project.id && (
                    <motion.div
                      className="absolute inset-0 z-50 bg-orange-400/20 backdrop-blur-sm flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="text-orange-400 text-4xl"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Rocket size={48} />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono ${
                        project.status === "Completed"
                          ? "bg-green-400/20 text-green-400"
                          : project.status === "In Progress"
                          ? "bg-orange-400/20 text-orange-400"
                          : "bg-purple-400/20 text-purple-400"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3
                    className={`text-xl font-mono font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } mb-3 group-hover:text-orange-400 transition-colors`}
                  >
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                      {project.title}
                    </span>
                  </h3>

                  <p
                    className={`${
                      isDarkMode ? "text-white/70" : "text-gray-700"
                    } text-sm leading-relaxed mb-4`}
                  >
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                      {project.description}
                    </span>
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className={`px-2 py-1 ${
                          isDarkMode
                            ? "bg-white/10 text-white/80"
                            : "bg-gray-200 text-gray-700"
                        } rounded text-xs font-mono`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.a
                        href={project.github}
                        className="flex items-center gap-2 text-white/70 hover:text-orange-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={16} />
                        <span className="text-sm font-mono">Code</span>
                      </motion.a>

                      <motion.a
                        href={project.live}
                        className="flex items-center gap-2 text-white/70 hover:text-orange-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={16} />
                        <span className="text-sm font-mono">Live</span>
                      </motion.a>
                    </div>

                    <motion.button
                      className="p-2 bg-orange-400/10 text-orange-400 rounded-full hover:bg-orange-400/20 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Rocket size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* More Projects Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onClick={() => setShowMoreProjects(!showMoreProjects)}
              className="inline-flex items-center gap-3 px-8 py-3 border border-orange-400 text-orange-400 font-mono font-medium rounded-full hover:bg-orange-400/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket size={20} />
              {showMoreProjects ? "Show Less Projects" : "More Projects"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
