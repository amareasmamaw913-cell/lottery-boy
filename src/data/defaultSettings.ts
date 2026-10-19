import { LotterySettings, DrawAuditRecord } from '../types/lotteryRules';

// Set next draw time to 3 days from now at 20:00 EAT
const nextSunday = new Date();
nextSunday.setDate(nextSunday.getDate() + 3);
nextSunday.setHours(20, 0, 0, 0);

export const DEFAULT_LOTTERY_SETTINGS: LotterySettings = {
  ticketPriceETB: 50,
  numberRangeMin: 1,
  numberRangeMax: 100,
  pickCount: 3,
  maxTicketsPerPerson: 5,
  prizeMode: 'fixed',
  fixedPrizes: [
    {
      rank: 1,
      name: '1st Prize (Grand Jackpot)',
      matchRequirement: 'Match all 3 numbers',
      amountETB: 15000,
      percentageOfPool: 60
    },
    {
      rank: 2,
      name: '2nd Prize (Tier 2)',
      matchRequirement: 'Match any 2 numbers',
      amountETB: 4000,
      percentageOfPool: 25
    },
    {
      rank: 3,
      name: '3rd Prize (Consolation)',
      matchRequirement: 'Match any 1 number',
      amountETB: 1000,
      percentageOfPool: 15
    }
  ],
  drawScheduleType: 'weekly',
  nextDrawTime: nextSunday.toISOString(),
  registrationCloseMinutesBefore: 30,
  requireAge18: true,
  claimDeadlineDays: 30,
  organizerPin: '1234',
  complianceNote: 'Operates in accordance with Ethiopian National Lottery Administration guidelines. Strictly 18+ only.'
};

export const SAMPLE_AUDIT_HISTORY: DrawAuditRecord[] = [
  {
    id: 'draw_042',
    drawNumber: 42,
    drawDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    drawnNumbers: [7, 21, 77],
    totalTicketsSold: 124,
    totalPoolETB: 6200,
    winnersCount: 3,
    winners: [
      {
        ticketNumber: 'LUCK-82914',
        participantName: 'Amare Asmamaw',
        phoneMasked: '+251 91 *** 4567',
        matchedNumbers: [7, 21, 77],
        prizeRank: '1st Prize (Grand Jackpot)',
        prizeAmountETB: 15000,
        payoutStatus: 'paid_telebirr'
      },
      {
        ticketNumber: 'LUCK-39102',
        participantName: 'Selamawit Tadesse',
        phoneMasked: '+251 92 *** 9210',
        matchedNumbers: [3, 9, 21],
        prizeRank: '2nd Prize',
        prizeAmountETB: 4000,
        payoutStatus: 'paid_telebirr'
      },
      {
        ticketNumber: 'LUCK-44921',
        participantName: 'Daniel J.',
        phoneMasked: '+1 415 *** 0192',
        matchedNumbers: [7],
        prizeRank: '3rd Prize',
        prizeAmountETB: 1000,
        payoutStatus: 'pending_claim'
      }
    ],
    randomSeed: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  }
];
