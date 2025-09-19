import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from './App';
import './styles.css';

Sentry.init({
  dsn: "YOUR_SENTRY_DSN_HERE", // Replace with your actual DSN
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const root = createRoot(document.getElementById('root'));
root.render(<App />);
