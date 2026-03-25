import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Shield, ArrowRight, Loader2, AlertCircle, CheckCircle2, Crown } from 'lucide-react';

const CreateAdmin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await api.post('/sysadmin/create-admin', {
                ...formData,
                role: 'ADMIN',
            });
            setSuccess(`Admin account for "${res.data.username}" created successfully!`);
            setFormData({ fullName: '', username: '', email: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create admin account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Create Admin Account</h1>
                    <p className="page-subtitle">Add a new administrator to the CityFix platform</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                    <Crown className="w-4 h-4" />
                    System Admin Only
                </div>
            </div>

            <div className="max-w-xl">
                <div className="glass-card rounded-3xl p-8 shadow-xl">
                    {/* Info Banner */}
                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                        <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-blue-800">Admin Account</p>
                            <p className="text-xs text-blue-600 font-medium mt-0.5">
                                The new account will be created with <strong>ADMIN</strong> role. Only you (System Admin) can create admin accounts.
                            </p>
                        </div>
                    </div>

                    {/* Success */}
                    {success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium mb-5">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium mb-5">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 pl-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-premium pl-4 text-sm"
                                    placeholder="John Smith"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 pl-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="input-premium pl-4 text-sm"
                                    placeholder="admin_john"
                                    value={formData.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 pl-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-premium pl-4 text-sm"
                                placeholder="john@city.gov"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 pl-1">Temporary Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="input-premium pl-4 text-sm"
                                placeholder="Min. 6 characters"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                            />
                        </div>

                        {/* Role display — read only */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 pl-1">Account Role</label>
                            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                                <Shield className="w-4 h-4 text-slate-600" />
                                <span className="text-sm font-bold text-slate-900">ADMIN</span>
                                <span className="text-xs text-slate-400 font-medium ml-1">— automatically assigned</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3.5 text-base flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>Create Admin Account</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-5 py-3.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAdmin;
