#!/usr/bin/env node
/**
 * Standalone placeholder. The upstream monorepo loads secrets from AWS Secrets Manager.
 * For local development, copy `.env.example` to `.env.local` and set values manually.
 */
console.warn(
  '[getSecrets] Skipped in standalone checkout. Configure `.env.local` manually if needed.'
)
process.exit(0)
