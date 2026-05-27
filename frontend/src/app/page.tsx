import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, BarChart3, MessageSquareText, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
      <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">AI Analyst</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">Login</Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="px-8 py-20 max-w-6xl mx-auto text-center">
        <div className="space-y-6 max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            Your Autonomous AI Data Analyst
          </h1>
          <p className="text-xl text-zinc-400">
            Upload your datasets and interact with them using natural language. Get instant insights, beautiful charts, and deep analysis without writing a single line of code.
          </p>
          <div className="pt-8 flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg">
                Start Analyzing Free
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left mt-24">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant Insights</h3>
            <p className="text-zinc-400">Automatically clean, process, and analyze your datasets the moment you upload them.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
              <MessageSquareText className="h-6 w-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Natural Language</h3>
            <p className="text-zinc-400">Ask questions in plain English and get detailed analytical answers instantly.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Auto Visualization</h3>
            <p className="text-zinc-400">Beautiful, interactive charts generated automatically based on context.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
