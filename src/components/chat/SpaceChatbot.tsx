import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Msg = { role: 'user' | 'assistant'; content: string };

const STARTER_QUESTIONS = [
  'What is the Kessler syndrome?',
  'How is collision risk calculated?',
  'List active ISRO satellites',
  'Explain Δv avoidance maneuvers',
];

export const SpaceChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        "Hi Commander 👋 I'm **SpaceShield AI**. Ask me anything about satellites, debris, collision risk, solar weather or ISRO missions.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/space-chat`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (resp.status === 429) {
        toast.error('Rate limit reached. Please try again shortly.');
        setLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast.error('AI credits exhausted. Add funds in Workspace > Usage.');
        setLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistant = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') continue;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((prev) =>
                prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistant } : m,
                ),
              );
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to reach SpaceShield AI.');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed bottom-5 right-5 z-[90] h-14 w-14 rounded-full grid place-items-center',
          'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg',
          'hover:scale-110 transition-transform',
          'before:absolute before:inset-0 before:rounded-full before:bg-primary/40 before:animate-ping before:-z-10',
        )}
        aria-label="Open SpaceShield AI"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[95] w-[380px] max-w-[calc(100vw-2.5rem)] h-[560px] max-h-[80vh] glass-panel flex flex-col overflow-hidden border-primary/30 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="px-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/15 to-accent/15 flex items-center gap-2">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-success animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">SpaceShield AI</p>
              <p className="text-[10px] text-muted-foreground">Online · powered by Lovable AI</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm max-w-[90%]',
                    m.role === 'user'
                      ? 'ml-auto bg-primary/20 border border-primary/30'
                      : 'mr-auto bg-secondary/50 border border-border/40',
                  )}
                >
                  <div className="prose prose-invert prose-sm max-w-none [&>*]:my-1">
                    <ReactMarkdown>{m.content || '…'}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> thinking…
                </div>
              )}
            </div>
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[11px] px-2 py-1 rounded-full bg-secondary/60 hover:bg-primary/20 border border-border/50 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-border/50 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about satellites, debris, collisions…"
              className="bg-secondary/50 text-sm"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
