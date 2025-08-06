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

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export const SignInView = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    Array<{ id: number; left: number; delay: number; duration: number }>
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
    Array<{ id: number; left: number; top: number; delay: number }>
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
        size: Math.random() * 30 + 10, // 10-40px
        left: Math.random() * 100, // 0-100%
        top: Math.random() * 100, // 0-100%
        animationDuration: Math.random() * 15 + 10, // 10-25s
        delay: Math.random() * 5, // 0-5s
      }));

      // Generate matrix lines
      const newMatrixLines = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.random() * 100, // 0-100%
        delay: Math.random() * 5, // 0-5s
        duration: Math.random() * 3 + 2, // 2-5s
      }));

      // Generate particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100, // 0-100%
        top: Math.random() * 100, // 0-100%
        size: Math.random() * 2 + 1, // 1-3px
        delay: Math.random() * 10, // 0-10s
      }));

      // Generate AI Agents
      const newAiAgents = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: Math.random() * 80, // 0-80%
        top: Math.random() * 80 + 10, // 10-90%
        delay: Math.random() * 5,
        size: Math.random() * 16 + 16, // 16-32px
      }));

      // Generate AI Connections
      const newAiConnections = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 80,
        top: Math.random() * 80 + 10,
        width: Math.random() * 100 + 50,
        angle: Math.random() * 360,
        delay: Math.random() * 3,
      }));

      // Generate AI Nodes
      const newAiNodes = Array.from({ length: 15 }, (_, i) => ({
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

    // Cleanup function
    return () => {
      isMounted = false;
      // Clear all animation frames
      const elements = document.querySelectorAll(
        ".bubble, .matrixLine, .particle, .aiAgent, .aiConnection, .aiNode"
      );
      elements.forEach((el) => {
        try {
          const animations = el.getAnimations();
          animations.forEach((animation) => {
            try {
              animation.cancel();
            } catch (e) {
              console.warn("Failed to cancel animation:", e);
            }
          });
        } catch (e) {
          console.warn("Error getting animations:", e);
        }
      });
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isPending && session) {
      router.push("/");
    }
  }, [isPending, session, router]);

  // if (isPending) {
  //   return <p>Loading...</p>;
  // }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      // Real authentication
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if ("data" in result && result.data) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid email or password.",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
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
        provider: "google",
      });
      if ("data" in result && result.data) {
        toast({
          title: "Google Sign-in successful",
        });
        router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Google Sign-in failed",
        });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
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
        provider: "github",
      });
      if ("data" in result && result.data) {
        toast({
          title: "GitHub Sign-in successful",
        });
        router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "GitHub Sign-in failed",
        });
      }
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      toast({
        variant: "destructive",
        title: "GitHub Sign-in error",
      });
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Sign in to your account to continue your journey
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
                        style={{
                          paddingRight: "40px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
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
                  <FormItem className="w-full">
                    <FormLabel className={styles.formLabel}>Password</FormLabel>
                    <FormControl>
                      <div className={styles.passwordContainer}>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className={styles.input}
                          style={{
                            paddingRight: "40px",
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                          {...field}
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
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

              <Button
                type="submit"
                className={`w-full h-12 ${styles.loginButton} ${
                  isLoading ? styles.loading : ""
                }`}
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
          <div className="text-sm text-gray-300">
            Don't have an account?{" "}
            <button
              className="text-blue-400 hover:text-blue-300 font-medium transition-all hover:underline underline-offset-4"
              onClick={() => router.push("/sign-up")}
            >
              Create account
            </button>
          </div>
          <button className="text-sm text-gray-400 hover:text-blue-300 transition-all hover:underline underline-offset-4">
            Forgot your password?
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};
