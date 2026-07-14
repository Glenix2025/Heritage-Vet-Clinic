import React, { useState, useRef, useEffect } from "react";
import { Message, FaqItem } from "../types";
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Client-side local FAQs for immediate fallback
const LOCAL_FAQS: FaqItem[] = [
  {
    question: "What are your opening hours?",
    answer: "We're open Monday to Friday, 8:30am–5:30pm. We're closed on weekends, so if it's outside these hours, please see our after-hours info below."
  },
  {
    question: "Where are you located?",
    answer: "We're at 274 Sydney Rd, Coburg VIC 3058 — easy to find right on Sydney Road."
  },
  {
    question: "What's your phone number?",
    answer: "You can reach us on (03) 9386 1501 during opening hours."
  },
  {
    question: "Can I email the clinic?",
    answer: "Yes, you can reach us at admin@heritagevets.com.au and we'll get back to you as soon as we can."
  },
  {
    question: "Do you have an emergency or after-hours vet?",
    answer: "We don't offer after-hours emergency care ourselves, but our nearest recommended emergency centre is Advanced Vet Care in Kensington on (03) 9092 0400. If your pet is in urgent distress, please call them or your nearest emergency vet immediately."
  },
  {
    question: "What services do you offer?",
    answer: "We provide health examinations, vaccinations, desexing, dental care, microchipping, digital radiography, ultrasonography, flea and worming advice, nutritional guidance, and general surgical procedures."
  },
  {
    question: "Do you offer cat boarding?",
    answer: "Yes, we offer cat boarding — get in touch with us for availability and rates."
  },
  {
    question: "Do you do microchipping?",
    answer: "Yes, microchipping is one of our standard services — just give us a call to book a time."
  },
  {
    question: "Can I get X-rays done for my pet?",
    answer: "Yes, we offer digital radiography (X-rays) on-site for diagnostic imaging."
  },
  {
    question: "Do you help with weight management for overweight pets?",
    answer: "Yes, we offer nutritional advice and a 'Pet Slimmers' weight-loss program for pets who need to shed some kilos."
  },
  {
    question: "How do I book an appointment?",
    answer: "You can book instantly using our Calendly system: https://calendly.com/pawsy1432/heritage-veterinary-clinic — or call us on (03) 9386 1501 during business hours."
  },
  {
    question: "I'm a new patient — how do I get started?",
    answer: "Welcome! Just call us or fill out our contact form with your name, your pet's name, and a bit about why you're coming in, and we'll set up your first visit."
  },
  {
    question: "What should I bring to my pet's first appointment?",
    answer: "It helps to bring any previous vet records or vaccination history if you have them, along with details of your pet's diet and any concerns you'd like to raise."
  },
  {
    question: "Do you offer dental care for pets?",
    answer: "Yes, dental care is one of our core services — we can assess and treat dental issues during a consultation."
  },
  {
    question: "Do you provide nurse-led dog obedience support?",
    answer: "Yes, our nursing team has experience with dog obedience training and can offer guidance during visits."
  }
];

// Helper to determine if input indicates an emergency/urgent situation
const checkIsEmergency = (text: string): boolean => {
  const emergencyKeywords = [
    "emergency", "urgency", "urgent", "dying", "bleeding", "poison", "poisoned",
    "seizure", "seizures", "unconscious", "breathing difficulty", "cannot breathe",
    "hit by car", "run over", "snake bite", "snakebite", "broken leg", "blood",
    "choking", "bloat", "vomiting blood", "lethargic", "unresponsive"
  ];
  const lowercase = text.toLowerCase();
  return emergencyKeywords.some(keyword => lowercase.includes(keyword));
};

// Client-side rule-based answer matching as a robust backup
const getLocalAnswer = (text: string): string => {
  const lowercase = text.toLowerCase();

  if (checkIsEmergency(lowercase)) {
    return "This sounds urgent — please call Advanced Vet Care in Kensington now at (03) 9092 0400, or go to your nearest emergency vet.";
  }

  // Keywords matching
  if (lowercase.includes("hour") || lowercase.includes("open") || lowercase.includes("time") || lowercase.includes("day") || lowercase.includes("weekend")) {
    return LOCAL_FAQS[0].answer;
  }
  if (lowercase.includes("where") || lowercase.includes("location") || lowercase.includes("address") || lowercase.includes("sydney rd") || lowercase.includes("coburg")) {
    return LOCAL_FAQS[1].answer;
  }
  if (lowercase.includes("phone") || lowercase.includes("number") || lowercase.includes("call") || lowercase.includes("tel")) {
    return LOCAL_FAQS[2].answer;
  }
  if (lowercase.includes("email") || lowercase.includes("mail") || lowercase.includes("contact")) {
    return LOCAL_FAQS[3].answer;
  }
  if (lowercase.includes("emergency") || lowercase.includes("after-hour") || lowercase.includes("after hours") || lowercase.includes("night") || lowercase.includes("closed")) {
    return LOCAL_FAQS[4].answer;
  }
  if (lowercase.includes("service") || lowercase.includes("treatment") || lowercase.includes("care") || lowercase.includes("do you do")) {
    return LOCAL_FAQS[5].answer;
  }
  if (lowercase.includes("cat") || lowercase.includes("board") || lowercase.includes("stay")) {
    return LOCAL_FAQS[6].answer;
  }
  if (lowercase.includes("microchip") || lowercase.includes("chip")) {
    return LOCAL_FAQS[7].answer;
  }
  if (lowercase.includes("xray") || lowercase.includes("x-ray") || lowercase.includes("radiography") || lowercase.includes("scan")) {
    return LOCAL_FAQS[8].answer;
  }
  if (lowercase.includes("weight") || lowercase.includes("fat") || lowercase.includes("overweight") || lowercase.includes("diet") || lowercase.includes("slimmers") || lowercase.includes("kilos")) {
    return LOCAL_FAQS[9].answer;
  }
  if (lowercase.includes("book") || lowercase.includes("appointment") || lowercase.includes("calendly") || lowercase.includes("schedule")) {
    return LOCAL_FAQS[10].answer;
  }
  if (lowercase.includes("new patient") || lowercase.includes("register") || lowercase.includes("started") || lowercase.includes("first time")) {
    return LOCAL_FAQS[11].answer;
  }
  if (lowercase.includes("bring") || lowercase.includes("records") || lowercase.includes("records")) {
    return LOCAL_FAQS[12].answer;
  }
  if (lowercase.includes("dental") || lowercase.includes("teeth") || lowercase.includes("tooth") || lowercase.includes("mouth")) {
    return LOCAL_FAQS[13].answer;
  }
  if (lowercase.includes("obedience") || lowercase.includes("train") || lowercase.includes("dog obedience") || lowercase.includes("puppy class")) {
    return LOCAL_FAQS[14].answer;
  }

  // General default helpful response
  return "Pawsy is here to help! You can book an appointment instantly at https://calendly.com/pawsy1432/heritage-veterinary-clinic, call us on (03) 9386 1501, or ask about our services, opening hours, location, or team.";
};

const parseTextWithLinks = (
  text: string, 
  customLinkClass = "font-semibold underline text-[#00827F] hover:text-[#005B94]"
) => {
  if (!text) return "";
  
  // Regex to capture markdown links like: [Label Text](https://link.com)
  const markdownRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
  const parts = text.split(markdownRegex);
  
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
        if (match) {
          const [_, label, url] = match;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${customLinkClass} inline-flex items-center gap-0.5`}
            >
              {label} <Calendar size={12} className="inline ml-0.5" />
            </a>
          );
        }
        
        // If there are raw links remaining inside this plain part, parse them too:
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const subParts = part.split(urlRegex);
        
        return (
          <React.Fragment key={i}>
            {subParts.map((subPart, j) => {
              if (subPart.match(urlRegex)) {
                const isCalendly = subPart.includes("calendly.com");
                return (
                  <a
                    key={`${i}-${j}`}
                    href={subPart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${customLinkClass} inline-flex items-center gap-0.5`}
                  >
                    {isCalendly ? "Calendly Link" : subPart} <Calendar size={12} className="inline ml-0.5" />
                  </a>
                );
              }
              return subPart;
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const PawsyChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi there! 🐾 I'm Pawsy, your Heritage Vet Assistant. How can I help you and your pet companion today? You can ask me about our services, opening hours, bookings, or tell me if it is an emergency.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<"ai" | "fallback">("ai");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    const newUserMessage: Message = {
      id: userMsgId,
      sender: "user",
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    const isUrgent = checkIsEmergency(text);

    // If it's an emergency, handle instantly on the client side for maximum speed and safety
    if (isUrgent) {
      setTimeout(() => {
        setIsTyping(false);
        const emergencyReply: Message = {
          id: `bot-emergency-${Date.now()}`,
          sender: "bot",
          text: "This sounds urgent — please call Advanced Vet Care in Kensington now at (03) 9092 0400, or go to your nearest emergency vet. They provide 24/7 care as we do not have an after-hours vet on-site.",
          timestamp: new Date(),
          isEmergency: true
        };
        setMessages(prev => [...prev, emergencyReply]);
      }, 700);
      return;
    }

    // Call server API for Gemini AI response
    try {
      // Format chat history for backend (Express server /api/chat expects history)
      const chatHistory = messages
        .filter(m => m.id !== "welcome") // skip welcome message
        .map(m => ({
          role: m.sender === "user" ? "user" : "model",
          content: m.text
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setIsTyping(false);

      if (data.fallback) {
        // Server indicates fallback (e.g. Gemini key not set)
        setChatMode("fallback");
        const fallbackText = getLocalAnswer(text);
        const botReply: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: fallbackText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botReply]);
      } else {
        // Standard AI response
        setChatMode("ai");
        const botReply: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botReply]);
      }
    } catch (error) {
      console.warn("Could not connect to Gemini API, running local matching engine:", error);
      setIsTyping(false);
      setChatMode("fallback");
      const fallbackText = getLocalAnswer(text);
      const botReply: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: fallbackText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botReply]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const suggestions = [
    "🐾 Book Appointment",
    "🚨 Emergency Care",
    "🕒 Opening Hours",
    "🐱 Cat Boarding",
    "🐕 Dog Obedience"
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* 1. CHAT WINDOW PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl sm:w-[380px]"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between bg-radial from-[#00669C] to-[#01517c] px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl font-bold backdrop-blur-xs">
                  🐶
                  <span className="absolute bottom-0 right-0 h-3 width-3 rounded-full border-2 border-[#00669C] bg-green-400"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-sm leading-none tracking-wide text-white">Pawsy Assistant</h3>
                    {chatMode === "ai" && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-400/20 px-1.5 py-0.5 text-[10px] font-bold text-teal-300">
                        <Sparkles size={8} /> AI
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-teal-100/80">Heritage Vet Clinic Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-teal-100 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Emergency Hotline Alert Quick Banner */}
            <div className="bg-red-50 px-3 py-1.5 border-b border-red-100 flex items-center justify-between text-xs text-red-700">
              <span className="font-medium flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-red-500 animate-pulse" /> Urgent Emergency?
              </span>
              <a
                href="tel:0390920400"
                className="font-bold underline hover:text-red-900 transition-colors"
              >
                Call (03) 9092 0400
              </a>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 space-y-4">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div className="max-w-[85%]">
                      {/* Bubble content */}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                          isBot
                            ? msg.isEmergency
                              ? "bg-red-100 border-2 border-red-500 text-red-900 rounded-tl-none font-medium"
                              : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                            : "bg-[#00669C] text-white rounded-tr-none"
                        }`}
                      >
                        {parseTextWithLinks(
                          msg.text, 
                          isBot 
                            ? "font-semibold underline text-[#00827F] hover:text-[#005B94]" 
                            : "font-semibold underline text-teal-100 hover:text-white"
                        )}

                        {/* Emergency Quick Action Button if emergency msg */}
                        {msg.isEmergency && (
                          <div className="mt-2.5 flex flex-col gap-1.5">
                            <a
                              href="tel:0390920400"
                              className="flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-center text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition-colors"
                            >
                              <Phone size={12} /> Call Advanced Vet Care
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {/* Timestamp */}
                      <span className={`block mt-1 text-[10px] text-gray-400 ${!isBot && "text-right"}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-none border border-gray-100 bg-white px-4 py-3 shadow-xs">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="border-t border-gray-100 bg-white py-2 px-3">
              <p className="mb-1 text-[10px] font-semibold text-gray-400 tracking-wider uppercase px-1">Quick Topics</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(sug.replace(/[^a-zA-Z\s]/g, "").trim())}
                    className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 hover:border-[#00827F] hover:bg-teal-50/50 hover:text-[#00827F] transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-2 border-t border-gray-100 bg-white p-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about opening hours, services, booking..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-[#00669C] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00669C] text-white hover:bg-[#005B94] disabled:opacity-40 disabled:hover:bg-[#00669C] transition-colors cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CHAT TRIGGER BUBBLE BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-radial from-[#00669C] to-[#01517c] text-white shadow-xl hover:from-[#005a8a] hover:to-[#01476d] focus:outline-hidden cursor-pointer"
      >
        {isOpen ? <ChevronDown size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};
