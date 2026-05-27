'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const { data } = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      setAuth({ id: 0, email }, data.access_token);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed', error.response?.data || error);
      const detail = error.response?.data?.detail;
      setErrorMsg(typeof detail === 'string' ? detail : 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login to AI Analyst</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-4 rounded-md bg-red-500/15 p-3 text-sm text-red-500">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
            <div className="text-center text-sm">
              Don&apos;t have an account? <a href="/register" className="underline">Register</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
