'use client';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || typeof window === 'undefined') return;
    import('posthog-js').then(({ default: posthog }) => {
      if (!posthog.__loaded) {
        posthog.init(key, {
          api_host: 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: false,
        });
      }
    }).catch(() => {});
  }, []);

  return <>{children}</>;
}
