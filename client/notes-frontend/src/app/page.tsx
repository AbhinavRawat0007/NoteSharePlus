"use client";

import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lock, FolderKanban, Users, Share2, Star } from "lucide-react";

// Mock UI Components (replace with your actual component library like shadcn/ui)
const Button = ({ children, className, ...props }: any) => (
  <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`} {...props}>
    {children}
  </button>
);

const Input = ({ className, ...props }: any) => (
  <input className={`flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Card = ({ children, className, ...props }: any) => <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>{children}</div>;
const CardHeader = ({ children, className, ...props }: any) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>{children}</div>;
const CardTitle = ({ children, className, ...props }: any) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>;
const CardContent = ({ children, className, ...props }: any) => <div className={`p-6 ${className}`} {...props}>{children}</div>;


// ----------------------------------------------------------------
// 1. Header Component
// ----------------------------------------------------------------

interface LandingHeaderProps {
  onLogin: () => void;
}

const LandingHeader = ({ onLogin }: LandingHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">NoteShare+</span>
          </div>
          <div className="flex items-center">
            <Button 
              onClick={onLogin} 
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all text-base"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// ----------------------------------------------------------------
// 2. Hero Section
// ----------------------------------------------------------------

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative bg-black overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Unlock Your Academic Potential, <span className="text-blue-400">Together.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0">
              Share, manage, and organize your notes seamlessly. Built for students, creators, and teams who value collaboration.
            </p>
            <div className="mt-8 flex justify-center md:justify-start">
              <Button onClick={onGetStarted} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 text-lg rounded-lg">
                Get Started for Free
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <img 
              src="/images/bg3.jpg"
              alt="Students collaborating" 
              className="rounded-2xl shadow-2xl object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------
// 3. Features Section
// ----------------------------------------------------------------

const features = [
  { icon: Lock, title: "Secure Login", description: "Your notes are always safe with JWT-based authentication and optional Google/GitHub login for hassle-free access." },
  { icon: FolderKanban, title: "Organized Notes", description: "Create, edit, and manage your notes with ease. Tagging, search, and categories help you find everything instantly." },
  { icon: Users, title: "Seamless Collaboration", description: "Share notes with friends or teams in real-time. Comment, highlight, and brainstorm together seamlessly." },
  { icon: Share2, title: "Public & Private Sharing", description: "Choose to share your notes with your class or a study group, or keep them private for your own use." }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Why NoteShare+?</h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">A powerful suite of tools designed for modern learning and effective collaboration.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card className="text-center h-full bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-900/50 rounded-2xl">
                    <feature.icon className="w-8 h-8 text-blue-300" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardTitle className="text-xl font-bold mb-2 text-white">{feature.title}</CardTitle>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------
// 4. Testimonials Section
// ----------------------------------------------------------------

const testimonials = [
  { quote: "NoteShare+ completely changed how my study group prepares for exams. The real-time collaboration is a lifesaver!", name: "Jessica L.", title: "Biology Major, Stanford University" },
  { quote: "Being able to see and comment on my friends' notes helped me understand concepts I was struggling with. It's like a 24/7 study session.", name: "Michael B.", title: "Computer Science, MIT" },
  { quote: "I love how organized my notes are now. The tagging and search features mean I never lose track of important information.", name: "Chloe T.", title: "History Student, Yale University" }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Loved by Students Everywhere
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Don't just take our word for it. Here's what students are saying.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="h-full bg-gray-800/50 border-gray-700 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------
// 5. Call To Action Section
// ----------------------------------------------------------------

interface CallToActionProps {
    onGetStarted: () => void;
}

const CallToActionSection = ({ onGetStarted }: CallToActionProps) => {
  return (
    <section className="bg-blue-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Boost Your Productivity?</h2>
        <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">Join thousands of students and creators who are learning more effectively. Sign up now and get instant access.</p>
        <div className="mt-8">
          <Button onClick={onGetStarted} size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 text-lg rounded-lg">
            Join Now for Free
          </Button>
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------
// 6. Footer Component
// ----------------------------------------------------------------

const LandingFooter = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("Subscribing...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data = { success: Math.random() > 0.3 };
    if (data.success) {
      setStatus("✅ Subscribed successfully!");
      setEmail("");
    } else {
      setStatus("❌ Something went wrong. Please try again.");
    }
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <footer className="bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-white">NoteShare+</span>
                </div>
                <p className="text-sm text-gray-400">Making note-taking simple, collaborative, and powerful.</p>
            </div>
            <div>
                <h4 className="font-semibold text-white mb-2">Stay Updated</h4>
                <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter to get the latest updates.</p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                    <Input type="email" value={email} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1" required />
                    <Button type="submit" className="bg-gray-700 text-white hover:bg-gray-600">Subscribe</Button>
                </form>
                {status && <p className="text-sm mt-2 text-gray-300">{status}</p>}
            </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} NoteShare+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};


// ----------------------------------------------------------------
// 7. Main Page Component
// ----------------------------------------------------------------

export default function LandingPage() {
  const handleGetStarted = () => {
    // In a real app, this would redirect to the login/signup page
    window.location.href = '/login';
  };

  return (
    <div className="bg-black text-white">
      <LandingHeader onLogin={handleGetStarted} />
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        <TestimonialsSection />
        <CallToActionSection onGetStarted={handleGetStarted} />
      </main>
      <LandingFooter />
    </div>
  );
}

