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
