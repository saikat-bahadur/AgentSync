"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth.client";
import styles from "./sign-in-view.module.css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters long",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [bubbles, setBubbles] = useState<
    Array<{
      id: number;
      size: number;
      left: number;
      top: number;
      animationDuration: number;
      delay: number;
    }>
  >([]);
  const [matrixLines, setMatrixLines] = useState<
    Array<{
      id: number;
      left: number;
      delay: number;
      duration: number;
    }>
  >([]);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      size: number;
      delay: number;
    }>
  >([]);
  const [aiAgents, setAiAgents] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      delay: number;
      size: number;
    }>
  >([]);
  const [aiConnections, setAiConnections] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      width: number;
      angle: number;
      delay: number;
    }>
  >([]);
  const [aiNodes, setAiNodes] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      delay: number;
    }>
  >([]);
  const { toast } = useToast();

  // Generate random background elements
  useEffect(() => {
    let isMounted = true;

    const generateElements = () => {
      if (!isMounted) return;

      // Generate bubbles
      const newBubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 30 + 10,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDuration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
      }));

      // Generate matrix lines
      const newMatrixLines = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      }));

      // Generate particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 10,
      }));

      // Generate AI agents
      const newAiAgents = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 80,
        top: Math.random() * 80 + 10,
        delay: Math.random() * 5,
        size: Math.random() * 16 + 16,
      }));

      // Generate AI connections
      const newAiConnections = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: Math.random() * 80 + 10,
        top: Math.random() * 80 + 10,
        width: Math.random() * 100 + 50,
        angle: Math.random() * 360,
        delay: Math.random() * 5,
      }));

      // Generate AI nodes
      const newAiNodes = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
      }));

      if (isMounted) {
        setBubbles(newBubbles);
        setMatrixLines(newMatrixLines);
        setParticles(newParticles);
        setAiAgents(newAiAgents);
        setAiConnections(newAiConnections);
        setAiNodes(newAiNodes);
      }
    };

    generateElements();
    const interval = setInterval(generateElements, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast({
        title: "Account created successfully!",
        description: "Welcome to our platform.",
      });
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please check your information and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsGithubLoading(true);
      await authClient.signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("GitHub sign-in error:", error);
    } finally {
      setIsGithubLoading(false);
    }
  };

  // Handle mouse move for parallax effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement;
    if (!target) return;

    try {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables directly
      target.style.setProperty("--mouse-x", `${x}px`);
      target.style.setProperty("--mouse-y", `${y}px`);
    } catch (error) {
      console.warn("Error in mouse move handler:", error);
    }
  }, []);

  return (
    <div
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      <div className={styles.background}>
        {/* Matrix Lines */}
        <div className={styles.matrixLines}>
          {matrixLines.map((line) => (
            <div
              key={`line-${line.id}`}
              className={styles.matrixLine}
              style={{
                left: `${line.left}%`,
                animation: `matrixFall ${line.duration}s linear infinite`,
                animationDelay: `${line.delay}s`,
                height: `${Math.random() * 100 + 50}px`,
                opacity: Math.random() * 0.1 + 0.05,
              }}
            />
          ))}
        </div>

        {/* Floating Bubbles */}
        <div className={styles.bubbles}>
          {bubbles.map((bubble) => (
            <div
              key={`bubble-${bubble.id}`}
              className={`${styles.bubble} ${isHovered ? styles.hovered : ""}`}
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                top: `${bubble.top}%`,
                animationDuration: `${bubble.animationDuration}s`,
                animationDelay: `${bubble.delay}s`,
                background: `rgba(0, ${Math.random() * 100 + 155}, ${
                  Math.random() * 100 + 155
                }, ${Math.random() * 0.1 + 0.05})`,
                boxShadow: `0 0 ${bubble.size * 0.8}px rgba(0, ${
                  Math.random() * 100 + 155
                }, ${Math.random() * 100 + 155}, 0.3)`,
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        <div className={styles.particles}>
          {particles.map((particle) => (
            <div
              key={`particle-${particle.id}`}
              className={styles.particle}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                opacity: Math.random() * 0.6 + 0.1,
                background: `rgba(${Math.random() * 50 + 150}, ${
                  Math.random() * 100 + 155
                }, 255, 0.8)`,
              }}
            />
          ))}
        </div>

        {/* Animated Glow Effects */}
        <div className={styles.glow}>
          <div />
          <div />
          <div />
        </div>
      </div>

      {/* AI Agent Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {aiAgents.map((agent) => (
          <div
            key={`agent-${agent.id}`}
            className={styles.aiAgent}
            style={{
              left: `${agent.left}%`,
              top: `${agent.top}%`,
              width: `${agent.size}px`,
              height: `${agent.size}px`,
              animationDelay: `${agent.delay}s`,
              opacity: 0.8,
            }}
          />
        ))}

        {aiConnections.map((conn) => (
          <div
            key={`conn-${conn.id}`}
            className={styles.aiConnection}
            style={{
              left: `${conn.left}%`,
              top: `${conn.top}%`,
              width: `${conn.width}px`,
              transform: `rotate(${conn.angle}deg)`,
              animationDelay: `${conn.delay}s`,
            }}
          />
        ))}

        {aiNodes.map((node) => (
          <div
            key={`node-${node.id}`}
            className={styles.aiNode}
            style={{
              left: `${node.left}%`,
              top: `${node.top}%`,
              animationDelay: `${node.delay}s`,
            }}
          />
        ))}
      </div>

      <Card
        className={`${styles.card} ${isHovered ? styles.cardHover : ""}`}
        style={
          {
            "--mouse-x": "0px",
            "--mouse-y": "0px",
          } as React.CSSProperties
        }
      >
        <CardHeader className="space-y-2 text-center">
          <div className="w-12 h-12 bg-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <CardTitle className={`text-3xl font-bold ${styles.welcomeTitle}`}>
            Create an account
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Enter your information to continue your journey
          </CardDescription>
        </CardHeader>

        <CardContent className={styles.cardContent}>
          {/* Social login buttons */}
          <div className={styles.socialButtons}>
            <div className={styles.socialButtonsRow}>
              <Button
                variant="outline"
                type="button"
                className={`${styles.socialButton} ${
                  isGoogleLoading ? "opacity-50" : ""
                }`}
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading || isGithubLoading}
              >
                {isGoogleLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                className={`${styles.socialButton} ${
                  isGithubLoading ? "opacity-50" : ""
                }`}
                onClick={handleGithubSignIn}
                disabled={isLoading || isGoogleLoading || isGithubLoading}
              >
                {isGithubLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.github className="mr-2 h-4 w-4" />
                )}
                GitHub
              </Button>
            </div>

            <div className={styles.divider}>
              <span className={styles.dividerLine}></span>
              <span className={styles.dividerText}>OR CONTINUE WITH EMAIL</span>
              <span className={styles.dividerLine}></span>
            </div>
          </div>

          {/* Email/Password form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-green-100">
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className={styles.input}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-green-100">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        className={styles.input}
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
                    <FormLabel className="text-sm font-semibold text-green-100">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className={styles.input}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Icons.eyeOff className="h-4 w-4" />
                          ) : (
                            <Icons.eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-green-100">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className={styles.input}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <Icons.eyeOff className="h-4 w-4" />
                          ) : (
                            <Icons.eye className="h-4 w-4" />
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
                className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-md shadow-green-900/20 transition-all"
                disabled={isLoading || isGoogleLoading || isGithubLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 text-center text-sm text-gray-400">
          <div>
            Already have an account?{" "}
            <button
              className="text-green-500 hover:text-green-600 font-medium transition-colors"
              onClick={() => router.push("/sign-in")}
            >
              Sign in
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
