import { reportDocError } from './error-reporter';

export function bootstrapErrorProbe() {
  if (typeof window === 'undefined') return;

  const handleError = (event: ErrorEvent) => {
    reportDocError({
      message: event.message,
      stack: event.error?.stack,
      route: window.location.pathname,
      component: 'docs-window-error',
      userAgent: navigator.userAgent,
    });
  };

  const handleRejection = (event: PromiseRejectionEvent) => {
    reportDocError({
      message: String(event.reason),
      route: window.location.pathname,
      component: 'docs-unhandled-rejection',
      userAgent: navigator.userAgent,
    });
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);
}
