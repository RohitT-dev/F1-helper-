/** Anthropic API keys start with `sk-ant-`. This catches paste mistakes, not wrong keys. */
export function looksLikeAnthropicKey(value: string): boolean {
  const key = value.trim();
  return /^sk-ant-[A-Za-z0-9_-]{20,}$/.test(key);
}

/** "sk-ant-api03-••••••••WXYZ": shows enough to recognise the key, hides the rest. */
export function maskKey(value: string): string {
  const key = value.trim();
  if (key.length <= 12) return '••••••••';
  return `${key.slice(0, 10)}••••••••${key.slice(-4)}`;
}
