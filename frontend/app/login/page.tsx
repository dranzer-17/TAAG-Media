"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Chrome } from 'lucide-react'; // <-- IMPORT THE CHROME ICON FROM LUCIDE

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Success! Please check your email for a confirmation link.');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Successfully signed in!');
      // In a real app, you would redirect here:
      // window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 aurora-background">
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-lg shadow-2xl shadow-black/20">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block text-2xl font-bold">
            Taag<span className="text-blue-500">.</span>
          </Link>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to access the Match & Bill platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button variant="outline" className="w-full" onClick={handleSignInWithGoogle}>
              {/* USE THE CHROME ICON HERE */}
              <Chrome className="mr-2 h-4 w-4" /> 
              Continue with Google
            </Button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or with email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent" />
            </div>
            {message && <p className="text-sm text-center text-muted-foreground">{message}</p>}
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="w-full">Sign In</Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleSignUp}>Sign Up</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}