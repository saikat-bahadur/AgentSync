'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Bot, MessageSquare, Video, Zap, Sparkles, Mic, Users, Clock } from 'lucide-react';

export function HeroMockup() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item: import('framer-motion').Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16">
      {/* Main mockup container */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={container}
        className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Mockup header */}
        <div className="bg-muted/50 border-b border-border p-4 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center text-sm font-medium text-muted-foreground">
            intellimeet.com/meeting/abc123
          </div>
        </div>

        {/* Mockup content */}
        <div className="grid grid-cols-1 md:grid-cols-3 h-[400px]">
          {/* Participants list */}
          <motion.div 
            variants={item}
            className="hidden md:block border-r border-border bg-muted/20 p-4 overflow-y-auto"
          >
            <h3 className="font-medium mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2" /> Participants (3)
            </h3>
            {['Alex Johnson', 'Sam Wilson', 'AI Assistant'].map((name, i) => (
              <div key={i} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  i === 2 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                }`}>
                  {name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium">{name}</div>
                  {i === 2 && <div className="text-xs text-muted-foreground">AI Assistant</div>}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Main video area */}
          <motion.div 
            variants={item}
            className="md:col-span-2 bg-background flex flex-col"
          >
            <div className="flex-1 relative">
              {/* AI Assistant message */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 left-4 right-4 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-xl p-3 max-w-xs"
              >
                <div className="flex items-start">
                  <div className="bg-primary/20 p-1.5 rounded-lg mr-2">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">I noticed you mentioned "Q2 goals". Would you like me to take notes on this topic?</p>
                    <div className="flex space-x-2 mt-2">
                      <button className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Yes, please</button>
                      <button className="text-xs bg-muted text-foreground px-2 py-1 rounded">No thanks</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="border-t border-border p-3 bg-card">
              <div className="flex items-center justify-center space-x-4">
                <button className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                  <Mic className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" /> 00:12:45
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
      >
        <Sparkles className="h-6 w-6 text-primary" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center"
      >
        <Zap className="h-6 w-6 text-secondary" />
      </motion.div>
    </div>
  );
}
