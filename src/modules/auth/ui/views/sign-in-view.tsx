'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth.client';
import { useEffect } from 'react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }), 
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

export const SignInView = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isPending && session) {
      router.push('/');
    }
  }, [isPending, session, router]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      // Real authentication
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if ('data' in result && result.data) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid email or password.",
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await authClient.signIn.social({
        provider: 'google',
      });
      if ('data' in result && result.data) {
        toast({
          title: "Google Sign-in successful",
        });
        // Removed premature redirect to allow session to establish first
        // router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Google Sign-in failed",
        });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        variant: "destructive",
        title: "Google Sign-in error",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsGithubLoading(true);
      const result = await authClient.signIn.social({
        provider: 'github',
      });
      if ('data' in result && result.data) {
        toast({
          title: "GitHub Sign-in successful",
        });
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "GitHub Sign-in failed",
        });
      }
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      toast({
        variant: "destructive",
        title: "GitHub Sign-in error",
      });
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-900 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 bg-gray-900 border border-green-700 rounded-lg shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="w-12 h-12 bg-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <CardTitle className="text-3xl font-bold text-green-500">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-300">
            Sign in to your account to continue your journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="social"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="h-11 bg-gray-800 hover:bg-green-700 text-white"
            >
              {isGoogleLoading ? (
                <Icons.spinner className="w-4 h-4" />
              ) : (
                <Icons.google className="w-4 h-4" />
              )}
              Google
            </Button>
            <Button
              variant="social"
              onClick={handleGithubSignIn}
              disabled={isLoading || isGithubLoading}
              className="h-11 bg-gray-800 hover:bg-green-700 text-white"
            >
              {isGithubLoading ? (
                <Icons.spinner className="w-4 h-4" />
              ) : (
                <Icons.github className="w-4 h-4" />
              )}
              GitHub
            </Button>
          </div>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-green-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-3 text-green-600 font-medium">
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>
          
          {/* Email/Password form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white">Email address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        type="email"
                        className="transition-smooth bg-gray-800 text-white placeholder-gray-400"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pr-10 transition-smooth bg-gray-800 text-white placeholder-gray-400"
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Icons.eyeOff className="w-4 h-4" />
                          ) : (
                            <Icons.eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="w-4 h-4" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 text-center text-sm text-gray-400">
          <div>
            Don't have an account?{' '}
            <button 
              className="text-green-500 hover:text-green-600 font-medium transition-colors"
              onClick={() => router.push('/sign-up')}
            >
              Create account
            </button>
          </div>
          <button className="hover:text-white transition-colors">
            Forgot your password?
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};