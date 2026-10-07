// Buy It Now listings priced at least 20% under the card's 90-day median sale.
// Static fixtures until the eBay listing pipeline is wired up.

export type Deal = {
  id: string
  playerId: string
  title: string
  product: string
  subset: string
  parallel: string
  run: number | null
  askCents: number
  listedHoursAgo: number
  compsCents: number[]
}

export const DEAL_THRESHOLD = 0.2
export const dealsCheckedMinutesAgo = 12

export const deals: Deal[] = [
  {
    id: 'd1',
    playerId: 'tre-vaughn',
    title: '2025 Bowman University Chrome Tre Vaughn 1st Bowman Auto Purple /250 BUC-TV',
    product: '2025 Bowman University Chrome',
    subset: '1st Bowman Auto',
    parallel: 'Purple',
    run: 250,
    askCents: 9900,
    listedHoursAgo: 3,
    compsCents: [15500, 17900, 14200, 19800, 16400, 21000, 15000],
  },
  {
    id: 'd2',
    playerId: 'jayden-caldwell',
    title: '2025 Bowman University Chrome Jayden Caldwell 1st Bowman Auto BUC-JC',
    product: '2025 Bowman University Chrome',
    subset: '1st Bowman Auto',
    parallel: 'Base',
    run: null,
    askCents: 19999,
    listedHoursAgo: 7,
    compsCents: [27500, 29900, 26000, 31000, 28400, 30500, 25900, 29000],
  },
  {
    id: 'd3',
    playerId: 'darius-pettway',
    title: '2025 Bowman University Chrome Darius Pettway 1st Auto Aqua /199 BUC-DP',
    product: '2025 Bowman University Chrome',
    subset: '1st Bowman Auto',
    parallel: 'Aqua',
    run: 199,
    askCents: 8500,
    listedHoursAgo: 15,
    compsCents: [11800, 12400, 14900, 10500, 13300, 12000],
  },
  {
    id: 'd4',
    playerId: 'marcus-oduya',
    title: '2024 Bowman University Chrome Marcus Oduya 1st Bowman Auto Refractor /499',
    product: '2024 Bowman University Chrome',
    subset: '1st Bowman Auto',
    parallel: 'Refractor',
    run: 499,
    askCents: 21500,
    listedHoursAgo: 22,
    compsCents: [27900, 31500, 29000, 33800, 28500, 30200, 26900],
  },
  {
    id: 'd5',
    playerId: 'colton-frank',
    title: '2024 Bowman University Chrome Colton Frank 1st Bowman Auto BUC-CF',
    product: '2024 Bowman University Chrome',
    subset: '1st Bowman Auto',
    parallel: 'Base',
    run: null,
    askCents: 11500,
    listedHoursAgo: 29,
    compsCents: [15400, 16900, 14800, 17500, 15100, 18200, 14400],
  },
  {
    id: 'd6',
    playerId: 'deshawn-riley',
    title: '2025 Sage Hit Deshawn Riley Autograph Gold /50 A-9',
    product: '2025 Sage Hit',
    subset: 'Autograph',
    parallel: 'Gold',
    run: 50,
    askCents: 3999,
    listedHoursAgo: 41,
    compsCents: [5600, 6200, 4900, 5900, 7100],
  },
  {
    id: 'd7',
    playerId: 'isaiah-monroe',
    title: '2024 Bowman University Chrome Isaiah Monroe 1st Auto Refractor /499 BUC-IM',
    product: '2024 Bowman University Chrome',
    subset: '1st Bowman Auto',
    parallel: 'Refractor',
    run: 499,
    askCents: 9000,
    listedHoursAgo: 58,
    compsCents: [11900, 12500, 10800, 13600, 11200, 12900],
  },
  {
    id: 'd8',
    playerId: 'brady-whitlock',
    title: '2023 Bowman University Chrome Brady Whitlock 1st Bowman Auto BUC-BW',
    product: '2023 Bowman University Chrome',
    subset: '1st Bowman Auto',
    parallel: 'Base',
    run: null,
    askCents: 3500,
    listedHoursAgo: 96,
    compsCents: [4800, 4500, 5100, 4400, 5600, 4700],
  },
]

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

export function dealDiscount(deal: Deal): number {
  const m = median(deal.compsCents)
  return (m - deal.askCents) / m
}

export function formatListedAgo(hours: number): string {
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}
