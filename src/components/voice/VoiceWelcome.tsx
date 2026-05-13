import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KEY = 'spaceshield_voice_welcomed_v1';
const MESSAGE =
  'Welcome to SpaceShield. Your orbital safety dashboard is online. Tracking satellites, debris and collision risks in real time. Enjoy your mission, Commander.';

const speak = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(MESSAGE);
    u.rate = 0.98;
    u.pitch = 1;
    u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => /Google US English|Samantha|Microsoft Aria/i.test(v.name)) || voices[0];
    if (preferred) u.voice = preferred;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
};

/**
 * Speaks a one-time welcome via the Web Speech API.
 * Many browsers block speech until a user gesture; we show a small prompt that
 * requires one click to enable. After that visit the welcome auto-plays.
 */
export const VoiceWelcome = () => {
  const [show, setShow] = useState(false);
  const [enabled, setEnabled] = useState(() => localStorage.getItem(KEY) === '1');

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (enabled) {
      // try auto-play; if blocked, show the prompt
      const t = setTimeout(() => speak(), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, [enabled]);

  const accept = () => {
    localStorage.setItem(KEY, '1');
    setEnabled(true);
    setShow(false);
    speak();
  };
  const dismiss = () => {
    localStorage.setItem(KEY, '0');
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="fixed bottom-5 left-5 z-[95] glass-panel border-primary/40 p-3 max-w-xs animate-in slide-in-from-left-4 fade-in">
      <div className="flex items-start gap-2">
        <Volume2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 text-xs">
          <p className="font-semibold">Voice greeting</p>
          <p className="text-muted-foreground">Let SpaceShield welcome you on every visit?</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={accept} className="h-7 text-xs">
              <Volume2 className="h-3 w-3 mr-1" /> Enable
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss} className="h-7 text-xs">
              <VolumeX className="h-3 w-3 mr-1" /> Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
