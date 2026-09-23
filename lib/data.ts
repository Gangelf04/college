// Mock data layer for College Cards.
// In production these shapes are filled by Convex from the SoldComps / eBay /
// CFBD pipelines described in the project doc. Here they are static fixtures
// so the UI can be built and reviewed end to end.

export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'EDGE' | 'CB' | 'S' | 'LB' | 'DL' | 'OT'
export type PlayerStatus = 'active' | 'drafted' | 'inactive'
export type Tier = 'hot' | 'standard'

export type SeasonStat = {
  season: number
  school: string
  games: number
  // position-relevant, pre-formatted line
  line: { label: string; value: string }[]
}

export type GameLog = {
  date: string
  opponent: string
  homeAway: 'H' | 'A'
  result: string
  line: string
}

export type CardSale = {
  id: string
  title: string
  product: string
  variant: string
  parallel?: string
  isAuto: boolean
  grade?: string
  priceCents: number
  baseCents?: number
  date: string
  format: 'Auction' | 'BIN' | 'Best Offer'
  bidCount?: number
}

export type PlayerCard = {
  id: string
  product: string
  year: number
  cardNumber: string
  subset: string
  parallels: { name: string; run: number | null }[]
  isAuto: boolean
  live: number
  sold: number
  marketCents: number
  highCents: number
  changePct: number
}

export type Player = {
  id: string
  name: string
  initials: string
  school: string
  schoolAbbr: string
  schoolColor: string
  position: Position
  classYear: 'FR' | 'SO' | 'JR' | 'SR'
  age: number
  status: PlayerStatus
  tier: Tier
  rank: number
  // market
  marketCents: number
  changePct: number
  volume: number
  volumeCents: number
  twmaCents: number
  liquidity: number // 0-10
  spark: number[]
  hot: boolean
  // draft
  projectedPick: number | null
  projectedPickPrev: number | null
  // scouting tool grades 20-80 scale for radar
  tools: { key: string; label: string; grade: number }[]
  bio: string
  firstCard: string
  seasons: SeasonStat[]
  gameLog: GameLog[]
  cards: PlayerCard[]
  sales: CardSale[]
}

function spark(seed: number, n = 14): number[] {
  const out: number[] = []
  let v = 50 + (seed % 20)
  for (let i = 0; i < n; i++) {
    v += Math.sin(seed + i * 1.3) * 6 + ((seed * (i + 3)) % 7) - 3
    out.push(Math.max(8, Math.round(v)))
  }
  return out
}

export function formatMoney(cents: number, decimals = 0): string {
  const dollars = cents / 100
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatCompact(n: number): string {
  return Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

export const positionLabels: Record<Position, string> = {
  QB: 'Quarterback',
  RB: 'Running Back',
  WR: 'Wide Receiver',
  TE: 'Tight End',
  EDGE: 'Edge Rusher',
  CB: 'Cornerback',
  S: 'Safety',
  LB: 'Linebacker',
  DL: 'Defensive Line',
  OT: 'Offensive Tackle',
}

export const players: Player[] = [
  {
    id: 'jayden-caldwell',
    name: 'Jayden Caldwell',
    initials: 'JC',
    school: 'Texas',
    schoolAbbr: 'TEX',
    schoolColor: 'oklch(0.62 0.17 40)',
    position: 'QB',
    classYear: 'SO',
    age: 20,
    status: 'active',
    tier: 'hot',
    rank: 1,
    marketCents: 28400,
    changePct: 42.6,
    volume: 214,
    volumeCents: 5940000,
    twmaCents: 21200,
    liquidity: 9.1,
    spark: spark(3),
    hot: true,
    projectedPick: 4,
    projectedPickPrev: 9,
    tools: [
      { key: 'arm', label: 'Arm', grade: 65 },
      { key: 'acc', label: 'Accuracy', grade: 60 },
      { key: 'mobility', label: 'Mobility', grade: 70 },
      { key: 'poise', label: 'Poise', grade: 55 },
      { key: 'iq', label: 'IQ', grade: 60 },
      { key: 'deep', label: 'Deep Ball', grade: 65 },
    ],
    bio: 'Dual-threat trigger man with elite arm talent and a fearless deep game. National title run vaulted him up boards.',
    firstCard: '1st Bowman: 2024 Bowman University Chrome',
    seasons: [
      {
        season: 2024,
        school: 'Texas',
        games: 9,
        line: [
          { label: 'CMP%', value: '61.2' },
          { label: 'YDS', value: '2,184' },
          { label: 'TD', value: '18' },
          { label: 'INT', value: '6' },
          { label: 'RUSH', value: '412' },
        ],
      },
      {
        season: 2025,
        school: 'Texas',
        games: 13,
        line: [
          { label: 'CMP%', value: '67.8' },
          { label: 'YDS', value: '3,742' },
          { label: 'TD', value: '34' },
          { label: 'INT', value: '7' },
          { label: 'RUSH', value: '688' },
        ],
      },
    ],
    gameLog: [
      { date: 'Nov 29', opponent: 'Texas A&M', homeAway: 'H', result: 'W 31-24', line: '312 yds, 3 TD, 78 rush' },
      { date: 'Nov 22', opponent: 'at Arkansas', homeAway: 'A', result: 'W 45-17', line: '289 yds, 4 TD, 41 rush' },
      { date: 'Nov 15', opponent: 'Georgia', homeAway: 'H', result: 'L 27-30', line: '241 yds, 2 TD, 1 INT' },
      { date: 'Nov 8', opponent: 'at Vanderbilt', homeAway: 'A', result: 'W 38-10', line: '355 yds, 4 TD, 62 rush' },
    ],
    cards: [
      {
        id: 'buc-auto',
        product: 'Bowman University Chrome',
        year: 2025,
        cardNumber: 'BUC-JC',
        subset: '1st Bowman Auto',
        parallels: [
          { name: 'Base', run: null },
          { name: 'Refractor', run: 499 },
          { name: 'Blue', run: 150 },
          { name: 'Gold', run: 50 },
          { name: 'Superfractor', run: 1 },
        ],
        isAuto: true,
        live: 44,
        sold: 189,
        marketCents: 28400,
        highCents: 190000,
        changePct: 42.6,
      },
      {
        id: 'onit-base',
        product: 'ONIT NIL',
        year: 2025,
        cardNumber: '12',
        subset: 'Prospect',
        parallels: [
          { name: 'Base', run: null },
          { name: 'Silver', run: 199 },
          { name: 'Orange', run: 25 },
        ],
        isAuto: false,
        live: 61,
        sold: 240,
        marketCents: 4200,
        highCents: 22000,
        changePct: 18.1,
      },
      {
        id: 'panini-nil',
        product: 'Panini NIL',
        year: 2024,
        cardNumber: '88',
        subset: 'Base',
        parallels: [
          { name: 'Base', run: null },
          { name: 'Blue Prizm', run: 99 },
          { name: 'Gold Prizm', run: 10 },
        ],
        isAuto: false,
        live: 33,
        sold: 96,
        marketCents: 3600,
        highCents: 15000,
        changePct: -6.2,
      },
    ],
    sales: [
      { id: 's1', title: 'Jayden Caldwell 2025 Bowman University Chrome 1st Auto #BUC-JC', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 29100, date: 'Sep 22, 2026', format: 'Auction', bidCount: 14 },
      { id: 's2', title: 'Jayden Caldwell 2025 Bowman U Chrome 1st Auto Blue /150', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Blue', isAuto: true, priceCents: 89000, baseCents: 28730, date: 'Sep 22, 2026', format: 'Auction', bidCount: 22 },
      { id: 's3', title: 'Jayden Caldwell 2025 Bowman U Chrome 1st Auto Refractor /499', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Refractor', isAuto: true, priceCents: 62000, baseCents: 28730, date: 'Sep 22, 2026', format: 'BIN' },
      { id: 's4', title: 'Jayden Caldwell 2025 Bowman U Chrome 1st Auto PSA 10', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, grade: 'PSA 10', priceCents: 74000, date: 'Sep 21, 2026', format: 'BIN' },
      { id: 's5', title: 'Jayden Caldwell 2025 Bowman U Chrome 1st Auto #BUC-JC', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 26000, date: 'Sep 21, 2026', format: 'Auction', bidCount: 9 },
      { id: 's6', title: 'Jayden Caldwell ONIT NIL Orange /25', product: 'ONIT NIL', variant: 'Prospect', parallel: 'Orange', isAuto: false, priceCents: 15500, date: 'Sep 20, 2026', format: 'Best Offer' },
      { id: 's7', title: 'Jayden Caldwell 2025 Bowman U Chrome 1st Auto #BUC-JC', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 27500, date: 'Sep 20, 2026', format: 'Auction', bidCount: 11 },
    ],
  },
  {
    id: 'marcus-oduya',
    name: 'Marcus Oduya',
    initials: 'MO',
    school: 'Ohio State',
    schoolAbbr: 'OSU',
    schoolColor: 'oklch(0.6 0.19 20)',
    position: 'WR',
    classYear: 'JR',
    age: 21,
    status: 'active',
    tier: 'hot',
    rank: 2,
    marketCents: 19600,
    changePct: 61.3,
    volume: 302,
    volumeCents: 6820000,
    twmaCents: 12800,
    liquidity: 8.8,
    spark: spark(7),
    hot: true,
    projectedPick: 6,
    projectedPickPrev: 14,
    tools: [
      { key: 'speed', label: 'Speed', grade: 70 },
      { key: 'hands', label: 'Hands', grade: 60 },
      { key: 'routes', label: 'Routes', grade: 65 },
      { key: 'yac', label: 'YAC', grade: 65 },
      { key: 'sep', label: 'Separation', grade: 60 },
      { key: 'size', label: 'Size', grade: 50 },
    ],
    bio: 'Explosive vertical threat who took over the Big Ten title game. Elite testing profile drives the hobby buzz.',
    firstCard: '1st Bowman: 2024 Bowman University Chrome',
    seasons: [
      { season: 2023, school: 'Ohio State', games: 11, line: [ { label: 'REC', value: '38' }, { label: 'YDS', value: '612' }, { label: 'TD', value: '5' }, { label: 'YPC', value: '16.1' } ] },
      { season: 2024, school: 'Ohio State', games: 13, line: [ { label: 'REC', value: '61' }, { label: 'YDS', value: '1,044' }, { label: 'TD', value: '9' }, { label: 'YPC', value: '17.1' } ] },
      { season: 2025, school: 'Ohio State', games: 13, line: [ { label: 'REC', value: '74' }, { label: 'YDS', value: '1,308' }, { label: 'TD', value: '13' }, { label: 'YPC', value: '17.7' } ] },
    ],
    gameLog: [
      { date: 'Dec 6', opponent: 'Oregon', homeAway: 'H', result: 'W 28-21', line: '9 rec, 172 yds, 2 TD' },
      { date: 'Nov 29', opponent: 'Michigan', homeAway: 'H', result: 'W 24-13', line: '6 rec, 121 yds, 1 TD' },
      { date: 'Nov 22', opponent: 'at Illinois', homeAway: 'A', result: 'W 45-20', line: '7 rec, 98 yds' },
    ],
    cards: [
      { id: 'buc-auto', product: 'Bowman University Chrome', year: 2024, cardNumber: 'BUC-MO', subset: '1st Bowman Auto', parallels: [ { name: 'Base', run: null }, { name: 'Refractor', run: 499 }, { name: 'Green', run: 99 }, { name: 'Superfractor', run: 1 } ], isAuto: true, live: 52, sold: 214, marketCents: 19600, highCents: 120000, changePct: 61.3 },
      { id: 'leaf-metal', product: 'Leaf Metal Draft', year: 2025, cardNumber: 'M-14', subset: 'Prospect Auto', parallels: [ { name: 'Base', run: null }, { name: 'Prismatic', run: 25 } ], isAuto: true, live: 18, sold: 61, marketCents: 8800, highCents: 41000, changePct: 12.4 },
    ],
    sales: [
      { id: 's1', title: 'Marcus Oduya 2024 Bowman U Chrome 1st Auto #BUC-MO', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 20100, date: 'Sep 22, 2026', format: 'Auction', bidCount: 18 },
      { id: 's2', title: 'Marcus Oduya 2024 Bowman U Chrome 1st Auto Green /99', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Green', isAuto: true, priceCents: 47000, baseCents: 19300, date: 'Sep 22, 2026', format: 'Auction', bidCount: 25 },
      { id: 's3', title: 'Marcus Oduya 2024 Bowman U Chrome 1st Auto BGS 9.5', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, grade: 'BGS 9.5', priceCents: 39000, date: 'Sep 21, 2026', format: 'BIN' },
      { id: 's4', title: 'Marcus Oduya 2024 Bowman U Chrome 1st Auto #BUC-MO', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 18200, date: 'Sep 20, 2026', format: 'Auction', bidCount: 12 },
    ],
  },
  {
    id: 'deshawn-riley',
    name: 'DeShawn Riley',
    initials: 'DR',
    school: 'Georgia',
    schoolAbbr: 'UGA',
    schoolColor: 'oklch(0.5 0.16 20)',
    position: 'EDGE',
    classYear: 'JR',
    age: 21,
    status: 'active',
    tier: 'hot',
    rank: 3,
    marketCents: 11200,
    changePct: -14.8,
    volume: 141,
    volumeCents: 2210000,
    twmaCents: 13100,
    liquidity: 7.6,
    spark: spark(11),
    hot: true,
    projectedPick: 11,
    projectedPickPrev: 7,
    tools: [
      { key: 'bend', label: 'Bend', grade: 65 },
      { key: 'power', label: 'Power', grade: 60 },
      { key: 'burst', label: 'Burst', grade: 65 },
      { key: 'hands', label: 'Hands', grade: 55 },
      { key: 'run', label: 'Run D', grade: 55 },
      { key: 'motor', label: 'Motor', grade: 70 },
    ],
    bio: 'Twitchy edge with a deep pass-rush toolbox. Cooled off after a quiet playoff, opening a buy window.',
    firstCard: '1st Bowman: 2024 Bowman University Chrome',
    seasons: [
      { season: 2024, school: 'Georgia', games: 12, line: [ { label: 'TKL', value: '41' }, { label: 'TFL', value: '13.5' }, { label: 'SACK', value: '8.0' }, { label: 'FF', value: '3' } ] },
      { season: 2025, school: 'Georgia', games: 13, line: [ { label: 'TKL', value: '52' }, { label: 'TFL', value: '18.0' }, { label: 'SACK', value: '11.5' }, { label: 'FF', value: '4' } ] },
    ],
    gameLog: [
      { date: 'Dec 6', opponent: 'Texas', homeAway: 'A', result: 'L 20-24', line: '4 tkl, 1 TFL' },
      { date: 'Nov 29', opponent: 'Georgia Tech', homeAway: 'H', result: 'W 34-17', line: '6 tkl, 2 sack, FF' },
      { date: 'Nov 22', opponent: 'at Tennessee', homeAway: 'A', result: 'W 27-14', line: '5 tkl, 1.5 sack' },
    ],
    cards: [
      { id: 'buc-auto', product: 'Bowman University Chrome', year: 2024, cardNumber: 'BUC-DR', subset: '1st Bowman Auto', parallels: [ { name: 'Base', run: null }, { name: 'Refractor', run: 499 }, { name: 'Red', run: 25 } ], isAuto: true, live: 29, sold: 118, marketCents: 11200, highCents: 66000, changePct: -14.8 },
      { id: 'sage-hit', product: 'Sage Hit', year: 2025, cardNumber: 'A-9', subset: 'Autograph', parallels: [ { name: 'Base', run: null }, { name: 'Gold', run: 50 } ], isAuto: true, live: 14, sold: 44, marketCents: 3200, highCents: 12000, changePct: -3.1 },
    ],
    sales: [
      { id: 's1', title: 'DeShawn Riley 2024 Bowman U Chrome 1st Auto #BUC-DR', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 11000, date: 'Sep 22, 2026', format: 'Auction', bidCount: 8 },
      { id: 's2', title: 'DeShawn Riley 2024 Bowman U Chrome 1st Auto Red /25', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Red', isAuto: true, priceCents: 41000, baseCents: 11400, date: 'Sep 21, 2026', format: 'Best Offer' },
      { id: 's3', title: 'DeShawn Riley 2024 Bowman U Chrome 1st Auto #BUC-DR', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 13100, date: 'Sep 19, 2026', format: 'Auction', bidCount: 10 },
    ],
  },
  {
    id: 'tre-vaughn',
    name: 'Tre Vaughn',
    initials: 'TV',
    school: 'Alabama',
    schoolAbbr: 'ALA',
    schoolColor: 'oklch(0.55 0.18 20)',
    position: 'RB',
    classYear: 'SO',
    age: 20,
    status: 'active',
    tier: 'hot',
    rank: 4,
    marketCents: 8600,
    changePct: 104.7,
    volume: 188,
    volumeCents: 1980000,
    twmaCents: 5100,
    liquidity: 8.2,
    spark: spark(2),
    hot: true,
    projectedPick: 22,
    projectedPickPrev: 48,
    tools: [
      { key: 'vision', label: 'Vision', grade: 60 },
      { key: 'contact', label: 'Contact', grade: 65 },
      { key: 'speed', label: 'Speed', grade: 60 },
      { key: 'hands', label: 'Hands', grade: 55 },
      { key: 'pass', label: 'Pass Pro', grade: 50 },
      { key: 'elusive', label: 'Elusive', grade: 65 },
    ],
    bio: 'Bruising back with breakaway speed. Three straight 150-yard games sent his auto printing higher.',
    firstCard: '1st Bowman: 2025 Bowman University Chrome',
    seasons: [
      { season: 2024, school: 'Alabama', games: 10, line: [ { label: 'ATT', value: '118' }, { label: 'YDS', value: '641' }, { label: 'TD', value: '7' }, { label: 'YPC', value: '5.4' } ] },
      { season: 2025, school: 'Alabama', games: 12, line: [ { label: 'ATT', value: '214' }, { label: 'YDS', value: '1,388' }, { label: 'TD', value: '16' }, { label: 'YPC', value: '6.5' } ] },
    ],
    gameLog: [
      { date: 'Nov 29', opponent: 'Auburn', homeAway: 'H', result: 'W 31-20', line: '24 att, 168 yds, 2 TD' },
      { date: 'Nov 22', opponent: 'at LSU', homeAway: 'A', result: 'W 27-24', line: '21 att, 151 yds, 1 TD' },
      { date: 'Nov 15', opponent: 'Mercer', homeAway: 'H', result: 'W 52-7', line: '15 att, 155 yds, 3 TD' },
    ],
    cards: [
      { id: 'buc-auto', product: 'Bowman University Chrome', year: 2025, cardNumber: 'BUC-TV', subset: '1st Bowman Auto', parallels: [ { name: 'Base', run: null }, { name: 'Refractor', run: 499 }, { name: 'Purple', run: 250 } ], isAuto: true, live: 41, sold: 155, marketCents: 8600, highCents: 34000, changePct: 104.7 },
    ],
    sales: [
      { id: 's1', title: 'Tre Vaughn 2025 Bowman U Chrome 1st Auto #BUC-TV', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 8800, date: 'Sep 22, 2026', format: 'Auction', bidCount: 16 },
      { id: 's2', title: 'Tre Vaughn 2025 Bowman U Chrome 1st Auto #BUC-TV', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 8100, date: 'Sep 21, 2026', format: 'Auction', bidCount: 13 },
      { id: 's3', title: 'Tre Vaughn 2025 Bowman U Chrome 1st Auto Purple /250', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Purple', isAuto: true, priceCents: 21000, baseCents: 8500, date: 'Sep 20, 2026', format: 'BIN' },
    ],
  },
  {
    id: 'colton-frank',
    name: 'Colton Frank',
    initials: 'CF',
    school: 'Oregon',
    schoolAbbr: 'ORE',
    schoolColor: 'oklch(0.55 0.13 150)',
    position: 'QB',
    classYear: 'JR',
    age: 21,
    status: 'active',
    tier: 'hot',
    rank: 5,
    marketCents: 15400,
    changePct: 27.9,
    volume: 176,
    volumeCents: 3410000,
    twmaCents: 12000,
    liquidity: 8.0,
    spark: spark(5),
    hot: true,
    projectedPick: 8,
    projectedPickPrev: 12,
    tools: [
      { key: 'arm', label: 'Arm', grade: 60 },
      { key: 'acc', label: 'Accuracy', grade: 65 },
      { key: 'mobility', label: 'Mobility', grade: 55 },
      { key: 'poise', label: 'Poise', grade: 65 },
      { key: 'iq', label: 'IQ', grade: 70 },
      { key: 'deep', label: 'Deep Ball', grade: 60 },
    ],
    bio: 'Precision pocket passer running an NFL scheme. Consistent producer with a rising floor.',
    firstCard: '1st Bowman: 2024 Bowman University Chrome',
    seasons: [
      { season: 2024, school: 'Oregon', games: 13, line: [ { label: 'CMP%', value: '68.4' }, { label: 'YDS', value: '3,510' }, { label: 'TD', value: '29' }, { label: 'INT', value: '8' } ] },
      { season: 2025, school: 'Oregon', games: 13, line: [ { label: 'CMP%', value: '70.1' }, { label: 'YDS', value: '3,988' }, { label: 'TD', value: '36' }, { label: 'INT', value: '6' } ] },
    ],
    gameLog: [
      { date: 'Dec 6', opponent: 'at Ohio State', homeAway: 'A', result: 'L 21-28', line: '298 yds, 2 TD, 1 INT' },
      { date: 'Nov 29', opponent: 'Washington', homeAway: 'H', result: 'W 42-24', line: '341 yds, 4 TD' },
    ],
    cards: [
      { id: 'buc-auto', product: 'Bowman University Chrome', year: 2024, cardNumber: 'BUC-CF', subset: '1st Bowman Auto', parallels: [ { name: 'Base', run: null }, { name: 'Refractor', run: 499 }, { name: 'Yellow', run: 75 } ], isAuto: true, live: 37, sold: 132, marketCents: 15400, highCents: 78000, changePct: 27.9 },
    ],
    sales: [
      { id: 's1', title: 'Colton Frank 2024 Bowman U Chrome 1st Auto #BUC-CF', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 15400, date: 'Sep 22, 2026', format: 'Auction', bidCount: 11 },
      { id: 's2', title: 'Colton Frank 2024 Bowman U Chrome 1st Auto Yellow /75', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Yellow', isAuto: true, priceCents: 33000, baseCents: 15100, date: 'Sep 21, 2026', format: 'Auction', bidCount: 19 },
    ],
  },
  {
    id: 'isaiah-monroe',
    name: 'Isaiah Monroe',
    initials: 'IM',
    school: 'LSU',
    schoolAbbr: 'LSU',
    schoolColor: 'oklch(0.45 0.13 300)',
    position: 'CB',
    classYear: 'JR',
    age: 21,
    status: 'active',
    tier: 'standard',
    rank: 6,
    marketCents: 6200,
    changePct: 9.4,
    volume: 88,
    volumeCents: 640000,
    twmaCents: 5800,
    liquidity: 6.9,
    spark: spark(13),
    hot: false,
    projectedPick: 19,
    projectedPickPrev: 21,
    tools: [
      { key: 'cover', label: 'Coverage', grade: 65 },
      { key: 'speed', label: 'Speed', grade: 65 },
      { key: 'ball', label: 'Ball Skills', grade: 60 },
      { key: 'press', label: 'Press', grade: 55 },
      { key: 'tackle', label: 'Tackling', grade: 50 },
      { key: 'iq', label: 'IQ', grade: 60 },
    ],
    bio: 'Sticky man-cover corner with the length teams covet. Quietly leads the SEC in passes defensed.',
    firstCard: '1st Bowman: 2024 Bowman University Chrome',
    seasons: [
      { season: 2024, school: 'LSU', games: 12, line: [ { label: 'TKL', value: '38' }, { label: 'PD', value: '11' }, { label: 'INT', value: '3' }, { label: 'FF', value: '1' } ] },
      { season: 2025, school: 'LSU', games: 12, line: [ { label: 'TKL', value: '44' }, { label: 'PD', value: '15' }, { label: 'INT', value: '5' }, { label: 'FF', value: '2' } ] },
    ],
    gameLog: [
      { date: 'Nov 29', opponent: 'at Texas A&M', homeAway: 'A', result: 'W 30-27', line: '5 tkl, 2 PD, INT' },
      { date: 'Nov 22', opponent: 'Alabama', homeAway: 'H', result: 'L 24-27', line: '6 tkl, 1 PD' },
    ],
    cards: [
      { id: 'buc-auto', product: 'Bowman University Chrome', year: 2024, cardNumber: 'BUC-IM', subset: '1st Bowman Auto', parallels: [ { name: 'Base', run: null }, { name: 'Refractor', run: 499 } ], isAuto: true, live: 21, sold: 74, marketCents: 6200, highCents: 28000, changePct: 9.4 },
    ],
    sales: [
      { id: 's1', title: 'Isaiah Monroe 2024 Bowman U Chrome 1st Auto #BUC-IM', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 6200, date: 'Sep 22, 2026', format: 'Auction', bidCount: 7 },
      { id: 's2', title: 'Isaiah Monroe 2024 Bowman U Chrome 1st Auto #BUC-IM', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 5800, date: 'Sep 20, 2026', format: 'Auction', bidCount: 5 },
    ],
  },
  {
    id: 'brady-whitlock',
    name: 'Brady Whitlock',
    initials: 'BW',
    school: 'Notre Dame',
    schoolAbbr: 'ND',
    schoolColor: 'oklch(0.5 0.12 250)',
    position: 'TE',
    classYear: 'SR',
    age: 22,
    status: 'active',
    tier: 'standard',
    rank: 7,
    marketCents: 4800,
    changePct: -8.2,
    volume: 72,
    volumeCents: 410000,
    twmaCents: 5300,
    liquidity: 6.1,
    spark: spark(17),
    hot: false,
    projectedPick: 34,
    projectedPickPrev: 30,
    tools: [
      { key: 'hands', label: 'Hands', grade: 65 },
      { key: 'block', label: 'Blocking', grade: 60 },
      { key: 'routes', label: 'Routes', grade: 55 },
      { key: 'speed', label: 'Speed', grade: 50 },
      { key: 'size', label: 'Size', grade: 65 },
      { key: 'yac', label: 'YAC', grade: 55 },
    ],
    bio: 'Complete Y-tight end who blocks and catches. Draft stock steady but hobby interest is thin.',
    firstCard: '1st Bowman: 2023 Bowman University Chrome',
    seasons: [
      { season: 2024, school: 'Notre Dame', games: 13, line: [ { label: 'REC', value: '44' }, { label: 'YDS', value: '588' }, { label: 'TD', value: '6' }, { label: 'YPC', value: '13.4' } ] },
      { season: 2025, school: 'Notre Dame', games: 12, line: [ { label: 'REC', value: '51' }, { label: 'YDS', value: '672' }, { label: 'TD', value: '8' }, { label: 'YPC', value: '13.2' } ] },
    ],
    gameLog: [
      { date: 'Nov 29', opponent: 'Stanford', homeAway: 'H', result: 'W 38-10', line: '5 rec, 74 yds, 1 TD' },
      { date: 'Nov 22', opponent: 'at Pitt', homeAway: 'A', result: 'W 28-21', line: '4 rec, 51 yds' },
    ],
    cards: [
      { id: 'buc-auto', product: 'Bowman University Chrome', year: 2023, cardNumber: 'BUC-BW', subset: '1st Bowman Auto', parallels: [ { name: 'Base', run: null }, { name: 'Refractor', run: 499 } ], isAuto: true, live: 16, sold: 58, marketCents: 4800, highCents: 19000, changePct: -8.2 },
    ],
    sales: [
      { id: 's1', title: 'Brady Whitlock 2023 Bowman U Chrome 1st Auto #BUC-BW', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 4800, date: 'Sep 21, 2026', format: 'Auction', bidCount: 6 },
      { id: 's2', title: 'Brady Whitlock 2023 Bowman U Chrome 1st Auto #BUC-BW', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 5300, date: 'Sep 18, 2026', format: 'BIN' },
    ],
  },
  {
    id: 'darius-pettway',
    name: 'Darius Pettway',
    initials: 'DP',
    school: 'Miami',
    schoolAbbr: 'MIA',
    schoolColor: 'oklch(0.6 0.13 150)',
    position: 'WR',
    classYear: 'SO',
    age: 19,
    status: 'active',
    tier: 'hot',
    rank: 8,
    marketCents: 7400,
    changePct: 74.8,
    volume: 199,
    volumeCents: 1620000,
    twmaCents: 4300,
    liquidity: 7.9,
    spark: spark(4),
    hot: true,
    projectedPick: 15,
    projectedPickPrev: 41,
    tools: [
      { key: 'speed', label: 'Speed', grade: 70 },
      { key: 'hands', label: 'Hands', grade: 55 },
      { key: 'routes', label: 'Routes', grade: 55 },
      { key: 'yac', label: 'YAC', grade: 70 },
      { key: 'sep', label: 'Separation', grade: 65 },
      { key: 'size', label: 'Size', grade: 45 },
    ],
    bio: 'Freshman phenom with punt-return juice. Went viral after a 4-TD night; the print is red hot.',
    firstCard: '1st Bowman: 2025 Bowman University Chrome',
    seasons: [
      { season: 2025, school: 'Miami', games: 12, line: [ { label: 'REC', value: '58' }, { label: 'YDS', value: '921' }, { label: 'TD', value: '11' }, { label: 'YPC', value: '15.9' } ] },
    ],
    gameLog: [
      { date: 'Nov 29', opponent: 'Florida State', homeAway: 'H', result: 'W 41-27', line: '8 rec, 164 yds, 4 TD' },
      { date: 'Nov 22', opponent: 'at Cal', homeAway: 'A', result: 'W 34-17', line: '5 rec, 88 yds, 1 TD' },
    ],
    cards: [
      { id: 'buc-auto', product: 'Bowman University Chrome', year: 2025, cardNumber: 'BUC-DP', subset: '1st Bowman Auto', parallels: [ { name: 'Base', run: null }, { name: 'Refractor', run: 499 }, { name: 'Aqua', run: 199 } ], isAuto: true, live: 48, sold: 167, marketCents: 7400, highCents: 29000, changePct: 74.8 },
    ],
    sales: [
      { id: 's1', title: 'Darius Pettway 2025 Bowman U Chrome 1st Auto #BUC-DP', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Base', isAuto: true, priceCents: 7400, date: 'Sep 22, 2026', format: 'Auction', bidCount: 21 },
      { id: 's2', title: 'Darius Pettway 2025 Bowman U Chrome 1st Auto Aqua /199', product: 'Bowman U Chrome', variant: '1st Auto', parallel: 'Aqua', isAuto: true, priceCents: 16000, baseCents: 7100, date: 'Sep 21, 2026', format: 'Auction', bidCount: 17 },
    ],
  },
]

export function getPlayer(id: string): Player | undefined {
  return players.find((p) => p.id === id)
}

// ---- Market overview (dashboard chart) ----
export type MarketPoint = { date: string; avgPrice: number; volume: number }

export const marketSeries: MarketPoint[] = (() => {
  const days = 30
  const start = new Date('2026-08-25T00:00:00')
  const out: MarketPoint[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const wave = Math.sin(i / 3) * 9 + Math.sin(i / 1.5) * 4
    const avg = Math.round(58 + wave + i * 0.7)
    const vol = Math.round(1200 + Math.cos(i / 2.2) * 320 + (i > 24 ? (i - 24) * 90 : 0) + ((i * 37) % 200))
    out.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avgPrice: avg,
      volume: vol,
    })
  }
  return out
})()

export const marketStats = {
  activePlayers: 1042,
  activeFbs: 812,
  activeFcs: 230,
  totalSales: 28417,
  avgPriceCents: 6398,
  totalValueCents: 181850000,
}

// ---- Live auctions ----
export type Auction = {
  id: string
  playerId: string
  product: string
  parallel: string
  serial?: string
  currentBidCents: number
  marketCents: number
  marketTrend: 'up' | 'down'
  bids: number
  endsInMin: number
  endsAt: string
  dealScore: number // negative = under market (good deal), positive = over
  comps: { date: string; priceCents: number }[]
}

export const auctions: Auction[] = [
  {
    id: 'a1',
    playerId: 'tre-vaughn',
    product: '2025 Bowman U Chrome',
    parallel: 'Refractor',
    serial: '/499',
    currentBidCents: 6100,
    marketCents: 12400,
    marketTrend: 'up',
    bids: 12,
    endsInMin: 18,
    endsAt: '2:41 PM EST',
    dealScore: -50.8,
    comps: [
      { date: 'Sep 22', priceCents: 12800 },
      { date: 'Sep 21', priceCents: 11500 },
      { date: 'Sep 20', priceCents: 13100 },
      { date: 'Sep 19', priceCents: 12000 },
    ],
  },
  {
    id: 'a2',
    playerId: 'jayden-caldwell',
    product: '2025 Bowman U Chrome',
    parallel: 'Blue',
    serial: '/150',
    currentBidCents: 62000,
    marketCents: 84000,
    marketTrend: 'up',
    bids: 24,
    endsInMin: 43,
    endsAt: '3:06 PM EST',
    dealScore: -26.2,
    comps: [
      { date: 'Sep 22', priceCents: 89000 },
      { date: 'Sep 21', priceCents: 82000 },
      { date: 'Sep 18', priceCents: 79000 },
    ],
  },
  {
    id: 'a3',
    playerId: 'darius-pettway',
    product: '2025 Bowman U Chrome',
    parallel: 'Base Auto',
    currentBidCents: 8900,
    marketCents: 7400,
    marketTrend: 'up',
    bids: 19,
    endsInMin: 7,
    endsAt: '2:30 PM EST',
    dealScore: 20.3,
    comps: [
      { date: 'Sep 22', priceCents: 7400 },
      { date: 'Sep 21', priceCents: 7100 },
      { date: 'Sep 20', priceCents: 7600 },
    ],
  },
  {
    id: 'a4',
    playerId: 'marcus-oduya',
    product: '2024 Bowman U Chrome',
    parallel: 'Green',
    serial: '/99',
    currentBidCents: 31000,
    marketCents: 47000,
    marketTrend: 'up',
    bids: 15,
    endsInMin: 61,
    endsAt: '3:24 PM EST',
    dealScore: -34.0,
    comps: [
      { date: 'Sep 22', priceCents: 47000 },
      { date: 'Sep 20', priceCents: 44000 },
      { date: 'Sep 17', priceCents: 49000 },
    ],
  },
  {
    id: 'a5',
    playerId: 'colton-frank',
    product: '2024 Bowman U Chrome',
    parallel: 'Base Auto',
    currentBidCents: 12800,
    marketCents: 15400,
    marketTrend: 'up',
    bids: 9,
    endsInMin: 92,
    endsAt: '3:55 PM EST',
    dealScore: -16.9,
    comps: [
      { date: 'Sep 22', priceCents: 15400 },
      { date: 'Sep 21', priceCents: 15100 },
      { date: 'Sep 19', priceCents: 16000 },
    ],
  },
  {
    id: 'a6',
    playerId: 'deshawn-riley',
    product: '2024 Bowman U Chrome',
    parallel: 'Base Auto',
    currentBidCents: 11800,
    marketCents: 11200,
    marketTrend: 'down',
    bids: 8,
    endsInMin: 120,
    endsAt: '4:23 PM EST',
    dealScore: 5.4,
    comps: [
      { date: 'Sep 22', priceCents: 11000 },
      { date: 'Sep 21', priceCents: 11400 },
      { date: 'Sep 19', priceCents: 13100 },
    ],
  },
]

// ---- Prospect Hype Radar ----
export type HypeItem = {
  playerId: string
  score: number
  scorePrev: number
  reason: string
  components: { market: number; performance: number; media: number; draft: number }
  sources: { type: 'news' | 'video' | 'mock'; outlet: string; title: string }[]
}

export const hypeItems: HypeItem[] = [
  {
    playerId: 'marcus-oduya',
    score: 94,
    scorePrev: 71,
    reason: '172-yard, 2-TD title game and a jump to a top-6 consensus mock has the print flying off eBay.',
    components: { market: 92, performance: 88, media: 96, draft: 90 },
    sources: [
      { type: 'mock', outlet: 'The Athletic', title: '2027 Mock Draft 3.0: Oduya into the top 6' },
      { type: 'video', outlet: 'Card Talk HQ', title: 'Buy or sell: Marcus Oduya Bowman U autos' },
      { type: 'news', outlet: 'ESPN', title: 'Oduya headlines Ohio State title run' },
    ],
  },
  {
    playerId: 'tre-vaughn',
    score: 89,
    scorePrev: 52,
    reason: 'Third straight 150-yard game; hobby volume up 3x week-over-week on a cheap entry auto.',
    components: { market: 95, performance: 90, media: 74, draft: 80 },
    sources: [
      { type: 'news', outlet: 'CBS Sports', title: 'Tre Vaughn is the SEC breakout of the year' },
      { type: 'video', outlet: 'Gridiron Cards', title: 'Tre Vaughn PC before it is too late' },
    ],
  },
  {
    playerId: 'darius-pettway',
    score: 86,
    scorePrev: 40,
    reason: '4-TD viral night as a true freshman; mock draft debut inside the top 15.',
    components: { market: 90, performance: 92, media: 84, draft: 72 },
    sources: [
      { type: 'mock', outlet: 'PFF', title: 'Freshman risers: Pettway debuts at 15' },
      { type: 'news', outlet: 'Yahoo Sports', title: 'Miami freshman torches Florida State' },
    ],
  },
  {
    playerId: 'jayden-caldwell',
    score: 82,
    scorePrev: 78,
    reason: 'Steady QB1 buzz; consensus board still rising after the CFP semifinal.',
    components: { market: 80, performance: 76, media: 88, draft: 86 },
    sources: [
      { type: 'mock', outlet: 'The Draft Network', title: 'QB rankings: Caldwell holds at QB1' },
      { type: 'video', outlet: 'Hobby Watch', title: 'Is Caldwell Bowman U a buy at $280?' },
    ],
  },
  {
    playerId: 'colton-frank',
    score: 68,
    scorePrev: 61,
    reason: 'Efficient close to the season nudged his projected pick up four spots.',
    components: { market: 64, performance: 70, media: 60, draft: 78 },
    sources: [{ type: 'mock', outlet: 'ESPN', title: 'Mel Kiper board: Frank climbs to 8' }],
  },
  {
    playerId: 'deshawn-riley',
    score: 41,
    scorePrev: 66,
    reason: 'Quiet playoff and a slipping mock projection cooled a previously hot auto.',
    components: { market: 34, performance: 38, media: 48, draft: 44 },
    sources: [{ type: 'news', outlet: 'The Athletic', title: 'Edge class shakeup: Riley slides to 11' }],
  },
]

export const risers = [...players].sort((a, b) => b.changePct - a.changePct).slice(0, 5)
export const fallers = [...players].sort((a, b) => a.changePct - b.changePct).slice(0, 5)
