import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, MapPin, Activity, BarChart3, Users, Smartphone, Globe, Lock, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Landing = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-500/30">
            {/* Animated Grid Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary-400/10 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-float"></div>
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent-400/10 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Premium Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/landing')}>
                        <div className="bg-slate-900 p-2 rounded-xl group-hover:bg-primary-600 transition-colors shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">CityFix.</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 bg-white/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-200/50 shadow-sm">
                        <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Platform</a>
                        <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Solutions</a>
                        <a href="#stats" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Impact</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in relative group cursor-pointer">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        <span className="text-xs font-bold text-slate-800">CityFix v2.0 is now live</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1.1] animate-slide-up">
                        Modern civic
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500">
                            infrastructure.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        The command center for smart cities. Report, track, and resolve urban issues with real-time intelligence and community collaboration.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button onClick={() => navigate('/register')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-xl shadow-primary-600/20 hover:-translate-y-1">
                            Start Computing
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button onClick={() => navigate('/login')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-sm hover:-translate-y-1">
                            Access Portal
                        </button>
                    </div>
                </div>
            </section>

            {/* Application Dashboard Preview mockup */}
            <section className="px-6 pb-32 relative z-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="relative rounded-[2rem] bg-white p-2 md:p-4 shadow-2xl shadow-slate-200/50 border border-slate-200/60 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 rounded-[2rem] pointer-events-none" />

                        {/* Mockup Header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                            <div className="w-3 h-3 rounded-full bg-rose-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>

                        {/* Mockup Content */}
                        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 rounded-b-[1.5rem]">
                            <div className="col-span-2 space-y-6">
                                <div className="h-40 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                                    <div className="w-32 h-4 bg-slate-200 rounded-full" />
                                    <div className="space-y-2">
                                        <div className="w-3/4 h-3 bg-slate-100 rounded-full" />
                                        <div className="w-1/2 h-3 bg-slate-100 rounded-full" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-16 h-6 bg-primary-100 rounded-lg" />
                                        <div className="w-16 h-6 bg-emerald-100 rounded-lg" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-32 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl mb-4" />
                                        <div className="w-20 h-4 bg-slate-200 rounded-full mb-2" />
                                        <div className="w-12 h-6 bg-slate-800 rounded-md" />
                                    </div>
                                    <div className="h-32 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                                        <div className="w-10 h-10 bg-teal-50 rounded-xl mb-4" />
                                        <div className="w-20 h-4 bg-slate-200 rounded-full mb-2" />
                                        <div className="w-12 h-6 bg-slate-800 rounded-md" />
                                    </div>
                                </div>
                            </div>
                            <div className="h-full bg-slate-900 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
                                <div className="w-24 h-4 bg-slate-700 rounded-full mb-8 relative z-10" />
                                <div className="space-y-4 relative z-10">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
                                            <div className="w-full h-2 flex-1 bg-slate-800 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Benthos */}
            <section id="features" className="py-24 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Everything you need to <br /><span className="text-primary-600">manage your city.</span></h2>
                        <p className="text-lg text-slate-500 max-w-xl font-medium">Built for scale, speed, and reliability. CityFix provides the ultimate toolset for modern urban management.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-white rounded-[2rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/30 group hover:border-primary-200 transition-colors">
                            <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-time mapping</h3>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-md">Pinpoint issues with exact GPS coordinates. Our integrated mapping system ensures maintenance teams know exactly where to go, reducing resolution time.</p>
                        </div>

                        <div className="bg-slate-900 rounded-[2rem] p-10 shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center mb-6 relative z-10">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Enterprise security</h3>
                            <p className="text-slate-400 font-medium leading-relaxed relative z-10">Bank-grade encryption for all citizen data and internal communications.</p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/30 group hover:border-accent-200 transition-colors">
                            <div className="w-14 h-14 bg-accent-50 text-accent-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent-500 group-hover:text-white transition-all duration-300">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Live tracking</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Citizens get instant updates as their reported issues move from pending to resolved.</p>
                        </div>

                        <div className="md:col-span-2 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-[2rem] p-10 border border-primary-100 shadow-xl shadow-primary-100/30 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex -space-x-3">
                                    <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-white"><Users className="w-5 h-5" /></div>
                                    <div className="w-12 h-12 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-white"><Shield className="w-5 h-5" /></div>
                                </div>
                                <p className="text-sm font-bold text-primary-700">Multi-role support</p>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Perfect harmony between citizens & admins</h3>
                            <p className="text-slate-600 font-medium leading-relaxed max-w-lg">Specific portals tailored for different roles. Citizens can report effortlessly, while administrators get powerful tools to manage city infrastructure.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics */}
            <section id="stats" className="py-24 px-6 border-y border-slate-200/60 bg-white/50 backdrop-blur-sm relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
                        {[
                            { value: '25k+', text: 'Issues Resolved' },
                            { value: '98%', text: 'Citizen Satisfaction' },
                            { value: '4hrs', text: 'Avg. Response Time' },
                            { value: '100%', text: 'City Coverage' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Giant CTA */}
            <section className="py-32 px-6 relative z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="w-24 h-24 bg-primary-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-600/40 rotate-3 transition-transform hover:rotate-12 duration-500">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">
                        Start building a<br />
                        smarter city today.
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => navigate('/register')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-1">
                            Create Free Account
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-12 px-6 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                        <Shield className="w-6 h-6 text-slate-900" />
                        <span className="text-xl font-bold tracking-tight text-slate-900">CityFix.</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} CityFix Systems, Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
