export interface Team {
  id: string;
  /** Full name as used in the prompt. */
  name: string;
  /** Short name for chips. */
  short: string;
  /** Livery colour, bright enough to read on the dark background. */
  color: string;
  /** Text colour that stays readable on top of `color`. */
  onColor: string;
}

/** The 10 constructors on the F1 24 grid. */
export const TEAMS: readonly Team[] = [
  { id: 'red-bull', name: 'Oracle Red Bull Racing', short: 'Red Bull', color: '#4A78E0', onColor: '#FFFFFF' },
  { id: 'ferrari', name: 'Scuderia Ferrari', short: 'Ferrari', color: '#E8002D', onColor: '#FFFFFF' },
  { id: 'mercedes', name: 'Mercedes-AMG Petronas', short: 'Mercedes', color: '#27F4D2', onColor: '#06201C' },
  { id: 'mclaren', name: 'McLaren', short: 'McLaren', color: '#FF8000', onColor: '#1C0D00' },
  { id: 'aston-martin', name: 'Aston Martin', short: 'Aston Martin', color: '#2BB88A', onColor: '#04170F' },
  { id: 'alpine', name: 'BWT Alpine', short: 'Alpine', color: '#FF87BC', onColor: '#2A0716' },
  { id: 'williams', name: 'Williams', short: 'Williams', color: '#64C4FF', onColor: '#04202F' },
  { id: 'rb', name: 'Visa Cash App RB', short: 'RB', color: '#7C9BFF', onColor: '#0A1233' },
  { id: 'kick-sauber', name: 'Kick Sauber', short: 'Sauber', color: '#52E252', onColor: '#06200A' },
  { id: 'haas', name: 'MoneyGram Haas', short: 'Haas', color: '#C9CDD2', onColor: '#14171B' },
];

export const TEAM_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t]),
);
