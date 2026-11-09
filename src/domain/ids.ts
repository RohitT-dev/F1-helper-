import { hasOwn } from '../data/hasOwn';
import { TEAM_BY_ID } from '../data/teams';
import { TRACK_BY_ID } from '../data/tracks';
import { isWeatherId, type WeatherId } from '../data/weather';

export interface Combo {
  teamId: string;
  trackId: string;
  weather: WeatherId;
}

const SEPARATOR = '__';

/** Stable cache key for a team, track and weather combination. */
export function makeSetupId({ teamId, trackId, weather }: Combo): string {
  return [teamId, trackId, weather].join(SEPARATOR);
}

/** Reverses `makeSetupId`. Returns null for anything that is not a known combination. */
export function parseSetupId(id: string): Combo | null {
  const parts = id.split(SEPARATOR);
  if (parts.length !== 3) return null;
  const [teamId, trackId, weather] = parts;
  if (!hasOwn(TEAM_BY_ID, teamId) || !hasOwn(TRACK_BY_ID, trackId) || !isWeatherId(weather)) {
    return null;
  }
  return { teamId, trackId, weather };
}
