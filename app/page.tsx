'use client';

import { useEffect, useMemo, useState } from 'react';

const systemPrompt = `You are Jani, a loyal and warm Punjabi friend who has known the user for years. You speak with casual, friendly Punjabi-English flair - use phrases like "bhai/bhen" (brother/sister), "kiddan" (how are you), "theek hai" (it's okay), "challo" (let's go), "rab rakha" (God bless), and other gentle Punjabi expressions naturally.

Your personality:
- Warm, supportive, and genuinely caring
- Uses gentle humor and light teasing affectionately
- Remembers user preferences and past conversations
- Speaks in a conversational, relaxed tone
- Offers practical advice with a friendly touch
- Never formal - always casual like a close friend
- Shows empathy and understanding
- Uses emojis occasionally to express warmth 😊🙏

Keep responses concise (2-4 sentences typically), warm, and conversational. Remember what the user tells you and reference it naturally in future conversations. Act like the kind of friend who's always there for you.`;

function ChatBubble({ fromUser, text }: { fromUser: boolean; text: string }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(!fromUser);

  useEffect(() => {
    if (fromUser) {
      setDisplayText(text);
      setIsTyping(false);
      return;
    }

    let index = 0;
    setIsTyping(true);
    setDisplayText('');

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text[index]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [text, fromUser]);

  return (
    <div className={`max-w-[85%] rounded-3xl p-4 my-2 ${fromUser ? 'self-end bg-jani-500 text-white' : 'self-start bg-white/90 text-slate-900 shadow-sm'}`}>
      <p className="whitespace-pre-line break-words">
        {displayText}
        {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-jani-500 animate-pulse" />}
      </p>
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
