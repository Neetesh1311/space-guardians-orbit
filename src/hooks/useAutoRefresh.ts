import { useEffect, useRef, useState } from 'react';

/**
 * Calls `onTick` on an interval. Pauses automatically when the tab is hidden
 * and when `enabled` is false. Resumes (and fires once) on visibility return.
 */
export const useAutoRefresh = (
  onTick: () => void,
  intervalMs: number,
  enabled: boolean,
) => {
  const cb = useRef(onTick);
  cb.current = onTick;

  const [hidden, setHidden] = useState(typeof document !== 'undefined' ? document.hidden : false);

  useEffect(() => {
    const handler = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  useEffect(() => {
    if (!enabled || hidden) return;
    const id = setInterval(() => cb.current(), intervalMs);
    return () => clearInterval(id);
  }, [enabled, hidden, intervalMs]);

  return { paused: hidden };
};
