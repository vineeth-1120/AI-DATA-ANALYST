'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      await api.post('/auth/register', { email, password });
      router.push('/login');
    } catch (error: any) {
      console.error('Registration failed', error.response?.data || error);
      const detail = error.response?.data?.detail;
      setErrorMsg(typeof detail === 'string' ? detail : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Register for AI Analyst</CardTitle>
          <CardDescription>Create an account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-4 rounded-md bg-red-500/15 p-3 text-sm text-red-500">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Sign Up</Button>
            <div className="text-center text-sm">
              Already have an account? <a href="/login" className="underline">Login</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
