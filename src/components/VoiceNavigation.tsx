import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, HelpCircle } from "lucide-react";
import {
  trackVoiceCommand,
  updateLocalAnalytics,
  getLocalAnalytics,
} from "../services/analytics";

interface VoiceCommand {
  command: string;
  action: () => void;
  response: string;
}

const VoiceNavigation: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Voice commands
  const commands: VoiceCommand[] = [
    {
      command: "go to home",
      action: () => {
        if (typeof document !== "undefined") {
          document
            .getElementById("hero")
            ?.scrollIntoView({ behavior: "smooth" });
        }
      },
      response: "Navigating to home section",
    },
    {
      command: "show about",
      action: () => {
        if (typeof document !== "undefined") {
          document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" });
        }
      },
      response: "Showing about section",
    },
    {
      command: "view projects",
      action: () => {
        if (typeof document !== "undefined") {
          document
            .getElementById("projects")
            ?.scrollIntoView({ behavior: "smooth" });
        }
      },
      response: "Displaying projects",
    },
    {
      command: "contact me",
      action: () => {
        if (typeof document !== "undefined") {
          document
            .getElementById("contact")
            ?.scrollIntoView({ behavior: "smooth" });
        }
      },
      response: "Opening contact section",
    },
    {
      command: "show achievements",
      action: () => {
        if (typeof document !== "undefined") {
          document
            .getElementById("achievements")
            ?.scrollIntoView({ behavior: "smooth" });
        }
      },
      response: "Showing achievements",
    },
    {
      command: "scroll to top",
      action: () => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
      response: "Scrolling to top",
    },
    {
      command: "help",
      action: () => {
        setShowCommands(true);
        setTimeout(() => setShowCommands(false), 5000);
      },
      response: "Showing available voice commands",
    },
  ];

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window === "undefined") {
      return;
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true);

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback("Listening...");
      };

      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript.toLowerCase();
        setTranscript(result);
        processCommand(result);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setFeedback("Error occurred. Please try again.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const processCommand = (spokenText: string) => {
    const matchedCommand = commands.find(
      (cmd) =>
        spokenText.includes(cmd.command) ||
        cmd.command.split(" ").every((word) => spokenText.includes(word))
    );

    if (matchedCommand) {
      matchedCommand.action();
      setFeedback(matchedCommand.response);
      speak(matchedCommand.response);

      // Track voice command
      trackVoiceCommand(matchedCommand.command);

      // Update local analytics
      const analytics = getLocalAnalytics();
      analytics.events.push({
        timestamp: Date.now(),
        type: "voice_command",
        data: { command: matchedCommand.command },
      });
      updateLocalAnalytics(analytics);
    } else {
      setFeedback('Command not recognized. Say "help" for available commands.');
      speak("Command not recognized. Say help for available commands.");
    }

    // Clear feedback after 3 seconds
    setTimeout(() => setFeedback(""), 3000);
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setShowCommands(true); // Show commands when starting to listen
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setShowCommands(false); // Hide commands when stopping
    }
  };

  const toggleCommands = () => {
    setShowCommands(!showCommands);
  };

  // Add debugging
  useEffect(() => {
    console.log("VoiceNavigation: Speech recognition supported:", isSupported);
    console.log("VoiceNavigation: Window object available:", typeof window !== "undefined");
    if (typeof window !== "undefined") {
      console.log("VoiceNavigation: webkitSpeechRecognition available:", "webkitSpeechRecognition" in window);
      console.log("VoiceNavigation: SpeechRecognition available:", "SpeechRecognition" in window);
    }
  }, [isSupported]);

  // Always render the component, but show different content based on support
  return (
    <>

      {/* Voice Control Button */}
      <motion.button
        onClick={isListening ? stopListening : startListening}
        className={`
          fixed bottom-6 right-6 z-50 p-4 rounded-full
          ${
            isListening
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : isSupported 
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-500 cursor-not-allowed"
          }
          text-white shadow-glow-lg transition-all duration-300
        `}
        whileHover={{ scale: isSupported ? 1.1 : 1 }}
        whileTap={{ scale: isSupported ? 0.95 : 1 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        title={isSupported 
          ? (isListening ? "Stop listening" : "Start voice commands")
          : "Voice commands not supported in this browser"
        }
        disabled={!isSupported}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </motion.button>

      {/* Help Button */}
      <motion.button
        onClick={toggleCommands}
        className={`fixed bottom-6 right-20 z-50 p-4 rounded-full ${
          isSupported 
            ? "bg-blue-500 hover:bg-blue-600" 
            : "bg-gray-500 cursor-not-allowed"
        } text-white shadow-glow-lg transition-all duration-300`}
        whileHover={{ scale: isSupported ? 1.1 : 1 }}
        whileTap={{ scale: isSupported ? 0.95 : 1 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        title={isSupported ? "Show voice commands" : "Voice commands not supported"}
        disabled={!isSupported}
      >
        <HelpCircle size={24} />
      </motion.button>

      {/* Voice Feedback */}
      <AnimatePresence>
        {(feedback || transcript) && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 bg-black/80 backdrop-blur-md text-white p-4 rounded-lg max-w-xs"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            {transcript && (
              <div className="mb-2">
                <div className="text-xs text-gray-400 mb-1">You said:</div>
                <div className="text-sm">"{transcript}"</div>
              </div>
            )}
            {feedback && (
              <div>
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Volume2 size={12} />
                  Response:
                </div>
                <div className="text-sm text-orange-400">{feedback}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Commands Help */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            className="fixed bottom-20 right-6 z-50 bg-black/90 backdrop-blur-md text-white p-4 rounded-xl max-w-sm border border-orange-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-center">
              <div className="text-lg font-semibold mb-4 text-orange-400 flex items-center justify-center gap-2">
                <Mic size={20} />
                Voice Commands
              </div>
              {!isSupported ? (
                <div className="text-red-400 mb-4">
                  Voice commands are not supported in this browser. 
                  Please use Chrome, Edge, or Safari for voice functionality.
                </div>
              ) : (
                <>
                  <div className="text-sm space-y-2 text-left max-h-60 overflow-y-auto">
                    {commands.map((cmd, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 rounded bg-gray-800/50">
                        <span className="text-orange-400 font-mono text-xs">•</span>
                        <div>
                          <div className="font-medium text-orange-300">"{cmd.command}"</div>
                          <div className="text-xs text-gray-400 mt-1">{cmd.response}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    {isListening ? "🎤 Listening... Speak clearly" : "Click the mic button to start listening"}
                  </div>
                </>
              )}
              <button
                onClick={() => setShowCommands(false)}
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceNavigation;
