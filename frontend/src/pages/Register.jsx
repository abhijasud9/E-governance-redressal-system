import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, ArrowRight, Loader2, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';
import api from '../api/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/users/register', { ...formData, role: 'CITIZEN' });
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-slate-50">
            {/* Background decorative orbs for the right side */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Left Panel — Colorful Mesh Branding */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-12">
                {/* Animated Vibrant Background */}
                <div className="absolute inset-0 colorful-animated-bg"></div>

                {/* Glassy overlay shapes */}
                <div className="absolute top-32 right-10 w-64 h-64 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>

                <div className="relative z-10 max-w-md w-full">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="bg-white/20 p-3.5 rounded-2xl backdrop-blur-md border border-white/30 shadow-2xl shadow-black/10">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-4xl font-black text-white tracking-tight drop-shadow-md">CityFix</span>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-5 py-2.5 rounded-xl mb-8 backdrop-blur-md shadow-lg shadow-black/5">
                        <UserPlus className="w-5 h-5 text-white" />
                        <span className="text-white font-bold text-sm tracking-wide">Join the Community</span>
                    </div>

                    <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 drop-shadow-sm">
                        Create your citizen account
                    </h2>

                    <p className="text-white/90 text-lg leading-relaxed font-medium mb-12 drop-shadow">
                        Join thousands of citizens to report issues, track resolutions, and help build a better neighborhood together.
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: 'Report Issues Instantly', desc: 'Use GPS and camera to file reports in seconds.' },
                            { title: 'Track Progress Live', desc: 'Get updates as the city resolves your complaints.' },
                            { title: 'Make an Impact', desc: 'Every report contributes to a safer, cleaner city.' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0 shadow-lg shadow-black/5 text-white font-bold text-sm">{i + 1}</div>
                                <div>
                                    <h4 className="text-white font-bold text-base drop-shadow-sm">{item.title}</h4>
                                    <p className="text-white/80 text-sm mt-0.5 font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-[480px] animate-slide-up">
                    <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to sign-in
                    </Link>

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="colorful-animated-bg p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tight text-slate-900">CityFix</span>
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 font-medium text-base mb-8">Join the City Governance Hub today.</p>

                    <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-cyan-200/40 rounded-[2rem] p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold animate-slide-up">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2.5">
                                    <label className="text-sm font-bold text-slate-700 pl-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-premium pl-4 py-3 bg-white/50 focus:bg-white/90"
                                        placeholder="Abhishek Jasud"
                                        value={formData.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-sm font-bold text-slate-700 pl-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-premium pl-4 py-3 bg-white/50 focus:bg-white/90"
                                        placeholder="Abhi_j"
                                        value={formData.username}
                                        onChange={(e) => handleChange('username', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-sm font-bold text-slate-700 pl-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-premium pl-4 py-3 bg-white/50 focus:bg-white/90"
                                    placeholder="jabhi@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-sm font-bold text-slate-700 pl-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="input-premium pl-4 py-3 bg-white/50 focus:bg-white/90"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 text-base mt-2 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-white shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center mt-8 text-sm text-slate-500 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors underline underline-offset-4 decoration-2 decoration-cyan-200 hover:decoration-cyan-600">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
