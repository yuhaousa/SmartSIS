
import React from 'react';

export type Language = 'en' | 'zh';

export interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  avatar: string;
  grade: string;
  attendanceRate: number;
  enrollmentDate: string;
  expectedGraduationDate: string;
  status: 'Active' | 'Inactive';
}

export interface MonthlyScore {
  month: string;
  score: number;
  comment?: string;
}

export interface ExamResult {
  subject: string;
  score: number;
  monthlyScores?: MonthlyScore[];
  date: string;
  teacherComment: string;
  semester: string;
}

export interface StudentRecord extends Student {
  results: ExamResult[];
  activities: string[];
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar: string;
  officeLocation: string;
  availableDays: number[];
}

export interface NavItem {
  id: string;
  labelEn: string;
  labelZh: string;
  icon: React.ElementType;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface University {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  logo: string;
  banner: string;
  description: string;
  type: 'Public' | 'Private';
  established: number;
  ranking: string;
  worldRanking: number; // Added for numeric filtering
  averageTuition: string;
  minGPA: string;
  englishRequirement: string;
  features: string[];
  programs: {
    name: string;
    level: string;
    tuition: string;
    duration: string;
  }[];
}

export interface UniversityApplication {
  id: string;
  studentId: string;
  universityName: string;
  program: string;
  intake: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  appliedDate: string;
  personalInfo: {
    surname: string;
    givenName: string;
    dob: string;
    gender: string;
    nationality: string;
    religion: string;
    icPassport: string;
    passportExpiry?: string;
    languages: string;
  };
  contactInfo: {
    mobile: string;
    email: string;
    address: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  academicInfo: {
    lastSchool: string;
    highestQualification: string;
    gpa: string;
    englishProficiency: string;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
  }[];
}
