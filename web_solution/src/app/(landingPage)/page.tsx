"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  ArrowRight, 
  Brain, 
  Calendar, 
  MessageCircle, 
  Pill, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Zap,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Globe
} from "lucide-react";

// Custom UI Components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  asChild?: boolean;
}

const Button = ({ children, variant = "primary", size = "md", className = "", asChild, ...props }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 focus:ring-indigo-500 border border-transparent",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md focus:ring-slate-200",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    outline: "border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg"
  };

  const Component = asChild ? "span" : "button";

  return (
    <Component className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

const Badge = ({ children, className = "" }: any) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}>
    {children}
  </span>
);

const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={className}>{children}</div>
);

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white relative text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Circuit Board Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
            radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
            radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
        }}
      />
      
      <div className="relative z-10">
        {/* Navbar */}
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 rounded-xl ${isScrolled ? "bg-white/80 backdrop-blur-md border   rounded-4xl border-slate-200 py-3" : "bg-transparent py-5 "}`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Hospital AI</span>
              </div>

              <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <a href="#features" className="hover:text-indigo-600 transition-colors">Capabilities</a>
                <a href="#solutions" className="hover:text-indigo-600 transition-colors">Solutions</a>
                <a href="#impact" className="hover:text-indigo-600 transition-colors">Impact</a>
              </nav>

              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Log in</Link>
                <Button size="sm" asChild>
                  <Link href="/auth/login">Get Started</Link>
                </Button>
              </div>

              <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-4 md:hidden shadow-xl">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-sm font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Capabilities</a>
                <a href="#solutions" className="text-sm font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Solutions</a>
                <a href="#impact" className="text-sm font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Impact</a>
                <div className="h-px bg-slate-100 my-2" />
                <Link href="/auth/login" className="text-sm font-medium text-slate-600">Log in</Link>
                <Button className="w-full" asChild>
                  <Link href="/auth/login">Get Started</Link>
                </Button>
              </nav>
            </div>
          )}
        </header>

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-100/40 rounded-[100%] blur-3xl opacity-50 mix-blend-multiply animate-pulse duration-[5000ms]" />
              <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-purple-100/40 rounded-full blur-3xl opacity-50 animate-blob" />
              <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-blue-100/40 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 shadow-sm mb-8">
                <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                <span className="text-sm font-medium text-slate-600">Now forecasting festival surges with 94% accuracy</span>
              </div>
              
              <h1 className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl mb-8 leading-tight " style={{fontFamily:"var(--font-lato)", fontWeight:"800"}} >
                Predict the Unpredictable. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                  Optimize Care.
                </span>
              </h1>
              
              <p className="mx-auto max-w-2xl text-xl text-slate-600 mb-10 leading-relaxed">
                The first Agentic AI system designed for hospitals. We forecast patient surges from festivals, weather, and pollution to automate staffing, inventory, and bed management.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-indigo-900/10 hover:scale-105 transition-transform">
                  Request Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="secondary" size="lg" className="h-14 px-8 text-lg hover:scale-105 transition-transform">
                  View Live Simulation
                </Button>
              </div>

              {/* AI Dashboard Visualization */}
              <div className="mt-20 relative mx-auto max-w-5xl">
                <div className="relative rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-2xl overflow-hidden p-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10" />
                  <div className="relative rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                      {/* Left Panel */}
                      <div className="col-span-12 md:col-span-3 border-r border-slate-200 bg-white p-6 space-y-6">
                        <div>
                          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Real-time Signals</h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                              <Calendar className="h-5 w-5 text-orange-600" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">Diwali Festival</p>
                                <p className="text-xs text-slate-500">Approaching in 2 days</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                              <TrendingUp className="h-5 w-5 text-red-600" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">AQI: 350 (Severe)</p>
                                <p className="text-xs text-slate-500">Respiratory spike predicted</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                              <Users className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">Historical Data</p>
                                <p className="text-xs text-slate-500">Matching 2023 patterns</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Center Panel */}
                      <div className="col-span-12 md:col-span-6 p-8 flex flex-col items-center justify-center bg-slate-50/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
                        
                        <div className="relative z-10 text-center space-y-8 w-full max-w-sm">
                          <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                              AI Agent Active
                            </div>
                            <Brain className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                            <p className="text-slate-900 font-semibold text-lg mb-1">Analyzing Patterns</p>
                            <p className="text-slate-500 text-sm">Correlating pollution data with historical respiratory admissions.</p>
                          </div>

                          <div className="flex justify-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" />
                            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-75" />
                            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-150" />
                          </div>

                          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Generated Action Plan</p>
                            <ul className="space-y-2 text-sm text-slate-700">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span>Increase ER nursing staff by 30%</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span>Order 200 units of Nebulizers</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Right Panel */}
                      <div className="col-span-12 md:col-span-3 border-l border-slate-200 bg-white p-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Live Actions</h3>
                        <div className="space-y-4">
                          <div className="p-3 rounded-lg border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-slate-800">Staff Notification</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Sent</span>
                            </div>
                            <p className="text-xs text-slate-500">&quot;Shift added: Tomorrow 8AM-2PM due to expected surge.&quot;</p>
                          </div>
                          <div className="p-3 rounded-lg border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-slate-800">Inventory Order</span>
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Processing</span>
                            </div>
                            <p className="text-xs text-slate-500">Auto-po sent for oxygen cylinders.</p>
                          </div>
                          <div className="p-3 rounded-lg border border-slate-100 shadow-sm bg-indigo-50/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-slate-800">Public Advisory</span>
                              <MessageCircle className="h-3 w-3 text-indigo-500" />
                            </div>
                            <p className="text-xs text-slate-500">WhatsApp blast sent: &quot;OPD extended till 9PM.&quot;</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 border-y border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-4">
                  <div className="text-5xl font-extrabold text-indigo-600 mb-2">40%</div>
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">Reduction in ER Wait Times</div>
                </div>
                <div className="p-4">
                  <div className="text-5xl font-extrabold text-indigo-600 mb-2">Zero</div>
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">Critical Stockouts</div>
                </div>
                <div className="p-4">
                  <div className="text-5xl font-extrabold text-indigo-600 mb-2">24/7</div>
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">Proactive Monitoring</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="py-24 bg-slate-50/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <Badge className="bg-indigo-100 text-indigo-700 ring-indigo-200 mb-4">Core Capabilities</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Proactive, not Reactive.</h2>
                <p className="text-lg text-slate-600">
                  Stop firefighting everyday emergencies. Let our Agentic AI handle the planning so your team can focus on patient care.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: <TrendingUp className="h-6 w-6 text-indigo-600" />, title: "Predictive Analytics", desc: "Our XGBoost & Prophet models analyze festival calendars, AQI levels, and weather patterns to forecast patient surges days in advance." },
                  { icon: <Users className="h-6 w-6 text-pink-600" />, title: "Smart Rostering", desc: "Prevent burnout with AI-generated schedules using Google OR-Tools. Ensure you have the right mix of doctors and nurses during peak hours." },
                  { icon: <Pill className="h-6 w-6 text-emerald-600" />, title: "Inventory Intelligence", desc: "Never run out of critical supplies. The system predicts demand for inhalers, trauma kits, and oxygen, auto-generating purchase orders." },
                  { icon: <MessageCircle className="h-6 w-6 text-blue-600" />, title: "Public Communication", desc: "Directly notify patients via WhatsApp/SMS about OPD timings and advisories during epidemics, reducing panic and overcrowding." }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white/80 rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Scenario Section */}
          <section className="py-24 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                  <Badge className="bg-orange-100 text-orange-700 ring-orange-200 mb-6">Real World Scenario</Badge>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                    When pollution spikes, <br />
                    <span className="text-indigo-600">be ready before patients arrive.</span>
                  </h2>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Winter smog leads to predictable spikes in respiratory cases. Most hospitals react when the waiting room is full. Hospital AI prepares you days in advance.
                  </p>
                  
                  <div className="space-y-6">
                    {[
                      { num: "1", title: "Signal Detection", desc: "AI detects worsening AQI trends and correlates with historical asthma admission rates." },
                      { num: "2", title: "Resource Allocation", desc: "System auto-suggests rostering 2 extra respiratory specialists and increasing inhaler stock." },
                      { num: "3", title: "Patient Guidance", desc: "Vulnerable patients receive automated SMS advisories to visit during non-peak hours." }
                    ].map((step) => (
                      <div key={step.num} className="flex gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">{step.num}</div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{step.title}</h4>
                          <p className="text-slate-600 mt-1">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-1/2 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-20 transform rotate-3" />
                  <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl text-white">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
                      <div>
                        <p className="text-slate-400 text-sm uppercase tracking-wider">Alert Summary</p>
                        <p className="text-xl font-bold text-white mt-1">Respiratory Surge Warning</p>
                      </div>
                      <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" /> High Probability
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-300">Projected ER Wait Time</span>
                          <span className="text-xs text-slate-500">Without Intervention</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-bold text-red-400">4.5 hrs</span>
                          <span className="text-sm text-slate-500 mb-1">vs 45m avg</span>
                        </div>
                      </div>

                      <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-indigo-200">Recommended Action</span>
                          <span className="text-xs text-indigo-300">Auto-Apply</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Activate Surge Roster B</p>
                            <p className="text-xs text-indigo-300">+2 Doctors, +4 Nurses (8AM-4PM)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>AI Model Confidence: 92%</span>
                      <span>Data Source: Sensors, Historical, Weather</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section id="solutions" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <Badge className="bg-purple-100 text-purple-700 ring-purple-200 mb-4">Use Cases</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Built for every emergency.</h2>
                <p className="text-lg text-slate-600">
                  From critical trauma to seasonal outbreaks, our system adapts to save lives.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                    <Activity className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Cardiac Emergencies</h3>
                  <p className="text-slate-600 mb-6">
                    Real-time routing to hospitals with available Cath Labs and Cardiologists, factoring in traffic patterns.
                  </p>
                  <Link href="/recommend" className="text-indigo-600 font-medium hover:underline flex items-center gap-1">
                    Try Recommender <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Mass Casualty Incidents</h3>
                  <p className="text-slate-600 mb-6">
                    Automated load balancing across city hospitals during accidents or disasters to prevent overcrowding.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Epidemic Management</h3>
                  <p className="text-slate-600 mb-6">
                    Predictive resource allocation for Dengue, Malaria, and Flu seasons based on historical and environmental data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to modernize your hospital?
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                Join the network of forward-thinking healthcare providers using AI to save lives and optimize resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="border-slate-600 text-white bg-transparent hover:bg-slate-800 hover:text-white" asChild>
                  <Link href="/auth/login">Get Started Now</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-slate-600 text-white bg-transparent hover:bg-slate-800 hover:text-white" asChild>
                  <Link href="/recommend">Try Public Demo</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">Hospital AI</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
                  The operating system for high-performance hospitals. Predicting surges, optimizing staff, and saving lives.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Surge Prediction</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Smart Rostering</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Inventory Control</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Patient Advisory</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Case Studies</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">© {new Date().getFullYear()} Hospital AI Inc. All rights reserved.</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Systems Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
