import * as Sentry from '@sentry/cloudflare';

export const handle = ({ event, resolve }) => {
	const requestHandlerOptions = {
		options: {
			// @ts-ignore
			dsn: event.platform.env.SENTRY_DSN,
			tracesSampleRate: 1.0
		},
		request: event.request,
		// @ts-ignore
		context: event.platform.ctx
	};
	// @ts-ignore
	return Sentry.wrapRequestHandler(requestHandlerOptions, () => resolve(event));
};
