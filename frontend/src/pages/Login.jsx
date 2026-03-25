import { useNavigate, Link } from 'react-router-dom';
import { Shield, Users, ChevronRight, LayoutDashboard, Crown, UserCircle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 p-6">
            {/* Background animated mesh across entire viewport */}
            <div className="absolute inset-0 colorful-animated-bg opacity-90"></div>

            {/* Decorative orbs behind the content */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px] pointer-events-none animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '3s' }}></div>

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
                {/* Branding & Header Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-4 mb-8 bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/30 shadow-2xl">
                        <Shield className="w-12 h-12 text-white" />
                        <span className="text-5xl font-black text-white tracking-tight drop-shadow-md">CityFix</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                        Smart cities start with you.
                    </h1>

                    <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
                        Join thousands of citizens and administrators working together to build safer, cleaner, and more efficient urban spaces.
                    </p>
                </div>

                {/* Portal Selection - Horizontal Grid on Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-slide-up">
                    <Link
                        to="/login-citizen"
                        className="glass-strong p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-6 group hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 border-white/40"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-500/30 group-hover:rotate-6 transition-transform duration-500">
                            <Users className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-800 mb-2">Citizen Portal</h3>
                            <p className="text-slate-500 font-bold">Report issues & track progress</p>
                        </div>
                        <div className="mt-2 w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </Link>

                    <Link
                        to="/login-admin"
                        className="glass-strong p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-6 group hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border-white/40"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:rotate-6 transition-transform duration-500">
                            <LayoutDashboard className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-800 mb-2">Admin Portal</h3>
                            <p className="text-slate-500 font-bold">Manage city infrastructure</p>
                        </div>
                        <div className="mt-2 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </Link>

                    <Link
                        to="/login-sysadmin"
                        className="glass-strong p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-6 group hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 border-white/40"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-amber-500/30 group-hover:rotate-6 transition-transform duration-500">
                            <Crown className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-800 mb-2">System Admin</h3>
                            <p className="text-slate-500 font-bold">Platform management</p>
                        </div>
                        <div className="mt-2 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </Link>
                </div>

                {/* Footer Section */}
                <div className="mt-16 text-center animate-fade-in delay-500">
                    <p className="text-white/80 font-bold text-lg">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-white underline underline-offset-8 decoration-4 decoration-white/30 hover:decoration-white transition-all">Create Citizen Account</Link>
                    </p>
                </div>

                {/* Stats row at the bottom */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 lg:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500">
                    {[
                        { val: '12K+', label: 'Issues Resolved' },
                        { val: '85%', label: 'Resolution Rate' },
                        { val: '24h', label: 'Avg Response' },
                        { val: '50+', label: 'Districts Covered' },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl font-black text-white">{s.val}</p>
                            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default Login;
