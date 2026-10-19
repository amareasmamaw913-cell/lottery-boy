export interface PrizeTier {
  rank: number;
  name: string; // e.g. "1st Prize (Jackpot)", "2nd Prize", "3rd Prize"
  matchRequirement: string; // e.g. "All 3 numbers match", "Any 2 numbers match"
  amountETB: number; // e.g. 10000, 3000, 1000
  percentageOfPool?: number;
}

export interface LotterySettings {
  ticketPriceETB: number;
  numberRangeMin: number; // 1
  numberRangeMax: number; // 100
  pickCount: number; // e.g. 3 numbers
  maxTicketsPerPerson: number; // e.g. 5
  prizeMode: 'fixed' | 'pool_growth';
  fixedPrizes: PrizeTier[];
  drawScheduleType: 'weekly' | 'daily' | 'single_event';
  nextDrawTime: string; // ISO datetime
  registrationCloseMinutesBefore: number; // e.g. 30 mins
  requireAge18: boolean;
  claimDeadlineDays: number; // e.g. 30 days
  organizerPin: string; // default e.g. "1234"
  complianceNote: string;
}

export interface DrawAuditRecord {
  id: string;
  drawNumber: number;
  drawDate: string;
  drawnNumbers: number[];
  totalTicketsSold: number;
  totalPoolETB: number;
  winnersCount: number;
  winners: {
    ticketNumber: string;
    participantName: string;
    phoneMasked: string;
    matchedNumbers: number[];
    prizeRank: string;
    prizeAmountETB: number;
    payoutStatus: 'paid_telebirr' | 'pending_claim';
  }[];
  randomSeed: string;
}

export const DEFAULT_LOTTERY_SETTINGS: LotterySettings = {
  ticketPriceETB: 50,
  numberRangeMin: 1,
  numberRangeMax: 100,
  pickCount: 3,
  maxTicketsPerPerson: 5,
  prizeMode: 'fixed',
  fixedPrizes: [
    { rank: 1, name: '1st Prize (Jackpot)', matchRequirement: 'All 3 numbers match', amountETB: 50000 },
    { rank: 2, name: '2nd Prize', matchRequirement: 'Any 2 numbers match', amountETB: 15000 },
    { rank: 3, name: '3rd Prize', matchRequirement: 'Any 1 number match', amountETB: 2000 }
  ],
  drawScheduleType: 'weekly',
  nextDrawTime: new Date(Date.now() + 86400000 * 3).toISOString(),
  registrationCloseMinutesBefore: 30,
  requireAge18: true,
  claimDeadlineDays: 30,
  organizerPin: '1234',
  complianceNote: 'Authorized under Ethiopian National Lottery Administration guidelines.'
};
