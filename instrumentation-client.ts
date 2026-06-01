import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: "https://86746e44e61bbdc79d566f5d8a594dde@o4511488372637696.ingest.de.sentry.io/4511488377684048",
  // Adds request headers and IP for users
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
  integrations: [
    Sentry.replayIntegration(),
  ],
});
