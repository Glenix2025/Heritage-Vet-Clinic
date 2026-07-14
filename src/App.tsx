import React, { useState, ChangeEvent, FormEvent } from "react";
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Facebook, 
  Star, 
  StarHalf,
  CheckCircle2, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  Heart, 
  Sparkles, 
  Award,
  ExternalLink,
  ChevronRight,
  Stethoscope,
  Activity,
  Award as DiplomaIcon,
  Menu,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SvgLogo } from "./components/SvgLogo";
import { PawsyChatbot } from "./components/PawsyChatbot";
import { ServiceCategory, StaffMember, FaqItem } from "./types";

const parseTextWithLinks = (
  text: string, 
  customLinkClass = "font-semibold underline text-heritage-teal"
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

// Google Maps Reviews Data with actual initials, names, and positive feedback from real clients
const GOOGLE_REVIEWS = [
  {
    name: "Roula Kostoulias",
    subtext: "Local Guide · 78 reviews · 78 photos",
    avatar: null,
    avatarBg: "bg-teal-600",
    rating: 5,
    date: "a year ago",
    text: "Absolutely excellent service and Dr,Rob was amazing with my Jack Russell's. My boy gets scared with vets but Dr Rob was amazing with him. I found them reasonably priced and the service fantastic.\n\nThank you ❤️",
    images: []
  },
  {
    name: "Sandra Salmon",
    subtext: "Local Guide · 20 reviews · 1 photo",
    avatar: null,
    avatarBg: "bg-blue-600",
    rating: 5,
    date: "8 months ago",
    text: "Until you go somewhere else eg Lort Smith you don't realise how exceptional Heritage Vets are. I cannot praise them enough for the care they have provided our cats, chickens and a rescue dog over the years as well as the compassion and caring they have shown us when our pets have died and the practical good advice they have given about our animals health issues. They really are a wonderful practice staffed with knowledgeable, sensible and empathic professionals. Thank you Heritage Vets.",
    images: []
  },
  {
    name: "Thee P",
    subtext: "Local Guide · 27 reviews · 12 photos",
    avatar: null,
    avatarBg: "bg-indigo-600",
    rating: 5,
    date: "a year ago",
    text: "Rob and the team here at Heritage Veterinary Clinic have been amazing over the years\nTheir commitment and dedication to animal health and wellbeing are outstanding\nThank you",
    images: []
  },
  {
    name: "Sara Kenworthy",
    subtext: "2 reviews",
    avatar: null,
    avatarBg: "bg-emerald-700",
    rating: 5,
    date: "6 months ago",
    text: "Dr Rob and the team at Heritage vets have looked after my old cat with such care. I can't thanks them all enough.",
    images: []
  },
  {
    name: "Peter Coonawarra",
    subtext: "Local Guide · 144 reviews · 59 photos",
    avatar: null,
    avatarBg: "bg-slate-600",
    rating: 5,
    date: "8 months ago",
    text: "Great vets - they've looked after our (now) elderly cats with care and attention to detail. We really appreciate having this clinic so nearby.",
    images: []
  }
];

// Static Services Data structured by categories (Routine / Advanced / Lifestyle)
const SERVICES_DATA: ServiceCategory[] = [
  {
    title: "Routine Care",
    description: "Essential preventative services to keep your pet happy, active, and healthy throughout their life.",
    services: [
      {
        name: "Health Examinations",
        description: "Thorough physical check-ups to assess dental health, joint function, heart rate, and overall condition.",
        icon: "Stethoscope"
      },
      {
        name: "Vaccinations",
        description: "Core vaccines tailored to your pet's age and lifestyle to defend against dangerous local infections.",
        icon: "Shield"
      },
      {
        name: "Microchipping",
        description: "Quick, permanent identification procedure required in Victoria to help reunite you with lost pets.",
        icon: "Award"
      },
      {
        name: "Dental Care",
        description: "Professional scaling, polishing, and oral check-ups to treat dental plaque and protect vital organs.",
        icon: "Activity"
      },
      {
        name: "Desexing",
        description: "Safe surgical procedures for male and female companion animals, improving health and behavior.",
        icon: "Heart"
      },
      {
        name: "Flea & Worming Advice",
        description: "Custom preventative regimes protecting against fleas, heartworms, lungworms, and ticks in Coburg.",
        icon: "Sparkles"
      }
    ]
  },
  {
    title: "Advanced Diagnostics & Surgery",
    description: "Cutting-edge on-site technologies and sterile surgical theatres for precise diagnosis and treatments.",
    services: [
      {
        name: "Digital Radiography",
        description: "High-resolution digital X-rays to instantly assess bone fractures, swallowed foreign objects, or organ sizes.",
        icon: "Shield"
      },
      {
        name: "Ultrasonography",
        description: "Non-invasive ultrasound scans providing real-time imaging of abdominal organs, pregnancy, or cardiac flow.",
        icon: "Activity"
      },
      {
        name: "Surgical Procedures",
        description: "Fully monitored sterile surgical operations ranging from soft-tissue repairs to complex orthopedic interventions.",
        icon: "Stethoscope"
      }
    ]
  },
  {
    title: "Lifestyle & Support",
    description: "Comprehensive care extending beyond medicine to foster obedience, nutrition, and safe boarding.",
    services: [
      {
        name: "Cat Boarding",
        description: "A comfortable, fully enclosed feline-only retreat. Air-conditioned with direct veterinary monitoring.",
        icon: "Heart"
      },
      {
        name: "Nutritional Information",
        description: "Tailored dietary advice addressing digestive issues, skin allergies, growing puppies, or senior needs.",
        icon: "Sparkles"
      },
      {
        name: "Dog Obedience Support",
        description: "Nurse-led clinical support and personalized guidance to navigate puppy development and adolescent behaviors.",
        icon: "Award"
      },
      {
        name: "Pet Slimmers Program",
        description: "Guided clinical weight-loss program featuring regular nurse weigh-ins and calorie-controlled diet plans.",
        icon: "Activity"
      }
    ]
  }
];

// Clinical Team Data
const TEAM_DATA: StaffMember[] = [
  {
    name: "Dr. Rob",
    role: "Principal Veterinarian & Clinic Director",
    bio: "Rob graduated at the University of Melbourne and has been in the veterinary profession for over 30 years. He has dedicated his career to small animal healthcare, combining advanced general surgery with diagnostic precision. Families in Coburg value his calm presence and pragmatic, honest clinical advice.",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    emoji: "👨‍⚕️",
    specialties: ["General Surgery", "Internal Medicine", "Diagnostic Imaging", "Veterinary Ethics"]
  },
  {
    name: "Dr. Michael",
    role: "Senior Veterinarian",
    bio: "Dr. Michael brings over 15 years of dedicated medical experience to Heritage Vets. Highly praised in reviews for his thorough, gentle examinations, Michael has a special clinical interest in feline diagnostics, senior pet geriatric programs, and advanced veterinary dentistry.",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    emoji: "👨‍⚕️",
    specialties: ["Feline Medicine", "Geriatric Care", "Veterinary Dentistry", "Preventative Care"]
  },
  {
    name: "Nurse Helen",
    role: "Head Veterinary Nurse & Practice Manager",
    bio: "Helen has coordinated the nursing and administration team at Heritage Vets for over a decade. She manages our feline boarding suites, oversees patient anesthesia, and coordinates clinical care with absolute compassion. Helen is known for making every pet and owner feel like family.",
    avatarUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400",
    emoji: "👩‍⚕️",
    specialties: ["Anesthetic Monitoring", "Cat Boarding Coordinator", "Practice Operations", "Client Relations"]
  },
  {
    name: "Nurse Chloe",
    role: "Veterinary Nurse & Puppy Coach",
    bio: "Chloe holds specialized credentials in veterinary nursing and canine behavior. She conducts our puppy development workshops, manages the 'Pet Slimmers' program, and specializes in low-stress clinical handling, ensuring that even the most anxious pets feel safe and relaxed.",
    avatarUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400",
    emoji: "👩‍⚕️",
    specialties: ["Puppy Behavior Advice", "Obesity Care", "Stress-Free Handling", "Nutritional Therapy"]
  }
];

// Clinic 15 FAQs
const FAQ_DATA: FaqItem[] = [
  {
    question: "What are your opening hours?",
    answer: "We're open Monday to Friday, 8:30am–5:30pm. We're closed on weekends, so if it's outside these hours, please see our after-hours emergency info below."
  },
  {
    question: "Where are you located?",
    answer: "We're located at 274 Sydney Rd, Coburg VIC 3058. Our clinic is highly visible on Sydney Road, with convenient nearby street parking."
  },
  {
    question: "What's your phone number?",
    answer: "You can reach us during opening hours on 03 9386 1501. If you're calling after hours, please contact our recommended emergency clinic."
  },
  {
    question: "Can I email the clinic?",
    answer: "Yes, you can email us at admin@heritagevets.com.au for general inquiries, record transfers, or boarding requests, and we will get back to you as soon as possible."
  },
  {
    question: "Do you have an emergency or after-hours vet on-site?",
    answer: "We do not offer on-site after-hours emergency care. For urgent after-hours cases, we recommend calling Advanced Vet Care in Kensington on 03 9092 0400 immediately."
  },
  {
    question: "What services do you offer?",
    answer: "We offer comprehensive health examinations, microchipping, vaccinations, desexing, dental care, general surgery, digital radiography (X-rays), ultrasonography, flea/worming treatments, nutritional counseling, feline boarding, puppy obedience support, and the Pet Slimmers weight-management program."
  },
  {
    question: "Do you offer cat boarding?",
    answer: "Yes, we operate a premium, fully indoor, feline-only cat boarding facility. Contact our team in advance to check seasonal availability and boarding rates."
  },
  {
    question: "Do you do microchipping?",
    answer: "Yes. Microchipping is a fast, safe, and mandatory legal requirement in Victoria. We can easily administer microchips during any general consultation."
  },
  {
    question: "Can I get X-rays done for my pet?",
    answer: "Yes, we have a digital radiography suite on-site, allowing us to perform high-resolution X-ray scans and evaluate bone or organ health immediately."
  },
  {
    question: "Do you help with weight management for overweight pets?",
    answer: "Absolutely! Our specialized 'Pet Slimmers' program is led by our veterinary nursing team, providing custom weight-loss milestones, food portioning, and routine weigh-ins."
  },
  {
    question: "How do I book an appointment?",
    answer: "You can book instantly online via our Calendly portal (https://calendly.com/pawsy1432/heritage-veterinary-clinic) or call us during clinic hours on 03 9386 1501."
  },
  {
    question: "I'm a new patient — how do I get started?",
    answer: "Welcome to Heritage! You can use our Calendly link to book a 'New Patient Consultation' or call our clinic. We will collect owner details, your pet's profile, and any previous records."
  },
  {
    question: "What should I bring to my pet's first appointment?",
    answer: "Please bring any previous vaccination cards, medical histories, a list of current medications, and details about your pet's current diet."
  },
  {
    question: "Do you offer dental care for pets?",
    answer: "Yes, we provide dental scaling, ultrasonic polishing, and extractions under general anesthesia to treat advanced periodontal disease and protect your pet's heart and kidneys."
  },
  {
    question: "Do you provide nurse-led dog obedience support?",
    answer: "Yes! Our nursing staff has extensive training in dog behaviors and can guide you through positive reinforcement techniques and socialization during physical exams."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Contact Form State
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    petName: "",
    petType: "Dog",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate brief API submit
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSuccess(true);
      setFormData({
        ownerName: "",
        email: "",
        phone: "",
        petName: "",
        petType: "Dog",
        message: ""
      });
    }, 1200);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to map string icon names to Lucide elements
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Stethoscope":
        return <Stethoscope className="h-6 w-6 text-heritage-teal" />;
      case "Shield":
        return <Shield className="h-6 w-6 text-heritage-teal" />;
      case "Activity":
        return <Activity className="h-6 w-6 text-heritage-teal" />;
      case "Heart":
        return <Heart className="h-6 w-6 text-heritage-teal" />;
      case "Sparkles":
        return <Sparkles className="h-6 w-6 text-heritage-teal" />;
      default:
        return <Award className="h-6 w-6 text-heritage-teal" />;
    }
  };

  // Filter FAQs based on search string
  const filteredFaqs = FAQ_DATA.filter(faq => {
    const query = faqSearch.toLowerCase();
    return faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-slate-50/30 text-gray-800 font-sans antialiased">
      
      {/* ========================================================
          STICKY UPPER HEADING: TOP HOURS & ADDRESS BANNER 
         ======================================================== */}
      <div className="bg-heritage-blue text-white py-2 px-4 text-xs font-medium border-b border-white/10 relative z-40 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-blue-100">
              <Clock size={13} className="text-teal-300" /> Mon–Fri: 8:30am – 5:30pm (Closed Weekends)
            </span>
            <span className="flex items-center gap-1.5 text-blue-100">
              <MapPin size={13} className="text-teal-300" /> 274 Sydney Rd, Coburg VIC 3058
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="tel:0393861501" 
              className="flex items-center gap-1.5 text-white font-semibold hover:text-teal-200 transition-colors"
            >
              <Phone size={13} className="text-teal-300" /> Clinic: 03 9386 1501
            </a>
            <a 
              href="mailto:admin@heritagevets.com.au" 
              className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors"
            >
              <Mail size={13} className="text-teal-300" /> admin@heritagevets.com.au
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Top Call Quick Strip */}
      <div className="md:hidden bg-heritage-blue text-white py-2 px-4 text-center text-xs font-semibold flex justify-between items-center">
        <span className="flex items-center gap-1"><Clock size={12} /> Mon-Fri 8:30am-5:30pm</span>
        <a href="tel:0393861501" className="bg-teal-600 px-2.5 py-1 rounded-sm flex items-center gap-1 text-white">
          <Phone size={11} /> Call Clinic
        </a>
      </div>

      {/* ========================================================
          STICKY HEADER & MAIN NAVIGATION
         ======================================================== */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Svg Logo */}
          <button onClick={() => handleTabChange("home")} className="flex items-center transition-transform hover:scale-[1.01] cursor-pointer text-left">
            <SvgLogo className="h-12 md:h-14 w-auto" />
          </button>

          {/* Nav items */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-600">
            <button 
              onClick={() => handleTabChange("home")} 
              className={`pb-1 transition-colors relative cursor-pointer ${activeTab === "home" ? "text-heritage-blue font-extrabold border-b-2 border-heritage-teal" : "hover:text-heritage-blue"}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleTabChange("services")} 
              className={`pb-1 transition-colors relative cursor-pointer ${activeTab === "services" ? "text-heritage-blue font-extrabold border-b-2 border-heritage-teal" : "hover:text-heritage-blue"}`}
            >
              Our Services
            </button>
            <button 
              onClick={() => handleTabChange("team")} 
              className={`pb-1 transition-colors relative cursor-pointer ${activeTab === "team" ? "text-heritage-blue font-extrabold border-b-2 border-heritage-teal" : "hover:text-heritage-blue"}`}
            >
              Meet the Team
            </button>
            <button 
              onClick={() => handleTabChange("faq")} 
              className={`pb-1 transition-colors relative cursor-pointer ${activeTab === "faq" ? "text-heritage-blue font-extrabold border-b-2 border-heritage-teal" : "hover:text-heritage-blue"}`}
            >
              FAQs
            </button>
            <button 
              onClick={() => handleTabChange("contact")} 
              className={`pb-1 transition-colors relative cursor-pointer ${activeTab === "contact" ? "text-heritage-blue font-extrabold border-b-2 border-heritage-teal" : "hover:text-heritage-blue"}`}
            >
              Contact
            </button>
          </nav>

          {/* Action Button & Hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="https://calendly.com/pawsy1432/heritage-veterinary-clinic"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center bg-heritage-teal hover:bg-heritage-blue text-white px-6 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Book Appointment <ExternalLink size={13} className="ml-1.5" />
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-heritage-blue transition-colors rounded-full hover:bg-gray-50 focus:outline-hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-100 bg-white shadow-xl overflow-hidden px-4 py-4 space-y-2 absolute top-20 left-0 w-full z-20"
            >
              <button 
                onClick={() => handleTabChange("home")}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === "home" ? "bg-teal-50 text-heritage-teal" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Home Dashboard
              </button>
              <button 
                onClick={() => handleTabChange("services")}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === "services" ? "bg-teal-50 text-heritage-teal" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Our Clinical Services
              </button>
              <button 
                onClick={() => handleTabChange("team")}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === "team" ? "bg-teal-50 text-heritage-teal" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Meet the Team
              </button>
              <button 
                onClick={() => handleTabChange("faq")}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === "faq" ? "bg-teal-50 text-heritage-teal" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Frequently Asked Questions
              </button>
              <button 
                onClick={() => handleTabChange("contact")}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === "contact" ? "bg-teal-50 text-heritage-teal" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Contact & Directions
              </button>
              
              <div className="pt-2 border-t border-gray-100">
                <a
                  href="https://calendly.com/pawsy1432/heritage-veterinary-clinic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center bg-heritage-teal hover:bg-heritage-teal-dark text-white py-3 rounded-xl font-extrabold text-sm shadow-md"
                >
                  Book Appointment <ExternalLink size={14} className="ml-1.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================
          DYNAMIC MAIN CONTENT ROUTED BY STATE Tab
         ======================================================== */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex-1"
        >
          {/* 1. HOME VIEW */}
          {activeTab === "home" && (
            <div>
              {/* HERO SECTION */}
              <section className="relative overflow-hidden bg-gradient-to-b from-heritage-cream/60 via-teal-50/10 to-white py-16 lg:py-24 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column Content */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                      
                      {/* Trust Google Review Count Bar */}
                      <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300">
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <StarHalf size={14} fill="currentColor" />
                        </span>
                        <span className="text-xs font-bold text-gray-700">
                          4.7/5 stars based on 318 Google Reviews
                        </span>
                      </div>

                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-heritage-blue leading-[1.1] tracking-tight">
                        Exceptional Care For Your <span className="text-heritage-teal italic">Companion Animals</span>
                      </h1>
                      
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                        Heritage Veterinary Clinic provides comprehensive medical, surgical, and preventative care on Sydney Road, Coburg. Our local clinical team combines decades of medical expertise with genuine, warm veterinary medicine.
                      </p>

                      {/* Multi-CTAs */}
                      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                        <a
                          href="https://calendly.com/pawsy1432/heritage-veterinary-clinic"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center bg-heritage-teal hover:bg-heritage-blue text-white px-8 py-4 rounded-full text-sm font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 tracking-wide cursor-pointer"
                        >
                          Book Online Instantly <Calendar className="ml-2" size={16} />
                        </a>
                        
                        <a
                          href="tel:0393861501"
                          className="w-full sm:w-auto inline-flex items-center justify-center bg-white border-2 border-heritage-teal text-heritage-teal hover:bg-heritage-teal/5 px-8 py-3.5 rounded-full text-sm font-extrabold transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          Call 03 9386 1501 <Phone className="ml-2" size={16} />
                        </a>
                      </div>

                      {/* Direct Address Badge */}
                      <p className="text-xs font-semibold text-gray-500 flex items-center justify-center lg:justify-start gap-1.5 pt-1">
                        <MapPin size={13} className="text-heritage-teal" /> 274 Sydney Rd, Coburg VIC 3058 | Easy access, open Mon-Fri
                      </p>
                    </div>

                    {/* Right Column Arched Images Collage */}
                    <div className="lg:col-span-5 relative mt-16 lg:mt-0 flex flex-col items-center lg:items-end justify-center">
                      <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-teal-100/40 blur-3xl z-0"></div>
                      <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl z-0"></div>
                      
                      {/* Decorative elements of Vet's on Crown branding: arches, soft layouts, gold circles */}
                      <div className="relative z-10 flex items-end gap-4 sm:gap-6 pb-6 pr-2">
                        
                        {/* Dog Arch Card */}
                        <div className="relative rounded-t-[140px] rounded-b-3xl overflow-hidden bg-white p-3 border border-gray-100 shadow-2xl transform rotate-[-2deg] hover:rotate-0 hover:scale-[1.03] transition-all duration-500 w-[190px] sm:w-[220px] shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400" 
                            alt="Dog clinic checkup" 
                            className="w-full h-[240px] sm:h-[280px] object-cover rounded-t-[128px] rounded-b-2xl"
                          />
                          <div className="pt-3 pb-1 text-center">
                            <span className="text-[11px] sm:text-xs font-extrabold text-heritage-blue tracking-wide uppercase block">Compassionate Care</span>
                          </div>
                        </div>

                        {/* Cat Arch Card */}
                        <div className="relative rounded-t-[110px] rounded-b-3xl overflow-hidden bg-white p-2.5 border border-gray-100 shadow-xl transform rotate-[2deg] hover:rotate-0 hover:scale-[1.03] transition-all duration-500 w-[140px] sm:w-[170px] shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400" 
                            alt="Feline veterinary care" 
                            className="w-full h-[160px] sm:h-[200px] object-cover rounded-t-[100px] rounded-b-2xl"
                          />
                          <div className="pt-2.5 pb-0.5 text-center">
                            <span className="text-[9px] sm:text-[10px] font-extrabold text-heritage-teal tracking-wide uppercase block">Stress-Free Clinic</span>
                          </div>
                        </div>

                        {/* Circular Floating Badge - Positioned cleanly in the empty space above Cat card */}
                        <div className="absolute top-4 -right-2 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-heritage-blue text-white flex flex-col items-center justify-center text-center p-3 shadow-xl border-4 border-white z-20 transform rotate-[12deg] transition-all duration-300 hover:scale-110">
                          <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-teal-300">Independent</span>
                          <span className="text-xs font-heading font-extrabold mt-0.5 leading-tight">Family Owned</span>
                          <span className="text-[7px] sm:text-[8px] font-bold text-gray-300 mt-1">Est. 1996</span>
                        </div>
                      </div>

                      {/* Info overlay banner - relative block spacing below the collage to prevent overlap */}
                      <div className="relative mt-2 bg-white/95 backdrop-blur-xs border border-teal-100/50 shadow-xl px-5 py-3.5 rounded-full flex items-center gap-3 w-80 z-20 mx-auto lg:mr-4">
                        <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center text-heritage-teal font-extrabold text-xs shrink-0 border border-teal-100">
                          ✓
                        </div>
                        <div className="text-left">
                          <h4 className="font-extrabold text-xs text-gray-900 leading-none">After-Hours Support</h4>
                          <p className="text-[9px] text-gray-500 mt-1 leading-none">Emergency care partners available 24/7</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* CORE VALUES */}
              <section className="py-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-xs font-bold uppercase tracking-widest text-heritage-teal">Why Choose Heritage</span>
                    <h2 className="text-3xl font-heading font-extrabold text-heritage-blue mt-2">
                      Trusted Small Animal Care on Sydney Road
                    </h2>
                    <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                      We stand out by maintaining a highly personal, non-corporate touch, ensuring your pet is greeted by the same friendly faces at every visit.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Value 1 */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-gray-100 hover:border-[#00827F]/20 hover:bg-white hover:shadow-xl transition-all group">
                      <div className="h-12 w-12 rounded-xl bg-[#00827F]/10 flex items-center justify-center text-heritage-teal group-hover:bg-[#00827F] group-hover:text-white transition-all">
                        <Stethoscope size={24} />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mt-4">Full-Service Surgical Theatre</h3>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        From routine desexing to soft-tissue procedures, our clinic houses advanced surgical and monitoring equipment.
                      </p>
                    </div>

                    {/* Value 2 */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-gray-100 hover:border-[#00827F]/20 hover:bg-white hover:shadow-xl transition-all group">
                      <div className="h-12 w-12 rounded-xl bg-[#00827F]/10 flex items-center justify-center text-heritage-teal group-hover:bg-[#00827F] group-hover:text-white transition-all">
                        <Shield size={24} />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mt-4">Preventative Wellness Programs</h3>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        Customized diagnostic checks, vaccinations, puppy development guidance, and professional flea and tick advice.
                      </p>
                    </div>

                    {/* Value 3 */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-gray-100 hover:border-[#00827F]/20 hover:bg-white hover:shadow-xl transition-all group">
                      <div className="h-12 w-12 rounded-xl bg-[#00827F]/10 flex items-center justify-center text-heritage-teal group-hover:bg-[#00827F] group-hover:text-white transition-all">
                        <Activity size={24} />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mt-4">Active Weight & Obesity Clinics</h3>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        Our nurse-led 'Pet Slimmers' program assists overweight cats and dogs in regaining active, pain-free mobility.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* QUICK TEAM PREVIEW SECTION */}
              <section className="py-20 bg-slate-50/30 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-heritage-teal">Over 30 Years of Clinical History</span>
                      <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-heritage-blue">
                        Meet Our Principal Veterinarian
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Heritage Veterinary Clinic operates under the experienced guidance of Dr. Rob, a highly regarded practitioner who graduated from the University of Melbourne and has served families across Coburg for over three decades.
                      </p>
                      <div className="pt-2">
                        <button 
                          onClick={() => handleTabChange("team")}
                          className="inline-flex items-center gap-1.5 rounded-full bg-heritage-blue hover:bg-heritage-blue-dark text-white px-6 py-3 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md hover:shadow-lg"
                        >
                          Meet Our Entire Staff <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-100 shadow-lg flex flex-col md:flex-row gap-6 items-center hover:border-teal-500/10 transition-all">
                      <div className="h-24 w-24 rounded-full bg-linear-to-b from-teal-50 to-teal-100/50 text-5xl flex items-center justify-center shrink-0 border border-teal-200/40 shadow-xs">
                        👨‍⚕️
                      </div>
                      <div className="space-y-3 text-center md:text-left">
                        <div>
                          <h4 className="font-heading font-bold text-lg text-gray-900 leading-none">Dr. Rob</h4>
                          <span className="text-xs font-bold text-heritage-teal mt-1 inline-block">Principal Veterinarian & Clinic Director</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          "Rob graduated at the University of Melbourne and has been in the veterinary profession for over 30 years. He has dedicated his career to small animal healthcare, combining advanced general surgery with diagnostic precision. Families in Coburg value his calm presence and pragmatic, honest clinical advice."
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-1.5 pt-1">
                          <span className="bg-slate-50 border border-gray-100 text-[9px] font-bold text-gray-600 px-2 py-0.5 rounded-md">General Surgery</span>
                          <span className="bg-slate-50 border border-gray-100 text-[9px] font-bold text-gray-600 px-2 py-0.5 rounded-md">Diagnostic Imaging</span>
                          <span className="bg-slate-50 border border-gray-100 text-[9px] font-bold text-gray-600 px-2 py-0.5 rounded-md">UoM Alumnus</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* GOOGLE REVIEWS SECTION */}
              <section className="py-20 bg-slate-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-heritage-teal">Google Maps Reviews</span>
                    <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-heritage-blue mt-2">
                      Loved by Coburg Pet Owners
                    </h2>
                    <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                      We are proud to maintain a 4.7/5 star rating on Google with over 310+ reviews. Here is what our lovely local community says about our care:
                    </p>
                  </div>

                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:balance] w-full">
                    {GOOGLE_REVIEWS.map((review, idx) => (
                      <div 
                        key={idx}
                        className="break-inside-avoid mb-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col gap-4 group"
                      >
                        {/* Reviewer Header */}
                        <div className="flex items-start gap-3">
                          {review.avatar ? (
                            <img 
                              src={review.avatar} 
                              alt={review.name}
                              className="h-10 w-10 rounded-full object-cover border border-slate-100 mt-0.5"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-xs ${review.avatarBg || 'bg-slate-400'} mt-0.5 shrink-0 tracking-wider`}>
                              {review.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{review.name}</h4>
                            {review.subtext && (
                              <p className="text-[10px] text-gray-400 truncate mt-0.5">{review.subtext}</p>
                            )}
                          </div>
                          <span className="text-xs bg-slate-50 text-slate-400 h-6 w-6 rounded-full flex items-center justify-center font-bold shrink-0">
                            G
                          </span>
                        </div>

                        {/* Stars & Date */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={13} fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium">• {review.date}</span>
                        </div>

                        {/* Review Text */}
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line italic">
                          "{review.text}"
                        </p>

                        {/* Pet Images (Google Maps attachment style) */}
                        {review.images && review.images.length > 0 && (
                          <div className={`grid gap-2 mt-2 ${review.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {review.images.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                                <img 
                                  src={imgUrl} 
                                  alt={`Pet uploaded by ${review.name}`} 
                                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Google Reviews Badge */}
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-heading font-extrabold text-heritage-blue">4.7</span>
                      <div className="text-left">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <StarHalf size={14} fill="currentColor" />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-semibold">318 reviews on Google Maps</p>
                      </div>
                    </div>
                    <a 
                      href="https://www.google.com/maps/place/Heritage+Veterinary+Clinic/@-37.7479392,144.9655864,17z/data=!4m8!3m7!1s0x6ad644b20a4793f7:0xa7f6172dfb1782f7!8m2!3d-37.7479392!4d144.9655864!9m1!1b1!16s%2Fg%2F1tjcpl7n?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-heritage-blue hover:underline"
                    >
                      View All Google Maps Reviews <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </section>

              {/* BOOKING CALL-TO-ACTION */}
              <section className="bg-gradient-to-br from-heritage-teal to-heritage-teal-dark text-white py-16 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid-white" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-white)" />
                  </svg>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/20 px-3 py-1 text-xs font-bold text-teal-300">
                    <Sparkles size={13} /> Smooth Digital Booking Portal
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white leading-tight">
                    Schedule Your Companion's Next Wellness Check
                  </h2>
                  <p className="text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
                    Access our secure Calendly reservation portal to pick a time slot that matches your routine, or contact our Sydney Road receptionist directly for personalized triage assistance.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <a 
                      href="https://calendly.com/pawsy1432/heritage-veterinary-clinic"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-heritage-teal hover:bg-heritage-teal-dark text-white font-extrabold px-8 py-3.5 rounded-xl text-sm tracking-wide shadow-md cursor-pointer"
                    >
                      Book Securely with Calendly
                    </a>
                    <a 
                      href="tel:0393861501"
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold px-8 py-3.5 rounded-xl text-sm tracking-wide transition-all cursor-pointer"
                    >
                      Call Clinic: 03 9386 1501
                    </a>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* 2. SERVICES VIEW */}
          {activeTab === "services" && (
            <section className="py-16 sm:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-bold uppercase tracking-widest text-heritage-teal">Our Professional Services</span>
                  <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-heritage-blue mt-2 leading-tight">
                    Expert Veterinary Medicine
                  </h1>
                  <p className="text-gray-500 mt-3 text-base leading-relaxed">
                    Heritage Veterinary Clinic delivers a wide tier of clinical services, combining routine preventative care, on-site diagnostics, surgical capabilities, and nurse-led specialized programs.
                  </p>
                </div>

                {/* Category Controller */}
                <div className="flex flex-wrap gap-2 justify-center p-2 bg-heritage-cream border border-gray-200/40 rounded-full mb-12 max-w-2xl mx-auto shadow-xs">
                  {SERVICES_DATA.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedServiceCategory(idx)}
                      className={`px-6 py-3 text-xs font-extrabold rounded-full transition-all duration-300 cursor-pointer ${
                        selectedServiceCategory === idx
                          ? "bg-heritage-teal text-white shadow-md scale-[1.02]"
                          : "text-gray-500 hover:text-heritage-blue hover:bg-white/50"
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>

                {/* Active Category Description Panel */}
                <div className="mb-8 p-8 bg-heritage-cream/40 border border-teal-100/30 rounded-2xl text-center max-w-4xl mx-auto">
                  <p className="text-lg text-heritage-blue font-heading font-extrabold tracking-tight">
                    {SERVICES_DATA[selectedServiceCategory].title} Overview
                  </p>
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed max-w-2xl mx-auto">
                    {SERVICES_DATA[selectedServiceCategory].description}
                  </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {SERVICES_DATA[selectedServiceCategory].services.map((service, idx) => (
                    <div 
                      key={idx}
                      className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center mb-6 border border-teal-100/50">
                          {renderServiceIcon(service.icon)}
                        </div>
                        <h4 className="font-heading font-bold text-lg text-gray-900">{service.name}</h4>
                        <p className="text-gray-500 text-sm mt-3 leading-relaxed">{service.description}</p>
                      </div>
                      
                      <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Heritage Care</span>
                        <a 
                          href="https://calendly.com/pawsy1432/heritage-veterinary-clinic"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-heritage-teal hover:text-heritage-blue inline-flex items-center gap-1 group cursor-pointer"
                        >
                          Book Consultation <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ADDITIONAL INFO ZONE */}
                <div className="mt-20 p-8 rounded-2xl bg-slate-50 border border-slate-100/80 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-heading font-extrabold text-heritage-teal">What to Expect at Your Appointment</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Consultations run for approximately 20 minutes, allowing our veterinarians ample time to perform head-to-tail checks, review pet history, explain diagnoses, and respond to all your care concerns.
                    </p>
                    <ul className="space-y-2.5 text-xs text-gray-600">
                      <li className="flex items-center gap-2 font-medium">
                        <CheckCircle2 size={16} className="text-heritage-teal" /> Please bring prior health or vaccination record booklets.
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <CheckCircle2 size={16} className="text-heritage-teal" /> Dogs should reside securely on collars and leads.
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <CheckCircle2 size={16} className="text-heritage-teal" /> Cats must arrive in secure crates for their comfort.
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h4 className="font-heading font-bold text-sm text-gray-900">Need Immediate Advice?</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Talk with Pawsy, our automated chatbot assistant available 24/7. Pawsy can clarify vaccine schedules, outline boarding guidelines, explain after-hours triage, and direct booking inquiries.
                    </p>
                    <button 
                      onClick={() => {
                        const event = new CustomEvent("open-pawsy-chat");
                        window.dispatchEvent(event);
                      }}
                      className="w-full inline-flex items-center justify-center bg-heritage-teal hover:bg-heritage-teal-dark text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Launch Pawsy Chatbot 🐾
                    </button>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* 3. MEET THE TEAM VIEW */}
          {activeTab === "team" && (
            <section className="py-16 sm:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-bold uppercase tracking-widest text-heritage-teal">Our Compassionate Doctors & Nurses</span>
                  <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-heritage-blue mt-2 leading-tight">
                    Meet the Heritage Care Team
                  </h1>
                  <p className="text-gray-500 mt-3 text-base leading-relaxed">
                    Heritage Veterinary Clinic is guided by a small, dedicated staff of animal welfare professionals. We believe in stable, honest relationships, ensuring your pet meets the same veterinarian and nurse at every checkup.
                  </p>
                </div>

                {/* Team Grid with Styled Emojis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {TEAM_DATA.map((member, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl hover:border-teal-500/10 transition-all flex flex-col group"
                    >
                      {/* Arched Premium Avatar Frame */}
                      <div className="pt-8 px-6 flex justify-center bg-heritage-cream/40 border-b border-gray-100 relative">
                        <div className="relative rounded-t-full bg-linear-to-b from-teal-50 to-teal-100/40 h-44 w-32 border-4 border-white shadow-md flex items-center justify-center text-5xl select-none transform group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                          {member.emoji || "👨‍⚕️"}
                          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-100 shadow-xs">
                            <span className="text-[8px] font-extrabold text-heritage-teal uppercase tracking-widest leading-none block whitespace-nowrap">Staff</span>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-100 shadow-xs">
                          <span className="text-[9px] font-extrabold text-heritage-blue uppercase tracking-wider">Verified</span>
                        </div>
                      </div>

                      {/* Info block */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-heading font-bold text-lg text-gray-900 leading-tight">{member.name}</h3>
                          <p className="text-xs font-bold text-heritage-teal mt-1">{member.role}</p>
                          <p className="text-gray-500 text-xs mt-4 leading-relaxed">{member.bio}</p>
                        </div>

                        {/* Specialties List */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Specialties</span>
                          <div className="flex flex-wrap gap-1">
                            {member.specialties.map((spec, specIdx) => (
                              <span 
                                key={specIdx} 
                                className="bg-slate-50 text-gray-600 border border-gray-100 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DETAILED PHILOSOPHY STATEMENTS */}
                <div className="mt-20 p-8 rounded-3xl bg-slate-50 border border-gray-100">
                  <div className="text-center max-w-2xl mx-auto space-y-4">
                    <span className="h-10 w-10 rounded-full bg-blue-100 text-heritage-blue flex items-center justify-center mx-auto text-lg font-bold">
                      💡
                    </span>
                    <h3 className="text-2xl font-heading font-extrabold text-heritage-blue">Our Non-Corporate Philosophy</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      We choose to remain an independent, family-oriented local veterinary clinic on Sydney Road. This independence allows our clinical practitioners to deliver personalized care schedules, spend quality time with your animals, and propose medical protocols matching your financial budget and ethical values.
                    </p>
                    <div className="flex justify-center gap-6 pt-2">
                      <div className="text-center">
                        <span className="block text-xl font-extrabold text-heritage-teal">30+ Years</span>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Local Care in Coburg</span>
                      </div>
                      <div className="border-r border-gray-200"></div>
                      <div className="text-center">
                        <span className="block text-xl font-extrabold text-heritage-teal">UoM</span>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">University Grad Vets</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* 4. FAQS VIEW (With Searchable Input) */}
          {activeTab === "faq" && (
            <section className="py-16 sm:py-20 bg-slate-50/50">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-heritage-teal">Instant Answers Database</span>
                  <h1 className="text-4xl font-heading font-extrabold text-heritage-blue mt-2 leading-tight">
                    Frequently Asked Questions
                  </h1>
                  <p className="text-gray-500 mt-3 text-sm">
                    Have questions about clinical surgery, vaccination intervals, cat boarding, or emergency triage? Search our interactive FAQ list compiled by our veterinary staff.
                  </p>
                </div>

                {/* Search Bar Input */}
                <div className="relative max-w-xl mx-auto mb-10 shadow-xs rounded-full">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-400">
                    <Search size={18} />
                  </div>
                  <input 
                    type="text"
                    placeholder="Search FAQs (e.g., hours, location, price, boarding)..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full bg-white rounded-full border border-gray-200 pl-12 pr-12 py-3.5 text-sm focus:border-heritage-teal focus:ring-1 focus:ring-heritage-teal focus:outline-hidden shadow-xs hover:border-gray-300 transition-all duration-300"
                  />
                  {faqSearch && (
                    <button 
                      onClick={() => setFaqSearch("")}
                      className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-xs text-gray-400 hover:text-gray-600 font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filtered FAQs Accordion list */}
                {filteredFaqs.length > 0 ? (
                  <div className="space-y-3">
                    {filteredFaqs.map((faq, idx) => {
                      const isExpanded = activeFaq === idx;
                      return (
                        <div 
                          key={idx}
                          className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs transition-all"
                        >
                          <button
                            onClick={() => setActiveFaq(isExpanded ? null : idx)}
                            className="w-full flex items-center justify-between px-6 py-4.5 text-left font-bold text-sm text-gray-900 hover:bg-slate-50/50 transition-colors focus:outline-hidden cursor-pointer"
                          >
                            <span className="pr-4">{faq.question}</span>
                            <span className={`text-heritage-teal transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                              <ChevronDown size={18} />
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="px-6 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-50 bg-slate-50/20">
                                  {parseTextWithLinks(faq.answer, "font-semibold text-heritage-teal underline")}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
                    <span className="text-3xl block">🔍</span>
                    <h4 className="font-heading font-bold text-sm text-gray-900 mt-2">No matching questions found</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Try searching with other keywords, or ask Pawsy our interactive clinical chatbot assistant!
                    </p>
                    <button 
                      onClick={() => setFaqSearch("")}
                      className="mt-4 text-xs font-bold text-heritage-teal hover:underline"
                    >
                      View All FAQs
                    </button>
                  </div>
                )}

              </div>
            </section>
          )}

          {/* 5. CONTACT VIEW */}
          {activeTab === "contact" && (
            <section className="py-16 sm:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-bold uppercase tracking-widest text-heritage-teal">Contact & Location</span>
                  <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-heritage-blue mt-2 leading-tight">
                    Visit Our Coburg Clinic
                  </h1>
                  <p className="text-gray-500 mt-3 text-base leading-relaxed">
                    Have questions or want to register as a new client? Reach out using the secure form, call our clinic team directly, or visit our physical practice on Sydney Road.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Left Column: Modern Contact Form */}
                  <div className="lg:col-span-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-lg">
                    <span className="text-xs font-bold uppercase tracking-widest text-heritage-teal">Connect With Us</span>
                    <h3 className="text-2xl font-heading font-extrabold text-heritage-blue mt-1">Get In Touch</h3>
                    <p className="text-gray-500 text-xs mt-1 mb-6">
                      Fill out the form below for general questions, cat boarding updates, or puppy workshops.
                    </p>

                    {formSuccess ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-teal-50 border border-teal-200 p-6 rounded-xl text-center"
                      >
                        <div className="h-12 w-12 rounded-full bg-teal-100 text-heritage-teal flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                          ✓
                        </div>
                        <h4 className="font-heading font-bold text-base text-teal-900">Message Received!</h4>
                        <p className="text-xs text-teal-700 mt-2">
                          Thanks for reaching out. A member of the Heritage Care Team will respond to your inquiry via phone or email shortly.
                        </p>
                        <button
                          onClick={() => setFormSuccess(false)}
                          className="mt-5 text-xs font-bold bg-heritage-teal text-white px-4 py-2 rounded-lg hover:bg-heritage-teal-dark transition-colors cursor-pointer"
                        >
                          Send Another Message
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-extrabold text-gray-700 mb-1.5 ml-1">Owner Full Name *</label>
                            <input 
                              type="text" 
                              name="ownerName"
                              required
                              value={formData.ownerName}
                              onChange={handleFormChange}
                              placeholder="John Doe" 
                              className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-heritage-teal focus:ring-1 focus:ring-heritage-teal focus:outline-hidden bg-white transition-all duration-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-extrabold text-gray-700 mb-1.5 ml-1">Email Address *</label>
                            <input 
                              type="email" 
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleFormChange}
                              placeholder="john@example.com" 
                              className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-heritage-teal focus:ring-1 focus:ring-heritage-teal focus:outline-hidden bg-white transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-extrabold text-gray-700 mb-1.5 ml-1">Phone Number *</label>
                            <input 
                              type="tel" 
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleFormChange}
                              placeholder="03 9386 1501" 
                              className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-heritage-teal focus:ring-1 focus:ring-heritage-teal focus:outline-hidden bg-white transition-all duration-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-extrabold text-gray-700 mb-1.5 ml-1">Pet Type</label>
                            <select 
                              name="petType"
                              value={formData.petType}
                              onChange={handleFormChange}
                              className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-heritage-teal focus:ring-1 focus:ring-heritage-teal focus:outline-hidden bg-white transition-all duration-300 h-[42px]"
                            >
                              <option value="Dog">Dog</option>
                              <option value="Cat">Cat</option>
                              <option value="Bird">Bird</option>
                              <option value="Rabbit">Rabbit</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-gray-700 mb-1.5 ml-1">Pet Name (Optional)</label>
                          <input 
                            type="text" 
                            name="petName"
                            value={formData.petName}
                            onChange={handleFormChange}
                            placeholder="Buddy" 
                            className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-heritage-teal focus:ring-1 focus:ring-heritage-teal focus:outline-hidden bg-white transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-gray-700 mb-1.5 ml-1">Your Message *</label>
                          <textarea 
                            name="message"
                            required
                            rows={4}
                            value={formData.message}
                            onChange={handleFormChange}
                            placeholder="How can our clinical team support your companion animal..." 
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-heritage-teal focus:ring-1 focus:ring-heritage-teal focus:outline-hidden bg-white transition-all duration-300"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex items-center justify-center bg-heritage-teal hover:bg-heritage-blue text-white px-6 py-4 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
                        >
                          {isSubmitting ? "Sending Inquiry..." : "Submit Contact Form"}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Right Column: Address Details & Map Placement */}
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-heritage-teal">Our Physical Location</span>
                      <h3 className="text-2xl font-heading font-extrabold text-heritage-blue mt-1">Visit Our Coburg Clinic</h3>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        We are conveniently located directly on Sydney Road in Coburg, with easily accessible public transit stops and adjacent street parking.
                      </p>

                      {/* Direct info list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="flex gap-3">
                          <MapPin className="text-heritage-teal shrink-0 mt-0.5" size={18} />
                          <div>
                            <h4 className="font-bold text-xs text-gray-900 leading-none">Address</h4>
                            <p className="text-xs text-gray-500 mt-1.5 leading-normal">
                              274 Sydney Rd,<br />Coburg VIC 3058
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Clock className="text-heritage-teal shrink-0 mt-0.5" size={18} />
                          <div>
                            <h4 className="font-bold text-xs text-gray-900 leading-none">Clinic Hours</h4>
                            <p className="text-xs text-gray-500 mt-1.5 leading-normal">
                              Mon–Fri: 8:30am – 5:30pm<br />
                              Sat–Sun: Closed
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Graphic Map Placeholder Frame */}
                    <div className="mt-8 relative rounded-2xl overflow-hidden border border-gray-200 bg-teal-50/50 aspect-video flex flex-col items-center justify-center p-6 text-center shadow-xs">
                      {/* Visual Map graphic background via clean SVGs */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id="grid-contact" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid-contact)" />
                        </svg>
                      </div>

                      <div className="relative z-10 space-y-3">
                        <div className="h-12 w-12 rounded-full bg-heritage-blue text-white flex items-center justify-center mx-auto shadow-md">
                          <MapPin size={22} className="animate-bounce" />
                        </div>
                        <div>
                          <h4 className="font-heading font-extrabold text-sm text-heritage-blue">274 Sydney Road, Coburg</h4>
                          <p className="text-gray-500 text-[11px] mt-1">Conveniently situated between Munro St & Moreland Rd</p>
                        </div>
                        <div className="pt-2">
                          <a 
                            href="https://maps.google.com/?q=274+Sydney+Rd,+Coburg+VIC+3058"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-heritage-teal text-white px-4 py-2 text-xs font-bold hover:bg-heritage-teal-dark transition-colors"
                          >
                            Open in Google Maps <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </section>
          )}
        </motion.main>
      </AnimatePresence>

      {/* ========================================================
          VETERINARY EMERGENCY REDIRECT ALERT ZONE
         ======================================================== */}
      <section className="bg-red-50 py-10 border-y border-red-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Shield size={20} className="animate-pulse" />
          </div>
          <h3 className="text-xl font-heading font-extrabold text-red-900">Are You Experiencing a Pet Emergency?</h3>
          <p className="text-xs text-red-700 leading-relaxed max-w-2xl mx-auto">
            Heritage Veterinary Clinic does not offer 24/7 on-site emergency care. If your animal is in acute distress outside of our Monday-Friday business hours, please call our local trusted emergency partner immediately.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
            <a 
              href="tel:0390920400"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-2.5 rounded-lg text-xs tracking-wider uppercase inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone size={13} /> Call Advanced Vet Care Kensington: 03 9092 0400
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          FOOTER ZONE
         ======================================================== */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Logo and Brand tagline */}
            <div className="space-y-4 md:col-span-2">
              <div className="bg-white/5 p-2 rounded-xl inline-block">
                <SvgLogo className="h-10 w-auto" />
              </div>
              <p className="text-xs text-slate-400 max-w-sm mt-3 leading-relaxed">
                Recreated modern premium sales assets demo for Heritage Veterinary Clinic. Providing medical and surgical services for small animal companions in Coburg, Victoria.
              </p>
              <div className="flex gap-4 pt-2">
                <a 
                  href="https://facebook.com/heritagevets" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-heritage-teal hover:text-white text-slate-400 transition-colors"
                >
                  <Facebook size={16} />
                </a>
              </div>
            </div>

            {/* Quick Site Links */}
            <div>
              <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => handleTabChange("home")} className="hover:text-white transition-colors cursor-pointer text-left">Home Dashboard</button></li>
                <li><button onClick={() => handleTabChange("services")} className="hover:text-white transition-colors cursor-pointer text-left">Our Services</button></li>
                <li><button onClick={() => handleTabChange("team")} className="hover:text-white transition-colors cursor-pointer text-left">Clinic Staff</button></li>
                <li><button onClick={() => handleTabChange("faq")} className="hover:text-white transition-colors cursor-pointer text-left">FAQ Answers</button></li>
                <li><button onClick={() => handleTabChange("contact")} className="hover:text-white transition-colors cursor-pointer text-left">Contact Form</button></li>
              </ul>
            </div>

            {/* Clinic details */}
            <div>
              <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-4">Contact Info</h4>
              <ul className="space-y-3.5 text-xs">
                <li className="flex gap-2">
                  <MapPin size={15} className="text-heritage-teal shrink-0" />
                  <span>274 Sydney Rd, Coburg VIC 3058</span>
                </li>
                <li className="flex gap-2">
                  <Phone size={15} className="text-heritage-teal shrink-0" />
                  <a href="tel:0393861501" className="hover:text-white transition-colors">03 9386 1501</a>
                </li>
                <li className="flex gap-2">
                  <Mail size={15} className="text-heritage-teal shrink-0" />
                  <a href="mailto:admin@heritagevets.com.au" className="hover:text-white transition-colors">admin@heritagevets.com.au</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>© 2026 Heritage Veterinary Clinic Sales Demo. Constructed with Google AI Studio.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="https://calendly.com/pawsy1432/heritage-veterinary-clinic" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">Calendly Booking Portal</a>
              <span className="text-slate-700">|</span>
              <span className="text-slate-500">Not affiliated with live clinic. sales-pitch demo only.</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================
          EMBEDDED FLOATING AI CHATBOT - PAWSY
         ======================================================== */}
      <PawsyChatbot />

    </div>
  );
}
