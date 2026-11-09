const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// The Anthropic SDK's ES module build has an import cycle (BetaToolRunner <-> beta
// resources) that Metro initialises in the wrong order, which crashes the app on
// launch with "Cannot read property 'BetaToolRunner' of undefined". Its CommonJS
// build handles the cycle, so resolve the SDK through the "require" export condition.
const defaultResolve = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isAnthropicSdk =
    moduleName === '@anthropic-ai/sdk' || moduleName.startsWith('@anthropic-ai/sdk/');
  const resolve = defaultResolve ?? context.resolveRequest;
  if (isAnthropicSdk) {
    return resolve(
      { ...context, unstable_conditionNames: ['require', 'default'], unstable_conditionsByPlatform: {} },
      moduleName,
      platform,
    );
  }
  return resolve(context, moduleName, platform);
};

module.exports = config;
