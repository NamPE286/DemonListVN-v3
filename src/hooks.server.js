import { sequence } from '@sveltejs/kit/hooks';
import { initCloudflareSentryHandle, sentryHandle, handleErrorWithSentry } from '@sentry/sveltekit';

export const handle = sequence(
	initCloudflareSentryHandle({
		dsn: process.env.SENTRY_DSN,
		tracesSampleRate: 1.0,
    enableLogs: true
	}),
	sentryHandle()
);

export const handleError = handleErrorWithSentry();
