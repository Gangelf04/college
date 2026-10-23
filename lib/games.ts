import { getPlayer, type Position } from '@/lib/data'

export type Stat = { label: string; value: string }

type TrackedSeed = {
  playerId?: string
  name: string
  position: Position
  priceCents: number
  changePct: number
  stats: Stat[]
}

export type TrackedPlayer = TrackedSeed & { initials: string }

export type GameTeam = {
  name: string
  abbr: string
  rank?: number
  record: string
  confRecord: string
  conference: string
  tracked: TrackedPlayer[]
}

export type Game = {
  id: string
  day: string
  date: string
  time: string
  week: number
  network: string
  away: GameTeam
  home: GameTeam
}

type TeamSeed = Omit<GameTeam, 'tracked'> & { tracked: TrackedSeed[] }
type GameSeed = Omit<Game, 'away' | 'home'> & { away: TeamSeed; home: TeamSeed }

const qb = (yds: string, td: string, int: string, cmp: string): Stat[] => [
  { label: 'Pass yds', value: yds },
  { label: 'TD', value: td },
  { label: 'INT', value: int },
  { label: 'Cmp%', value: cmp },
]
const rec = (r: string, yds: string, td: string, ypr: string): Stat[] => [
  { label: 'Rec', value: r },
  { label: 'Yds', value: yds },
  { label: 'TD', value: td },
  { label: 'Y/R', value: ypr },
]
const rush = (att: string, yds: string, td: string, ypc: string): Stat[] => [
  { label: 'Att', value: att },
  { label: 'Yds', value: yds },
  { label: 'TD', value: td },
  { label: 'Y/C', value: ypc },
]
const def = (tkl: string, tfl: string, sck: string, int: string): Stat[] => [
  { label: 'Tkl', value: tkl },
  { label: 'TFL', value: tfl },
  { label: 'Sack', value: sck },
  { label: 'INT', value: int },
]

function initialsOf(name: string) {
  return name
    .split(' ')
    .filter((p) => /^[A-Z]/.test(p) && !/^(I|II|III|IV|Jr\.?)$/.test(p))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

function hydrate(seed: TrackedSeed): TrackedPlayer {
  const linked = seed.playerId ? getPlayer(seed.playerId) : undefined
  return {
    ...seed,
    name: linked?.name ?? seed.name,
    position: linked?.position ?? seed.position,
    priceCents: linked?.marketCents ?? seed.priceCents,
    changePct: linked?.changePct ?? seed.changePct,
    initials: linked?.initials ?? initialsOf(seed.name),
  }
}

function team(seed: TeamSeed): GameTeam {
  return {
    ...seed,
    tracked: seed.tracked.map(hydrate).sort((a, b) => b.priceCents - a.priceCents),
  }
}

const seeds: GameSeed[] = [
  {
    id: 'miami-duke',
    day: 'Friday',
    date: 'Oct 23',
    time: '7:00 PM',
    week: 8,
    network: 'ESPN',
    away: {
      name: 'Miami',
      abbr: 'MIA',
      rank: 14,
      record: '6-1',
      confRecord: '3-1',
      conference: 'ACC',
      tracked: [
        { playerId: 'darius-pettway', name: 'Darius Pettway', position: 'WR', priceCents: 0, changePct: 0, stats: rec('41', '688', '7', '16.8') },
        { name: 'Kendrick Hale', position: 'QB', priceCents: 2800, changePct: 4.2, stats: qb('1,912', '16', '5', '67.4') },
      ],
    },
    home: {
      name: 'Duke',
      abbr: 'DUKE',
      record: '4-2',
      confRecord: '1-2',
      conference: 'ACC',
      tracked: [{ name: 'Owen Sterling', position: 'QB', priceCents: 1900, changePct: -2.1, stats: qb('1,540', '11', '6', '63.8') }],
    },
  },
  {
    id: 'oregon-washington',
    day: 'Friday',
    date: 'Oct 23',
    time: '9:00 PM',
    week: 8,
    network: 'FOX',
    away: {
      name: 'Oregon',
      abbr: 'ORE',
      rank: 6,
      record: '6-0',
      confRecord: '4-0',
      conference: 'Big Ten',
      tracked: [
        { playerId: 'colton-frank', name: 'Colton Frank', position: 'QB', priceCents: 0, changePct: 0, stats: qb('1,988', '19', '3', '71.2') },
        { name: 'Malik Brandt', position: 'RB', priceCents: 1400, changePct: 9.6, stats: rush('96', '584', '7', '6.1') },
      ],
    },
    home: {
      name: 'Washington',
      abbr: 'UW',
      record: '4-3',
      confRecord: '2-2',
      conference: 'Big Ten',
      tracked: [{ name: 'Jalen Price', position: 'WR', priceCents: 1700, changePct: 1.8, stats: rec('36', '471', '4', '13.1') }],
    },
  },
  {
    id: 'georgia-texas',
    day: 'Saturday',
    date: 'Oct 24',
    time: '3:30 PM',
    week: 8,
    network: 'ABC',
    away: {
      name: 'Georgia',
      abbr: 'UGA',
      rank: 3,
      record: '6-1',
      confRecord: '3-1',
      conference: 'SEC',
      tracked: [
        { playerId: 'deshawn-riley', name: 'DeShawn Riley', position: 'EDGE', priceCents: 0, changePct: 0, stats: def('27', '9.5', '6.0', '0') },
        { name: 'Caleb Ward', position: 'S', priceCents: 1200, changePct: -0.8, stats: def('39', '2.0', '0.5', '3') },
      ],
    },
    home: {
      name: 'Texas',
      abbr: 'TEX',
      rank: 5,
      record: '6-1',
      confRecord: '3-1',
      conference: 'SEC',
      tracked: [
        { playerId: 'jayden-caldwell', name: 'Jayden Caldwell', position: 'QB', priceCents: 0, changePct: 0, stats: qb('2,104', '20', '4', '69.5') },
        { name: 'Andre Castillo', position: 'WR', priceCents: 2100, changePct: 6.3, stats: rec('38', '552', '5', '14.5') },
        { name: 'Mason Reyes', position: 'LB', priceCents: 900, changePct: 0.4, stats: def('44', '6.5', '2.0', '1') },
      ],
    },
  },
  {
    id: 'lsu-auburn',
    day: 'Saturday',
    date: 'Oct 24',
    time: '12:00 PM',
    week: 8,
    network: 'SEC Network',
    away: {
      name: 'LSU',
      abbr: 'LSU',
      rank: 22,
      record: '5-2',
      confRecord: '2-2',
      conference: 'SEC',
      tracked: [
        { playerId: 'isaiah-monroe', name: 'Isaiah Monroe', position: 'CB', priceCents: 0, changePct: 0, stats: def('24', '1.5', '0', '3') },
        { name: 'Trey Mitchell', position: 'TE', priceCents: 2300, changePct: 3.1, stats: rec('14', '222', '1', '15.9') },
        { name: 'Cam Foster', position: 'QB', priceCents: 2300, changePct: -4.4, stats: qb('1,784', '14', '8', '70.1') },
        { name: 'Wes Hollins', position: 'LB', priceCents: 1500, changePct: 1.2, stats: def('25', '2.5', '0', '0') },
      ],
    },
    home: {
      name: 'Auburn',
      abbr: 'AUB',
      record: '4-2',
      confRecord: '2-2',
      conference: 'SEC',
      tracked: [
        { name: 'Xavier Pope', position: 'LB', priceCents: 4000, changePct: 12.5, stats: def('37', '7.5', '3.0', '1') },
        { name: 'Bryce Hollis', position: 'QB', priceCents: 1700, changePct: -1.6, stats: qb('1,202', '8', '7', '64.1') },
        { name: 'Kenji Ward', position: 'WR', priceCents: 1400, changePct: 2.4, stats: rec('31', '333', '3', '10.7') },
      ],
    },
  },
  {
    id: 'alabama-tennessee',
    day: 'Saturday',
    date: 'Oct 24',
    time: '7:30 PM',
    week: 8,
    network: 'ABC',
    away: {
      name: 'Alabama',
      abbr: 'ALA',
      rank: 9,
      record: '5-1',
      confRecord: '3-1',
      conference: 'SEC',
      tracked: [{ playerId: 'tre-vaughn', name: 'Tre Vaughn', position: 'RB', priceCents: 0, changePct: 0, stats: rush('118', '742', '9', '6.3') }],
    },
    home: {
      name: 'Tennessee',
      abbr: 'TENN',
      rank: 17,
      record: '5-2',
      confRecord: '2-2',
      conference: 'SEC',
      tracked: [{ name: 'Nico Ramsey', position: 'QB', priceCents: 2600, changePct: 5.0, stats: qb('1,866', '15', '6', '65.9') }],
    },
  },
  {
    id: 'notre-dame-usc',
    day: 'Saturday',
    date: 'Oct 24',
    time: '7:30 PM',
    week: 8,
    network: 'NBC',
    away: {
      name: 'Notre Dame',
      abbr: 'ND',
      rank: 11,
      record: '5-1',
      confRecord: '—',
      conference: 'Ind.',
      tracked: [{ playerId: 'brady-whitlock', name: 'Brady Whitlock', position: 'TE', priceCents: 0, changePct: 0, stats: rec('29', '388', '4', '13.4') }],
    },
    home: {
      name: 'USC',
      abbr: 'USC',
      record: '4-3',
      confRecord: '2-3',
      conference: 'Big Ten',
      tracked: [{ name: 'Ty Delgado', position: 'WR', priceCents: 1800, changePct: -3.2, stats: rec('40', '518', '3', '13.0') }],
    },
  },
  {
    id: 'ohio-state-penn-state',
    day: 'Saturday',
    date: 'Oct 24',
    time: '8:00 PM',
    week: 8,
    network: 'CBS',
    away: {
      name: 'Ohio State',
      abbr: 'OSU',
      rank: 2,
      record: '7-0',
      confRecord: '4-0',
      conference: 'Big Ten',
      tracked: [{ playerId: 'marcus-oduya', name: 'Marcus Oduya', position: 'WR', priceCents: 0, changePct: 0, stats: rec('47', '812', '8', '17.3') }],
    },
    home: {
      name: 'Penn State',
      abbr: 'PSU',
      rank: 8,
      record: '6-1',
      confRecord: '3-1',
      conference: 'Big Ten',
      tracked: [{ name: 'Aiden Cole', position: 'RB', priceCents: 2200, changePct: 7.7, stats: rush('104', '655', '6', '6.3') }],
    },
  },
]

function toMinutes(time: string) {
  const [clock, meridiem] = time.split(' ')
  const [h, m] = clock.split(':').map(Number)
  return ((h % 12) + (meridiem === 'PM' ? 12 : 0)) * 60 + m
}

export const games: Game[] = seeds
  .map((g) => ({ ...g, away: team(g.away), home: team(g.home) }))
  .sort((a, b) => a.date.localeCompare(b.date) || toMinutes(a.time) - toMinutes(b.time))

export const scheduleMeta = 'AP Top 25 · Week 7 · Records as of Wed, Oct 14'

export function getGame(id: string) {
  return games.find((g) => g.id === id)
}

export function trackedIn(game: Game) {
  return [...game.away.tracked, ...game.home.tracked]
}

export function topTracked(game: Game) {
  return trackedIn(game).sort((a, b) => b.priceCents - a.priceCents)[0]
}

export function gamesByDay(list: Game[]) {
  const groups: { label: string; games: Game[] }[] = []
  for (const g of list) {
    const label = `${g.day}, ${g.date}`
    const group = groups.find((x) => x.label === label)
    if (group) group.games.push(g)
    else groups.push({ label, games: [g] })
  }
  return groups
}
