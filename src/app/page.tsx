'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client' // Your auth client
import { motion } from 'framer-motion'
import { 
  Zap, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Play,
  Loader2
} from 'lucide-react'

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function Home() {
  const router = useRouter()
  // Using your auth hook
  const { data: session, isPending } = authClient.useSession()

  // Handler for the main CTA
  const handleStartBuilding = () => {
    if (session) {
      router.push('/workflows')
    } else {
      router.push('/signup')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100">
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Axiom</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-amber-600 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-amber-600 transition-colors">Pricing</Link>
            <Link href="#docs" className="hover:text-amber-600 transition-colors">Docs</Link>
          </div>

          {/* AUTHENTICATION STATE IN NAVBAR */}
          <div className="flex items-center gap-4">
            {isPending ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : !session ? (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 hidden sm:inline-block">
                  Hi, {session.user?.name || session.user?.email}
                </span>
                <button 
                  onClick={() => router.push('/workflows')}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
                >
                  Go to Workflows
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="initial" 
            animate="animate" 
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              v2.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
              The OS for your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Backend Logic
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Build complex workflows visually. Connect Gemini, Discord, and databases without managing infrastructure.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleStartBuilding}
                className="w-full sm:w-auto px-8 py-4 text-white bg-amber-500 rounded-xl font-semibold hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 group"
              >
                {session ? 'Go to Workflows' : 'Start Building Free'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full sm:w-auto px-8 py-4 text-slate-700 bg-white border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Hero Image Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-20 relative rounded-xl border border-slate-200 bg-slate-100/50 p-2 shadow-2xl"
          >
            <div className="relative rounded-lg overflow-hidden aspect-[16/9] border border-slate-200 bg-slate-200">
              <Image 
                src="/workflow-canvas.png" 
                alt="Axiom Workflow Builder Canvas"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          {/* Feature 1: The Builder */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Drag. Drop. <br/>Automate.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Stop writing boilerplate code. Use our visual canvas to chain together AI models, databases, and APIs. Whether it's a simple cron job or a complex RAG pipeline, build it in seconds.
              </p>
              <ul className="space-y-3">
                {['Visual infinite canvas', 'Real-time validation', 'Instant deployment'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
                 <Image 
                  src="/workflow-canvas.png" 
                  alt="Workflow Editor" 
                  width={800} 
                  height={600} 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Feature 2: Credentials */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="md:order-2 space-y-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Bank-grade Security for your Keys
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Never hardcode API keys again. Manage credentials for services like Gemini, OpenAI, and Discord in one secure vault.
              </p>
            </div>
            <div className="md:order-1 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
                <Image 
                  src="/credentials.png" 
                  alt="Credentials Manager" 
                  width={800} 
                  height={600} 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Feature 3: Execution History */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Monitor performance at a glance
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Track every execution. Identify bottlenecks with precise timing data and status reports. 
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
                 <Image 
                  src="/execution-list.png" 
                  alt="Execution History List" 
                  width={800} 
                  height={600} 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

           {/* Feature 4: Debugging Logs */}
           <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="md:order-2 space-y-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                <Terminal className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Total transparency. <br /> Zero guesswork.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Dive deep into the JSON payloads. See exactly what the AI generated and what was sent to your downstream APIs.
              </p>
            </div>
            <div className="md:order-1 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
                <Image 
                  src="/execution-logs.png" 
                  alt="Detailed Execution Logs" 
                  width={800} 
                  height={600} 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to automate your backend?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Join developers building AI agents, data pipelines, and cron jobs with Axiom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleStartBuilding}
              className="px-8 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/25"
            >
              Start Building Now
            </button>
           
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <Zap className="text-white w-3 h-3" fill="currentColor" />
            </div>
            <span className="font-bold text-slate-900">Axiom</span>
          </div>
          <p className="text-slate-500 text-sm">© 2025 Axiom Inc. All rights reserved.</p>
          <div className="flex gap-6 text-slate-500">
            <a href="#" className="hover:text-slate-900">Twitter</a>
            <a href="#" className="hover:text-slate-900">GitHub</a>
            <a href="#" className="hover:text-slate-900">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  )
}