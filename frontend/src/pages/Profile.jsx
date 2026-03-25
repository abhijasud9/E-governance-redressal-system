import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Shield, Save, Camera, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Profile = () => {
    const { user, logout } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        username: user?.username || '',
    });

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        // Simulate save
        await new Promise(r => setTimeout(r, 1000));
        toast?.success('Profile updated successfully');
        setSaving(false);
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.')) {
            return;
        }

        setDeleting(true);
        try {
            await api.delete('/users/me');
            toast?.success('Account deleted successfully');
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Delete error:', error);
            toast?.error('Failed to delete account. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="page-container max-w-3xl">
            <div>
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="card p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                    <div className="relative group">
                        <div className="w-24 h-24 bg-primary-100 rounded-3xl flex items-center justify-center ring-4 ring-white shadow-lg">
                            <User className="w-12 h-12 text-primary-600" />
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-extrabold text-slate-900">{user?.fullName}</h2>
                        <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${user?.role === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-primary-50 text-primary-600 border border-primary-200'
                                }`}>
                                <Shield className="w-3 h-3" />
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Full Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="input-premium pl-4"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Username</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={formData.username}
                                    disabled
                                    className="input-premium pl-4 opacity-60 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <div className="relative group">
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-premium pl-4"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="card border-rose-200 p-8">
                <h3 className="text-lg font-bold text-rose-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-slate-500 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="btn-danger"
                >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
            </div>
        </div>
    );
};

export default Profile;
