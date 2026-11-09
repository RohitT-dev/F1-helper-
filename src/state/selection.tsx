import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { hasOwn } from '../data/hasOwn';
import { TEAM_BY_ID, type Team } from '../data/teams';
import { TRACK_BY_ID } from '../data/tracks';
import { isWeatherId, type WeatherId } from '../data/weather';

interface Selection {
  teamId: string;
  trackId: string | null;
  weather: WeatherId;
}

interface SelectionContextValue extends Selection {
  team: Team;
  /** Livery colour of the chosen team. Drives the app's accent. */
  accent: string;
  setTeamId(id: string): void;
  setTrackId(id: string): void;
  setWeather(id: WeatherId): void;
}

const STORAGE_KEY = 'f1app:selection';
const DEFAULT: Selection = { teamId: 'ferrari', trackId: null, weather: 'dry' };

const SelectionContext = createContext<SelectionContextValue | null>(null);

function restore(raw: string | null): Selection {
  if (!raw) return DEFAULT;
  try {
    const value = JSON.parse(raw) as Partial<Selection>;
    return {
      teamId: value.teamId && hasOwn(TEAM_BY_ID, value.teamId) ? value.teamId : DEFAULT.teamId,
      trackId: value.trackId && hasOwn(TRACK_BY_ID, value.trackId) ? value.trackId : null,
      weather: value.weather && isWeatherId(value.weather) ? value.weather : DEFAULT.weather,
    };
  } catch {
    return DEFAULT;
  }
}

/** Remembers the last team, track and weather the player picked. */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setSelection(restore(raw)))
      .catch(() => undefined);
  }, []);

  const update = useCallback((patch: Partial<Selection>) => {
    setSelection((current) => {
      const next = { ...current, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const value = useMemo<SelectionContextValue>(() => {
    const team = TEAM_BY_ID[selection.teamId];
    return {
      ...selection,
      team,
      accent: team.color,
      setTeamId: (teamId) => update({ teamId }),
      setTrackId: (trackId) => update({ trackId }),
      setWeather: (weather) => update({ weather }),
    };
  }, [selection, update]);

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection(): SelectionContextValue {
  const value = useContext(SelectionContext);
  if (!value) throw new Error('useSelection must be used inside SelectionProvider');
  return value;
}
