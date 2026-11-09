import { describe, expect, it } from 'vitest';
import { buildSystemPrompt, buildUserPrompt } from '../prompt';
import { SETTINGS } from '../settings';

describe('prompts', () => {
  it('lists every setting label with its range in the system prompt', () => {
    const prompt = buildSystemPrompt();
    for (const spec of SETTINGS) {
      expect(prompt).toContain(`${spec.label}: ${spec.min} to ${spec.max}`);
    }
    expect(prompt).toContain('exactly 21 sliders');
  });

  it('is identical on every call so it can be cached', () => {
    expect(buildSystemPrompt()).toBe(buildSystemPrompt());
  });

  it('describes the team, circuit and weather in the user prompt', () => {
    const prompt = buildUserPrompt({ teamId: 'mclaren', trackId: 'spa', weather: 'heavy-rain' });
    expect(prompt).toContain('McLaren');
    expect(prompt).toContain('Circuit de Spa-Francorchamps');
    expect(prompt).toContain('Belgium');
    expect(prompt).toContain('full wet tyres');
  });
});
