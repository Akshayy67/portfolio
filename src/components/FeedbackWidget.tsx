import { useState } from "react";
import { trackEvent } from "../services/analytics";
import { useTheme } from "../contexts/ThemeContext";
import { getEmailJSConfig, sendEmailWithRetry } from "../config/emailjs";

const SECTIONS = [
  "About",
  "Projects",
  "Contact",
  "Hobbies",
  "Achievements"
];

const FeedbackWidget = () => {
  const { isDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [section, setSection] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    trackEvent("feedback", "Page Feedback", `Rating: ${rating}, Section: ${section}, Recommendation: ${recommendation}`);

    // Prepare emailjs config and params
    const config = getEmailJSConfig();
    const templateParams = {
      from_name: "Portfolio Feedback Widget",
      from_email: "noreply@portfolio.com",
      to_email: "akshayjuluri6704@gmail.com",
      to_name: "Akshay Juluri",
      subject: `New Feedback from Portfolio` ,
      message: `⭐ Rating: ${rating}\nSection Liked: ${section}\nRecommendations: ${recommendation}\nTime: ${new Date().toLocaleString()}`,
      reply_to: "noreply@portfolio.com",
      timestamp: new Date().toLocaleString(),
      contact_type: "Portfolio Feedback",
    };

    try {
      await sendEmailWithRetry(config.serviceId, config.templateId, templateParams);
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setRating(0);
        setSection("");
        setRecommendation("");
        setSending(false);
      }, 2000);
    } catch (err) {
      setError("Failed to send feedback. Please try again later.");
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        className={`fixed bottom-24 right-6 z-50 px-4 py-3 rounded-full shadow-lg transition-colors duration-300 font-semibold text-lg ${isDarkMode ? "bg-orange-500 text-white hover:bg-orange-400" : "bg-gray-900 text-white hover:bg-orange-500"}`}
        onClick={() => setOpen(true)}
        aria-label="Give Feedback"
      >
        💬 Feedback
      </button>

      {/* Slide-up Feedback Card */}
      {open && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 flex justify-center animate-slideup"
          style={{ pointerEvents: "auto" }}
        >
          <form
            onSubmit={handleSubmit}
            className={`w-full max-w-md m-4 p-6 rounded-2xl shadow-2xl border ${isDarkMode ? "bg-gray-900 border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"} flex flex-col gap-4`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold">Feedback</span>
              <button
                type="button"
                className="text-2xl font-bold hover:text-orange-500"
                onClick={() => setOpen(false)}
                aria-label="Close Feedback"
              >
                ×
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <span className="text-green-500 text-lg font-semibold">Thank you for your feedback!</span>
              </div>
            ) : (
              <>
                {/* Star Rating */}
                <div className="flex flex-col gap-1">
                  <label className="font-medium">How would you rate your experience?</label>
                  <div className="flex gap-1 text-2xl">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={star <= rating ? "text-orange-400" : isDarkMode ? "text-white/30" : "text-gray-400"}
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section Selector */}
                <div className="flex flex-col gap-1">
                  <label className="font-medium">What section did you like most?</label>
                  <select
                    className={`rounded px-3 py-2 border focus:outline-none ${isDarkMode ? "bg-gray-800 border-white/20 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a section</option>
                    {SECTIONS.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                {/* Recommendations */}
                <div className="flex flex-col gap-1">
                  <label className="font-medium">Any recommendations?</label>
                  <textarea
                    className={`rounded px-3 py-2 border focus:outline-none resize-none min-h-[60px] ${isDarkMode ? "bg-gray-800 border-white/20 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    value={recommendation}
                    onChange={e => setRecommendation(e.target.value)}
                    placeholder="Your suggestions..."
                    maxLength={300}
                  />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                  type="submit"
                  className={`mt-2 w-full py-2 rounded font-semibold transition-colors duration-300 ${isDarkMode ? "bg-orange-500 text-white hover:bg-orange-400" : "bg-gray-900 text-white hover:bg-orange-500"}`}
                  disabled={rating === 0 || !section || sending}
                >
                  {sending ? "Sending..." : "Submit"}
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget; 