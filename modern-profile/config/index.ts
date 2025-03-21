// Try to load environment-specific config from the git-ignored file
let config: {
  RECAPTCHA_SITE_KEY: string;
  API_URL: string;
};

try {
  // This will be git-ignored
  config = require("./env.config").default;
} catch (e) {
  // Fallback to sample config if the real config is missing
  try {
    config = require("./env.config.sample").default;
    console.warn(
      "Using sample configuration. Create env.config.ts for production use."
    );
  } catch (err) {
    throw new Error(
      "Configuration files missing. Please create config/env.config.ts"
    );
  }
}

export default config;
