import { useCallback, useEffect, useRef, useState } from 'react';
import { parseSetupId } from '../domain/ids';
import type { SetupRecord } from '../domain/records';
import { GenerateError, generateSetup } from '../services/claude';
import { apiKeyStore, recordStore } from '../services/storage';

export type Phase = 'loading' | 'generating' | 'ready' | 'error' | 'no-key' | 'invalid' | 'confirm';

export interface SetupState {
  phase: Phase;
  record: SetupRecord | null;
  /** True when the setup came from the phone's cache and cost no credits. */
  fromCache: boolean;
  error: string | null;
  /** When generation began, for the elapsed-time counter. */
  startedAt: number | null;
}

const INITIAL: SetupState = {
  phase: 'loading',
  record: null,
  fromCache: false,
  error: null,
  startedAt: null,
};

/**
 * Opens a setup: cached copy first, Claude only if there is none (or the player
 * asks to regenerate). Regenerate keeps the old setup on screen if it fails.
 */
export function useSetup(id: string) {
  const [state, setState] = useState<SetupState>(INITIAL);
  const runId = useRef(0);
  const abort = useRef<AbortController | null>(null);

  const run = useCallback(
    async (force: boolean) => {
      const myRun = ++runId.current;
      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;
      const stale = () => myRun !== runId.current;

      const combo = parseSetupId(id);
      if (!combo) {
        setState({ ...INITIAL, phase: 'invalid' });
        return;
      }

      const cached = await recordStore.get(id);
      if (stale()) return;
      if (cached && !force) {
        setState({ phase: 'ready', record: cached, fromCache: true, error: null, startedAt: null });
        return;
      }

      const apiKey = await apiKeyStore.get();
      if (stale()) return;
      if (!apiKey) {
        setState({ ...INITIAL, phase: cached ? 'ready' : 'no-key', record: cached, fromCache: !!cached });
        return;
      }

      // A first-time generation spends credits, so a link or tap never starts it on its own.
      if (!force) {
        setState({ ...INITIAL, phase: 'confirm' });
        return;
      }

      setState({
        phase: 'generating',
        record: cached,
        fromCache: false,
        error: null,
        startedAt: Date.now(),
      });

      try {
        const result = await generateSetup({ apiKey, combo, signal: controller.signal });
        if (stale()) return;
        const record: SetupRecord = {
          id,
          teamId: combo.teamId,
          trackId: combo.trackId,
          weather: combo.weather,
          createdAt: new Date().toISOString(),
          model: result.model,
          setup: result.setup,
        };
        await recordStore.save(record);
        if (stale()) return;
        setState({ phase: 'ready', record, fromCache: false, error: null, startedAt: null });
      } catch (error) {
        if (stale()) return;
        if (error instanceof GenerateError && error.kind === 'cancelled') return;
        const message = error instanceof Error ? error.message : 'Something went wrong.';
        setState({
          phase: cached ? 'ready' : 'error',
          record: cached,
          fromCache: !!cached,
          error: message,
          startedAt: null,
        });
      }
    },
    [id],
  );

  useEffect(() => {
    run(false);
    return () => {
      runId.current++;
      abort.current?.abort();
    };
  }, [run]);

  const regenerate = useCallback(() => run(true), [run]);
  const retry = useCallback(() => run(true), [run]);

  /** Starts the first generation after the player confirms. */
  const generate = regenerate;

  return { state, regenerate, retry, generate };
}
