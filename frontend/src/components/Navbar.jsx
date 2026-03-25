import { useState, useRef, useEffect } from 'react';
import { Shield, User, LogOut, Menu, ChevronDown, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../hooks/useLayout';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { sidebarOpen, setSidebarOpen, setMobileSidebarOpen } = useLayout();
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="h-16 sticky top-0 z-[100] flex items-center justify-between px-4 lg:px-6 glass-strong border-b">
            {/* Left */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setMobileSidebarOpen(true)}
                    className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-white/40 rounded-xl transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden lg:flex p-2 text-slate-500 hover:text-slate-700 hover:bg-white/40 rounded-xl transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="gradient-primary p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary-500/25">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-800 hidden sm:block">CityFix</span>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
                <NotificationDropdown />

                <div className="h-6 w-px bg-slate-300/40 mx-2 hidden sm:block"></div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/40 transition-all duration-200"
                    >
                        <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary-400/20">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.fullName}</p>
                            <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider">{user?.role}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl shadow-xl shadow-slate-200/40 py-1.5 animate-slide-down z-50">
                            <div className="px-4 py-3 border-b border-slate-200/40">
                                <p className="text-sm font-bold text-slate-800">{user?.fullName}</p>
                                <p className="text-xs text-slate-500">{user?.email || user?.username}</p>
                            </div>
                            <button
                                onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50/50 transition-all"
                            >
                                <UserCircle className="w-4 h-4 text-slate-400" />
                                My Profile
                            </button>
                            <button
                                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50/50 transition-all"
                            >
                                <Settings className="w-4 h-4 text-slate-400" />
                                Settings
                            </button>
                            <div className="border-t border-slate-200/40 mt-1 pt-1">
                                <button
                                    onClick={() => { logout(); navigate('/landing'); setProfileOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50/50 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
