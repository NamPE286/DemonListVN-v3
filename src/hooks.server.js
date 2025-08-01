import { handleErrorWithSentry, sentryHandle, initCloudflareSentryHandle } from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(
	initCloudflareSentryHandle({
		dsn: 'https://a051a3204dbf41eb600f322b67dd4cdc@o4509770173054976.ingest.us.sentry.io/4509770259365888',
		tracesSampleRate: 1.0,
		enableLogs: true
	}),
	sentryHandle()
);
export const handleError = handleErrorWithSentry();
