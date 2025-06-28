import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
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
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Voice commands
  const commands: VoiceCommand[] = [
    {
      command: "go to home",
      action: () =>
        document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }),
      response: "Navigating to home section",
    },
    {
      command: "show about",
      action: () =>
        document
          .getElementById("about")
          ?.scrollIntoView({ behavior: "smooth" }),
      response: "Showing about section",
    },
    {
      command: "view projects",
      action: () =>
        document
          .getElementById("projects")
          ?.scrollIntoView({ behavior: "smooth" }),
      response: "Displaying projects",
    },
    {
      command: "contact me",
      action: () =>
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" }),
      response: "Opening contact section",
    },
    {
      command: "show achievements",
      action: () =>
        document
          .getElementById("achievements")
          ?.scrollIntoView({ behavior: "smooth" }),
      response: "Showing achievements",
    },
    {
      command: "scroll to top",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      response: "Scrolling to top",
    },
    {
      command: "help",
      action: () => {},
      response:
        "Available commands: go to home, show about, view projects, contact me, show achievements, scroll to top",
    },
  ];

  useEffect(() => {
    // Check if speech recognition is supported
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true);

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback("Listening...");
      };

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        setTranscript(result);
        processCommand(result);
      };

      recognition.onerror = (event) => {
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
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

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
              : "bg-orange-500 hover:bg-orange-600"
          }
          text-white shadow-glow-lg transition-all duration-300
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
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
        {isListening && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/90 backdrop-blur-md text-white p-6 rounded-xl max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="text-center">
              <div className="text-lg font-semibold mb-4 text-orange-400">
                🎤 Voice Commands
              </div>
              <div className="text-sm space-y-1 text-left">
                <div>• "Go to home"</div>
                <div>• "Show about"</div>
                <div>• "View projects"</div>
                <div>• "Contact me"</div>
                <div>• "Show achievements"</div>
                <div>• "Scroll to top"</div>
                <div>• "Help"</div>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                Speak clearly and wait for response
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceNavigation;
