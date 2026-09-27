export interface LeaderboardEntry {
  id: string;
  studentName: string;
  rollNo?: string;
  deptId: string;
  deptCode: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number; // in seconds
  date: string;
  grade: string;
}

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "lead-1",
    studentName: "Aravindhan S.",
    rollNo: "953621104012",
    deptId: "cse",
    deptCode: "CSE",
    score: 15,
    total: 15,
    percentage: 100,
    timeTaken: 82,
    date: "Sep 25, 2026",
    grade: "Gold Scholar"
  },
  {
    id: "lead-2",
    studentName: "Priyadharshini K.",
    rollNo: "953621243028",
    deptId: "aids",
    deptCode: "AI&DS",
    score: 15,
    total: 15,
    percentage: 100,
    timeTaken: 95,
    date: "Sep 25, 2026",
    grade: "Gold Scholar"
  },
  {
    id: "lead-3",
    studentName: "Manojkumar M.",
    rollNo: "953621106034",
    deptId: "ece",
    deptCode: "ECE",
    score: 14,
    total: 15,
    percentage: 93,
    timeTaken: 110,
    date: "Sep 24, 2026",
    grade: "Gold Scholar"
  },
  {
    id: "lead-4",
    studentName: "Sneha Ramasamy",
    rollNo: "953621205041",
    deptId: "it",
    deptCode: "IT",
    score: 14,
    total: 15,
    percentage: 93,
    timeTaken: 118,
    date: "Sep 24, 2026",
    grade: "Gold Scholar"
  },
  {
    id: "lead-5",
    studentName: "Vigneshwaran P.",
    rollNo: "953621114055",
    deptId: "mech",
    deptCode: "MECH",
    score: 13,
    total: 15,
    percentage: 87,
    timeTaken: 125,
    date: "Sep 23, 2026",
    grade: "First Class with Distinction"
  },
  {
    id: "lead-6",
    studentName: "Keerthana B.",
    rollNo: "953621244019",
    deptId: "csbs",
    deptCode: "CSBS",
    score: 13,
    total: 15,
    percentage: 87,
    timeTaken: 134,
    date: "Sep 23, 2026",
    grade: "First Class with Distinction"
  },
  {
    id: "lead-7",
    studentName: "Balaji R.",
    rollNo: "953621105008",
    deptId: "eee",
    deptCode: "EEE",
    score: 12,
    total: 15,
    percentage: 80,
    timeTaken: 142,
    date: "Sep 22, 2026",
    grade: "First Class with Distinction"
  },
  {
    id: "lead-8",
    studentName: "Kavitha S.",
    rollNo: "953621103022",
    deptId: "civil",
    deptCode: "CIVIL",
    score: 12,
    total: 15,
    percentage: 80,
    timeTaken: 150,
    date: "Sep 22, 2026",
    grade: "First Class with Distinction"
  }
];
