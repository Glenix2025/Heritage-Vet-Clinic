export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  isEmergency?: boolean;
}

export interface ServiceItem {
  name: string;
  description: string;
  icon: string;
}

export interface ServiceCategory {
  title: string;
  description: string;
  services: ServiceItem[];
}

export interface StaffMember {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  emoji?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
