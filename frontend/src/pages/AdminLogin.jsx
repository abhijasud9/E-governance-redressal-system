import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, ArrowRight, Loader2, AlertCircle, LayoutDashboard, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userData = await login(username, password);
            if (userData && userData.role !== 'ADMIN' && userData.role !== 'SYSTEM_ADMIN') {
                logout();
                setError('Access denied. Administrator privileges required.');
                return;
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-slate-50">
            {/* Background decorative orbs for the right side */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Left Panel — Colorful Mesh Branding */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-12">
                {/* Animated Vibrant Background */}
                <div className="absolute inset-0 colorful-animated-bg"></div>

                {/* Glassy overlay shapes */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>

                <div className="relative z-10 max-w-md w-full">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="bg-white/20 p-3.5 rounded-2xl backdrop-blur-md border border-white/30 shadow-2xl shadow-black/10">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-4xl font-black text-white tracking-tight drop-shadow-md">CityFix</span>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-5 py-2.5 rounded-xl mb-8 backdrop-blur-md shadow-lg shadow-black/5">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                        <span className="text-white font-bold text-sm tracking-wide">Administrator Portal</span>
                    </div>

                    <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 drop-shadow-sm">
                        Total control over city operations.
                    </h2>

                    <p className="text-white/90 text-lg leading-relaxed font-medium mb-12 drop-shadow">
                        Manage civic reports, coordinate departments, and make data-driven decisions to optimize urban infrastructure.
                    </p>

                    <div className="grid grid-cols-2 gap-5">
                        {[
                            { val: 'Live', label: 'Monitoring' },
                            { val: '<4h', label: 'Triage Time' },
                            { val: '100%', label: 'Traceability' },
                            { val: '24/7', label: 'Availability' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl shadow-black/5 hover:bg-white/15 transition-all cursor-default">
                                <p className="text-3xl font-black text-white drop-shadow-sm">{s.val}</p>
                                <p className="text-xs font-bold text-white/80 uppercase tracking-widest mt-1.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md animate-slide-up">
                    <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to portal selection
                    </Link>

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="colorful-animated-bg p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tight text-slate-900">CityFix</span>
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Admin Sign In</h1>
                    <p className="text-slate-500 font-medium text-base mb-8">Access the secure administrative dashboard.</p>

                    <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-blue-200/40 rounded-[2rem] p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold animate-slide-up">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-2.5">
                                <label className="text-sm font-bold text-slate-700 pl-1">Admin Username</label>
                                <input
                                    type="text"
                                    required
                                    className="input-premium pl-4 py-3.5 bg-white/50 focus:bg-white/90 focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between pl-1">
                                    <label className="text-sm font-bold text-slate-700">Password</label>
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="input-premium pl-4 py-3.5 bg-white/50 focus:bg-white/90 focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 text-base mt-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>Start Session</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center mt-8 text-sm text-slate-500 font-medium">
                        Need assistance? Contact the <a href="#" className="text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4 decoration-2 decoration-blue-200 hover:decoration-blue-600 transition-colors">System Administrator</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
