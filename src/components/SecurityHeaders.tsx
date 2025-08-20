import { useEffect } from 'react';

interface SecurityConfig {
  enableCSP?: boolean;
  enableHSTS?: boolean;
  enableXFrameOptions?: boolean;
  reportViolations?: boolean;
}

const defaultConfig: SecurityConfig = {
  enableCSP: true,
  enableHSTS: true,
  enableXFrameOptions: true,
  reportViolations: true,
};

export const SecurityHeaders: React.FC<SecurityConfig> = (props) => {
  const config = { ...defaultConfig, ...props };

  useEffect(() => {
    // Content Security Policy
    if (config.enableCSP) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co https://www.google-analytics.com",
        "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        config.reportViolations ? "report-uri /api/csp-violation" : "",
      ].filter(Boolean).join('; ');
      
      document.head.appendChild(cspMeta);
    }

    // X-Frame-Options
    if (config.enableXFrameOptions) {
      const xframeMeta = document.createElement('meta');
      xframeMeta.httpEquiv = 'X-Frame-Options';
      xframeMeta.content = 'DENY';
      document.head.appendChild(xframeMeta);
    }

    // X-Content-Type-Options
    const xContentMeta = document.createElement('meta');
    xContentMeta.httpEquiv = 'X-Content-Type-Options';
    xContentMeta.content = 'nosniff';
    document.head.appendChild(xContentMeta);

    // Referrer Policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerMeta);

    // Permissions Policy
    const permissionsMeta = document.createElement('meta');
    permissionsMeta.httpEquiv = 'Permissions-Policy';
    permissionsMeta.content = [
      'geolocation=(self)',
      'microphone=()',
      'camera=()',
      'payment=(self)',
      'usb=()',
    ].join(', ');
    document.head.appendChild(permissionsMeta);

    return () => {
      // Cleanup meta tags if component unmounts
      const metaTags = document.querySelectorAll('meta[http-equiv]');
      metaTags.forEach(tag => {
        if (tag.getAttribute('http-equiv')?.includes('Content-Security-Policy') ||
            tag.getAttribute('http-equiv')?.includes('X-Frame-Options') ||
            tag.getAttribute('http-equiv')?.includes('X-Content-Type-Options') ||
            tag.getAttribute('http-equiv')?.includes('Permissions-Policy')) {
          tag.remove();
        }
      });
    };
  }, [config]);

  return null;
};

// CSP violation reporting
export const reportCSPViolation = (violationReport: any) => {
  const report = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    violation: violationReport,
  };

  console.warn('CSP Violation:', report);
  
  // Send to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/csp-violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    }).catch(err => console.error('Failed to report CSP violation:', err));
  }
};

// Setup CSP violation listener
if (typeof window !== 'undefined') {
  document.addEventListener('securitypolicyviolation', (e) => {
    reportCSPViolation({
      blockedURI: e.blockedURI,
      documentURI: e.documentURI,
      effectiveDirective: e.effectiveDirective,
      originalPolicy: e.originalPolicy,
      referrer: e.referrer,
      statusCode: e.statusCode,
      violatedDirective: e.violatedDirective,
    });
  });
}