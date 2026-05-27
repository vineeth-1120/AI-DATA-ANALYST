'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Chart } from '@/components/Chart';
import { ArrowLeft, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chartData?: any;
}

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am your AI Data Analyst. Ask me any question about your dataset.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/chat/', {
        dataset_id: parseInt(id as string),
        query: userMessage.content
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        chartData: data.chart_data
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error', error);
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error analyzing your data.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 p-4 flex items-center">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mr-4">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back
        </Button>
        <h1 className="text-xl font-semibold">AI Data Analysis</h1>
      </header>

      <div className="flex-1 overflow-hidden p-4 max-w-4xl mx-auto w-full">
        <div className="h-full flex flex-col space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-900 border border-zinc-800'}`}>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    {msg.chartData && <Chart data={msg.chartData} />}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-zinc-400 animate-pulse">
                    Analyzing dataset...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 pt-4 border-t border-zinc-800">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about your data... e.g. 'Show me a bar chart of sales by month'"
              className="flex-1 bg-zinc-900 border-zinc-800"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
