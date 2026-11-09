import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { normalizeSetup, type Setup } from '../domain/normalize';
import type { Combo } from '../domain/ids';
import { buildSystemPrompt, buildUserPrompt } from '../domain/prompt';
import { SetupResponseSchema } from '../domain/schema';

/** Claude Opus 5.5: the strongest default for reasoning over many interacting settings. */
export const MODEL = 'claude-opus-5-5';

export type GenerateErrorKind =
  | 'auth'
  | 'billing'
  | 'rate-limit'
  | 'network'
  | 'refusal'
  | 'truncated'
  | 'bad-output'
  | 'cancelled'
  | 'api';

export class GenerateError extends Error {
  constructor(
    readonly kind: GenerateErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'GenerateError';
  }
}

export interface GenerateResult {
  setup: Setup;
  /** The model that actually answered (a fallback model if the first one declined). */
  model: string;
}

function mapApiError(error: unknown): GenerateError {
  if (error instanceof Anthropic.APIUserAbortError) {
    return new GenerateError('cancelled', 'Cancelled.');
  }
  if (error instanceof Anthropic.AuthenticationError) {
    return new GenerateError('auth', 'Anthropic rejected this API key. Check it in Settings.');
  }
  if (error instanceof Anthropic.PermissionDeniedError) {
    return new GenerateError('auth', 'This API key is not allowed to use Claude Opus 5.5.');
  }
  if (error instanceof Anthropic.RateLimitError) {
    return new GenerateError('rate-limit', 'Rate limit reached. Wait a minute and try again.');
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return new GenerateError('network', 'Could not reach Anthropic. Check your connection.');
  }
  if (error instanceof Anthropic.BadRequestError) {
    if (/credit balance/i.test(error.message)) {
      return new GenerateError(
        'billing',
        'Your Anthropic account is out of credits. Add credits in the Anthropic Console.',
      );
    }
    return new GenerateError('api', `Anthropic rejected the request: ${error.message}`);
  }
  if (error instanceof Anthropic.APIError) {
    return new GenerateError('api', `Anthropic error ${error.status ?? ''}: ${error.message}`);
  }
  return new GenerateError('api', error instanceof Error ? error.message : 'Something went wrong.');
}

/**
 * Asks Claude for a full setup. The key never leaves this phone except in the
 * request to api.anthropic.com.
 */
export async function generateSetup(args: {
  apiKey: string;
  combo: Combo;
  signal?: AbortSignal;
}): Promise<GenerateResult> {
  const client = new Anthropic({
    apiKey: args.apiKey,
    // A phone app holds the user's own key; there is no server in between.
    dangerouslyAllowBrowser: true,
    timeout: 240_000,
  });

  const send = (withFallback: boolean) =>
    client.beta.messages.create(
      {
        model: MODEL,
        // Non-streaming: React Native's fetch cannot stream. 20k stays under the SDK's
        // limit for non-streaming requests.
        max_tokens: 20_000,
        output_config: {
          effort: 'high',
          format: zodOutputFormat(SetupResponseSchema),
        },
        system: buildSystemPrompt(),
        messages: [{ role: 'user', content: buildUserPrompt(args.combo) }],
        // If a safety classifier wrongly declines, Anthropic re-runs the request on its
        // recommended fallback model.
        ...(withFallback
          ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const }
          : {}),
      },
      { signal: args.signal },
    );

  let response;
  try {
    try {
      response = await send(true);
    } catch (error) {
      // The fallback option is a nice-to-have. If the API rejects it, try once without it
      // rather than leaving the player with no setup.
      if (error instanceof Anthropic.BadRequestError && /fallback/i.test(error.message)) {
        response = await send(false);
      } else {
        throw error;
      }
    }
  } catch (error) {
    throw mapApiError(error);
  }

  if (response.stop_reason === 'refusal') {
    throw new GenerateError('refusal', 'Claude declined this request. Try again in a moment.');
  }
  if (response.stop_reason === 'max_tokens') {
    throw new GenerateError('truncated', 'The answer was cut off. Try again.');
  }

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new GenerateError('bad-output', 'Claude returned no setup. Try again.');
  }

  let parsed;
  try {
    parsed = SetupResponseSchema.safeParse(JSON.parse(textBlock.text));
  } catch {
    throw new GenerateError('bad-output', 'Claude returned an unreadable setup. Try again.');
  }
  if (!parsed.success) {
    throw new GenerateError('bad-output', 'Claude left out some settings. Try again.');
  }

  return { setup: normalizeSetup(parsed.data), model: response.model };
}
