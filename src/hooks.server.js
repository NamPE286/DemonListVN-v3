import { sequence } from "@sveltejs/kit/hooks";
import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://3a9bd93d4195242961397ef7df2ca14f@o4509770173054976.ingest.us.sentry.io/4509770176790528',

  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle());

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
