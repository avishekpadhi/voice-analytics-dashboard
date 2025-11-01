export const CallDetails = [
  { date: "Mon", averageDuration: 3.2, totalCalls: 98 },
  { date: "Tue", averageDuration: 3.8, totalCalls: 120 },
  { date: "Wed", averageDuration: 4.1, totalCalls: 140 },
  { date: "Thu", averageDuration: 2.9, totalCalls: 105 },
  { date: "Fri", averageDuration: 3.6, totalCalls: 134 },
];

export interface CallDataType {
  date: string;
  averageDuration: number;
  totalCalls: number;
}

export interface CallAnalysisType {
  category: string;
  count: number;
}

export const CallAnalysisData = [
  { category: "Caller Identification", count: 35 },
  { category: "Incorrect caller identity", count: 20 },
  { category: "User refused to confirm identity", count: 10 },
  { category: "Unsupported Language", count: 15 },
  { category: "Customer Hostility", count: 10 },
  { category: "Verbal Aggression", count: 10 },
  { category: "Call Drop", count: 5 },
  { category: "Technical Error", count: 7 },
  { category: "No Response", count: 4 },
  { category: "Accent Issue", count: 3 },
  { category: "Late Response", count: 12 },
  { category: "Dropped Before Greeting", count: 6 },
  { category: "System Timeout", count: 8 },
  { category: "Agent Not Available", count: 9 },
  { category: "Language Barrier", count: 14 },
];
