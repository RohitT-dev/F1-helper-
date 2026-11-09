/**
 * The 21 adjustable car settings in the F1 24 setup screen.
 *
 * Slider ranges were read from published F1 24 setup data (f1laps.com). If a
 * range ever differs in your game build, edit it here: every other part of the
 * app (prompt, clamping, gauges) reads from this one table.
 */

export type SettingKey =
  | 'frontWing'
  | 'rearWing'
  | 'diffOnThrottle'
  | 'diffOffThrottle'
  | 'engineBraking'
  | 'frontCamber'
  | 'rearCamber'
  | 'frontToe'
  | 'rearToe'
  | 'frontSuspension'
  | 'rearSuspension'
  | 'frontAntiRollBar'
  | 'rearAntiRollBar'
  | 'frontRideHeight'
  | 'rearRideHeight'
  | 'brakePressure'
  | 'frontBrakeBias'
  | 'tyrePressureFR'
  | 'tyrePressureFL'
  | 'tyrePressureRR'
  | 'tyrePressureRL';

export type GroupId =
  | 'aero'
  | 'transmission'
  | 'geometry'
  | 'suspension'
  | 'brakes'
  | 'tyres';

export interface SettingSpec {
  key: SettingKey;
  group: GroupId;
  /** Name exactly as the F1 24 setup screen shows it. */
  label: string;
  min: number;
  max: number;
  /** Smallest increment the in-game slider moves by. */
  step: number;
  /** Decimal places the game displays. */
  decimals: number;
  unit: string;
}

export interface GroupSpec {
  id: GroupId;
  title: string;
}

export const GROUPS: readonly GroupSpec[] = [
  { id: 'aero', title: 'Aerodynamics' },
  { id: 'transmission', title: 'Transmission' },
  { id: 'geometry', title: 'Suspension Geometry' },
  { id: 'suspension', title: 'Suspension' },
  { id: 'brakes', title: 'Brakes' },
  { id: 'tyres', title: 'Tyres' },
];

export const SETTINGS: readonly SettingSpec[] = [
  // Aerodynamics
  { key: 'frontWing', group: 'aero', label: 'Front Wing Aero', min: 0, max: 50, step: 1, decimals: 0, unit: '' },
  { key: 'rearWing', group: 'aero', label: 'Rear Wing Aero', min: 0, max: 50, step: 1, decimals: 0, unit: '' },

  // Transmission
  { key: 'diffOnThrottle', group: 'transmission', label: 'Differential Adjustment On Throttle', min: 10, max: 100, step: 5, decimals: 0, unit: '%' },
  { key: 'diffOffThrottle', group: 'transmission', label: 'Differential Adjustment Off Throttle', min: 10, max: 100, step: 5, decimals: 0, unit: '%' },
  { key: 'engineBraking', group: 'transmission', label: 'Engine Braking', min: 0, max: 100, step: 10, decimals: 0, unit: '%' },

  // Suspension Geometry
  { key: 'frontCamber', group: 'geometry', label: 'Front Camber', min: -3.5, max: -2.5, step: 0.1, decimals: 2, unit: '°' },
  { key: 'rearCamber', group: 'geometry', label: 'Rear Camber', min: -2.2, max: -0.7, step: 0.1, decimals: 2, unit: '°' },
  { key: 'frontToe', group: 'geometry', label: 'Front Toe-Out', min: 0, max: 0.5, step: 0.01, decimals: 2, unit: '°' },
  { key: 'rearToe', group: 'geometry', label: 'Rear Toe-In', min: 0, max: 0.5, step: 0.01, decimals: 2, unit: '°' },

  // Suspension
  { key: 'frontSuspension', group: 'suspension', label: 'Front Suspension', min: 1, max: 41, step: 1, decimals: 0, unit: '' },
  { key: 'rearSuspension', group: 'suspension', label: 'Rear Suspension', min: 1, max: 41, step: 1, decimals: 0, unit: '' },
  { key: 'frontAntiRollBar', group: 'suspension', label: 'Front Anti-Roll Bar', min: 1, max: 21, step: 1, decimals: 0, unit: '' },
  { key: 'rearAntiRollBar', group: 'suspension', label: 'Rear Anti-Roll Bar', min: 1, max: 21, step: 1, decimals: 0, unit: '' },
  { key: 'frontRideHeight', group: 'suspension', label: 'Front Ride Height', min: 10, max: 40, step: 1, decimals: 0, unit: '' },
  { key: 'rearRideHeight', group: 'suspension', label: 'Rear Ride Height', min: 40, max: 100, step: 1, decimals: 0, unit: '' },

  // Brakes
  { key: 'brakePressure', group: 'brakes', label: 'Brake Pressure', min: 80, max: 100, step: 1, decimals: 0, unit: '%' },
  { key: 'frontBrakeBias', group: 'brakes', label: 'Front Brake Bias', min: 50, max: 70, step: 1, decimals: 0, unit: '%' },

  // Tyres
  { key: 'tyrePressureFR', group: 'tyres', label: 'Front Right Tyre Pressure', min: 22.5, max: 29.5, step: 0.1, decimals: 1, unit: ' psi' },
  { key: 'tyrePressureFL', group: 'tyres', label: 'Front Left Tyre Pressure', min: 22.5, max: 29.5, step: 0.1, decimals: 1, unit: ' psi' },
  { key: 'tyrePressureRR', group: 'tyres', label: 'Rear Right Tyre Pressure', min: 20.5, max: 26.5, step: 0.1, decimals: 1, unit: ' psi' },
  { key: 'tyrePressureRL', group: 'tyres', label: 'Rear Left Tyre Pressure', min: 20.5, max: 26.5, step: 0.1, decimals: 1, unit: ' psi' },
];

export const SETTING_KEYS: readonly SettingKey[] = SETTINGS.map((s) => s.key);

export const SETTING_BY_KEY = Object.fromEntries(
  SETTINGS.map((s) => [s.key, s]),
) as Record<SettingKey, SettingSpec>;

export function settingsInGroup(group: GroupId): SettingSpec[] {
  return SETTINGS.filter((s) => s.group === group);
}

/** Formats a value the way the game shows it, e.g. "-3.50°" or "27.5 psi". */
export function formatValue(spec: SettingSpec, value: number): string {
  return `${value.toFixed(spec.decimals)}${spec.unit}`;
}
