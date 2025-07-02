import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Rocket } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import EnhancedParallax from "./EnhancedParallax";
import { ProjectsBackground } from "./SectionBackgrounds";
import Enhanced3DBackground from "./Enhanced3DBackground";

const ProjectsSection: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { ref, inView } = useInView({
    threshold: 0.01,
    triggerOnce: true,
    rootMargin: "100px 0px",
  });

  const [clickedProject, setClickedProject] = useState<number | null>(null);

  const handleProjectClick = (projectId: number, url: string) => {
    setClickedProject(projectId);

    // Show animation for 1 second, then redirect
    setTimeout(() => {
      if (url !== "#") {
        window.open(url, "_blank");
      }
      setClickedProject(null);
    }, 1000);
  };

  const projects = [
    {
      id: 1,
      title: "Predicting Taxi Fares Using Random Forests",
      description:
        "Built a predictive model for estimating taxi fares using features like distance, location, and time. Collected and preprocessed real-world taxi fare datasets, trained a Random Forest model achieving 85% accuracy, and visualized results using Matplotlib and Seaborn.",
      tech: [
        "Python",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "Matplotlib",
        "Seaborn",
      ],
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMDAwMDAwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiNGRkE1MDAiIG9wYWNpdHk9IjAuOCIvPgo8dGV4dCB4PSIyMDAiIHk9IjIwMCIgZmlsbD0iI0ZGRkZGRiIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGF4aSBGYXJlIE1MPC90ZXh0Pgo8L3N2Zz4=",
      github: "https://github.com/Akshayy67",
      live: "#",
      status: "Completed",
    },
    {
      id: 2,
      title: "LRU-Cache Implementation",
      description:
        "Implemented LRU logic by converting Java doubly linked list and hash map code into JavaScript, enabling dynamic screen updates and real-time question result ranking. Enhanced user experience with dark/light theme toggle, intuitive visuals, and an operation log.",
      tech: ["HTML", "CSS", "JavaScript", "Servicenow APIs"],
      image:
        "https://images.pexels.com/photos/2159149/pexels-photo-2159149.jpeg?auto=compress&cs=tinysrgb&w=800",
      github: "https://github.com/Akshayy67",
      live: "#",
      status: "Completed",
    },
    {
      id: 3,
      title: "Equipment Loaner Request App",
      description:
        "Developed a No-Code Loaner App using JavaScript and Servicenow specific technologies to manage equipment lending, integrating ServiceNow APIs for data handling and automation. Designed custom tables and forms within the ServiceNow platform, enabling users to request, track, and return loaner equipment with real-time status updates.",
      tech: ["JavaScript", "ServiceNow", "APIs", "No-Code Platform"],
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMDAwMDAwIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRkE1MDAiIG9wYWNpdHk9IjAuMiIgcng9IjEwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TZXJ2aWNlTm93PC90ZXh0Pgo8L3N2Zz4=",
      github: "https://github.com/Akshayy67",
      live: "#",
      status: "Completed",
    },
    {
      id: 4,
      title: "QuizApp_Flutter",
      description:
        "Built a fully operational Quiz App using Dart, implementing state management to enable dynamic screen updates and real-time question result ranking. Designed a responsive UI with engaging question interfaces and comprehensive result summaries, ensuring a seamless user experience across devices.",
      tech: ["Flutter", "Dart", "State Management"],
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMDAwMDAwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEwMCIgcj0iMzAiIGZpbGw9IiNGRkE1MDAiIG9wYWNpdHk9IjAuOCIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyMDAiIHI9IjIwIiBmaWxsPSIjRkZBNTAwIiBvcGFjaXR5PSIwLjYiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMjAwIiByPSIyMCIgZmlsbD0iI0ZGQTUwMCIgb3BhY2l0eT0iMC42Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GbHV0dGVyIFF1aXo8L3RleHQ+Cjwvc3ZnPg==",
      github: "https://github.com/Akshayy67",
      live: "#",
      status: "Completed",
    },
    {
      id: 5,
      title: "FarmSmart AI (UD)",
      description:
        "Developed an AI-powered platform assisting farmers in improving crop production and minimizing losses. Integrated AI for crop health analysis, pest detection, and actionable farming insights. Implemented real-time weather forecasting using OpenWeatherMap API and optional location-based insights with GoogleMapsAPI.",
      tech: ["HTML", "React.js", "Node.js", "Python", "AI/ML"],
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDMwMCAxMDBMMzAwIDIwMEwxMDAgMjAwWiIgZmlsbD0iI0ZGQTUwMCIgb3BhY2l0eT0iMC4zIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjMwIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GYXJtU21hcnQgQUk8L3RleHQ+Cjwvc3ZnPg==",
      github: "https://github.com/Akshayy67",
      live: "#",
      status: "Completed",
    },
    {
      id: 6,
      title: "Contact Manager",
      description:
        "This web-based Contact Manager allows users to efficiently search, manage, and email contacts from a centralized interface. To optimize search performance, especially for prefix-based queries (like autocomplete), a Trie (prefix tree) data structure is integrated. This ensures fast and accurate contact lookups, even with large datasets.",
      tech: ["HTML", "JavaScript", "SQLite", "Trie Data Structure"],
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMDAwMDAwIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTUiIGZpbGw9IiNGRkE1MDAiIG9wYWNpdHk9IjAuOCIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxMDAiIHI9IjE1IiBmaWxsPSIjRkZBNTAwIiBvcGFjaXR5PSIwLjgiLz4KPGNpcmNsZSBjeD0iMzAwIiBjeT0iMTAwIiByPSIxNSIgZmlsbD0iI0ZGQTUwMCIgb3BhY2l0eT0iMC44Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjMwIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db250YWN0IE1hbmFnZXI8L3RleHQ+Cjwvc3ZnPg==",
      github: "https://github.com/Akshayy67",
      live: "#",
      status: "Completed",
    },
  ];

  return (
    <section
      id="projects"
      data-section="projects"
      className={`min-h-screen py-20 relative overflow-hidden ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}
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
        <div ref={ref} className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2
              className={`text-4xl md:text-6xl font-display font-bold mb-4 text-shadow-soft ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Featured <span className="interstellar-text">Projects</span>
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}
            >
              A showcase of my development journey - from concept to deployment,
              each project represents a unique challenge and learning experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`group relative backdrop-blur-sm border rounded-xl overflow-hidden hover:border-orange-400/50 transition-all duration-500 cursor-pointer ${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white/90 border-orange-100 text-gray-900 shadow-glow-md'}`}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => handleProjectClick(project.id, project.github)}
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
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {project.title}
                    </span>
                  </h3>

                  <p
                    className={`${
                      isDarkMode ? "text-white/70" : "text-gray-700"
                    } text-sm leading-relaxed mb-4`}
                  >
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
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

          {/* View More Projects */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-3 border border-orange-400 text-orange-400 font-mono font-medium rounded-full hover:bg-orange-400/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket size={20} />
              View More Projects
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
