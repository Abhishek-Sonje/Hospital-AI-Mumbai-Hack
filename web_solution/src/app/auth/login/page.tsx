"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/lib/types';
import { ModeToggle } from '@/components/mode-toggle';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, appUser } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (appUser) {
      console.log("User authenticated, redirecting to:", appUser.role);
      router.push(`/${appUser.role}`);
    }
  }, [appUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        // Redirection handled by useEffect
      } else {
        await signUp(email, password, role, displayName);
        // Redirection handled by useEffect
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Authentication failed');
      setLoading(false); // Only stop loading on error, otherwise wait for redirect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      
      <Card className="w-full max-w-md shadow-xl border-slate-200 dark:border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-slate-50">
            Hospital AI Operations
          </CardTitle>
          <CardDescription className="text-center text-slate-500 dark:text-slate-400">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital Staff/Admin</SelectItem>
                    <SelectItem value="user">General User (Patient/Citizen)</SelectItem>
                    <SelectItem value="medical">Medical/Pharmacy Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
              {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">Demo Credentials:</p>
            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <p><strong>Hospital:</strong> hospital@demo.com / demo123</p>
              <p><strong>User:</strong> user@demo.com / demo123</p>
              <p><strong>Medical:</strong> medical@demo.com / demo123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

