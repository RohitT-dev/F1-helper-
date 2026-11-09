import { describe, expect, it } from 'vitest';
import { makeSetupId, parseSetupId } from '../ids';

describe('setup ids', () => {
  it('rejects inherited object keys', () => {
    expect(parseSetupId('constructor__las-vegas__dry')).toBeNull();
    expect(parseSetupId('ferrari__toString__dry')).toBeNull();
    expect(parseSetupId('ferrari__las-vegas__constructor')).toBeNull();
  });

  it('round-trips a combination', () => {
    const id = makeSetupId({ teamId: 'red-bull', trackId: 'las-vegas', weather: 'light-rain' });
    expect(id).toBe('red-bull__las-vegas__light-rain');
    expect(parseSetupId(id)).toEqual({
      teamId: 'red-bull',
      trackId: 'las-vegas',
      weather: 'light-rain',
    });
  });

  it('rejects unknown teams, tracks and weather', () => {
    expect(parseSetupId('nope__monza__dry')).toBeNull();
    expect(parseSetupId('ferrari__nowhere__dry')).toBeNull();
    expect(parseSetupId('ferrari__monza__snow')).toBeNull();
  });

  it('rejects malformed ids', () => {
    expect(parseSetupId('')).toBeNull();
    expect(parseSetupId('ferrari__monza')).toBeNull();
    expect(parseSetupId('ferrari__monza__dry__extra')).toBeNull();
  });
});
