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
  comment?: string; // Teacher's comment for the specific month
}

export interface ExamResult {
  subject: string;
  score: number; // This acts as the Semester Total/Average
  monthlyScores?: MonthlyScore[]; // New field for monthly breakdown
  date: string;
  teacherComment: string;
  semester: string;
}

export interface StudentRecord extends Student {
  results: ExamResult[];
  activities: string[];
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