import { useEffect, useMemo, useState } from 'react';

const systemPrompt = `You are Jani, a loyal Punjabi friend. Speak casually and warmly, with gentle humor and support. Remember user preferences, keep chat light, and act like a trusted companion.`;

function ChatBubble({ fromUser, text }: { fromUser: boolean; text: string }) {
  return (
    <div className={`max-w-[85%] rounded-3xl p-4 my-2 ${fromUser ? 'self-end bg-jani-500 text-white' : 'self-start bg-white/90 text-slate-900 shadow-sm'}`}>
      <p className="whitespace-pre-line break-words">{text}</p>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'system'; text: string }[]>([
    { role: 'system', text: systemPrompt }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.janiBridge?.getMemory().then((data) => {
      if (data?.lastMessage) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.lastMessage }]);
      }
    });
  }, []);

  const conversation = useMemo(() => messages.filter((message) => message.role !== 'system'), [messages]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...conversation, { role: 'user', text: userMessage }] }),
      });
      const data = await response.json();
      const assistantText = data.result || 'Sorry, Jani didn\'t catch that. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', text: assistantText }]);
      window.janiBridge?.setMemory('lastMessage', assistantText);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Jani is having trouble reaching the brain right now.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-jani-50 via-white to-slate-100 p-6 text-slate-900">
      <section className="mx-auto flex h-[calc(100vh-3rem)] max-w-2xl flex-col rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-2xl backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-jani-700">Jani</p>
            <h1 className="text-3xl font-semibold text-slate-900">Your Punjabi companion</h1>
          </div>
          <div className="rounded-full bg-jani-100 px-3 py-2 text-sm text-jani-800">Alt + Space</div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col">
            {messages.filter((message) => message.role !== 'system').map((message, index) => (
              <ChatBubble key={index} fromUser={message.role === 'user'} text={message.text} />
            ))}
            {loading && <ChatBubble fromUser={false} text="Jani is thinking..." />}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Jani anything..."
            className="flex-1 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-jani-400 focus:ring-2 focus:ring-jani-100"
          />
          <button type="submit" className="rounded-3xl bg-jani-500 px-6 py-3 text-white transition hover:bg-jani-600" disabled={loading}>
            Send
          </button>
        </form>
      </section>
    </main>
  );
}
