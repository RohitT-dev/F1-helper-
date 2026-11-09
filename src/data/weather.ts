export const WEATHER_IDS = ['dry', 'light-rain', 'heavy-rain'] as const;
export type WeatherId = (typeof WEATHER_IDS)[number];

export interface Weather {
  id: WeatherId;
  label: string;
  /** One line shown under the label. */
  hint: string;
  /** Description fed to Claude. */
  prompt: string;
}

export const WEATHER: readonly Weather[] = [
  {
    id: 'dry',
    label: 'Dry',
    hint: 'Slicks',
    prompt: 'Dry, on slick tyres.',
  },
  {
    id: 'light-rain',
    label: 'Light rain',
    hint: 'Intermediates',
    prompt: 'Damp or light rain, on intermediate tyres, with a drying line possible.',
  },
  {
    id: 'heavy-rain',
    label: 'Heavy rain',
    hint: 'Full wets',
    prompt: 'Heavy rain or storm, on full wet tyres, with standing water.',
  },
];

export const WEATHER_BY_ID: Record<WeatherId, Weather> = Object.fromEntries(
  WEATHER.map((w) => [w.id, w]),
) as Record<WeatherId, Weather>;

export function isWeatherId(value: string): value is WeatherId {
  return Object.prototype.hasOwnProperty.call(WEATHER_BY_ID, value);
}
