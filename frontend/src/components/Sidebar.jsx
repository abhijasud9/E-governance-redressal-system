import {
    LayoutDashboard,
    MessageSquarePlus,
    History,
    Map as MapIcon,
    Users,
    BarChart3,
    ChevronRight,
    HelpCircle,
    X,
    UserCircle,
    Crown,
    ClipboardList
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ collapsed = false, onClose }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const isSysAdmin = user?.role === 'SYSTEM_ADMIN';

    const citizenMenu = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/new-complaint', icon: MessageSquarePlus, label: 'Report Issue' },
        { path: '/my-complaints', icon: History, label: 'My Reports' },
        { path: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    const adminMenu = [
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/admin/complaints', icon: ClipboardList, label: 'Complaints' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/map', icon: MapIcon, label: 'Map View' },
        { path: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    const sysAdminMenu = [
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/admin/complaints', icon: ClipboardList, label: 'Complaints' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/map', icon: MapIcon, label: 'Map View' },
        { path: '/sysadmin/create-admin', icon: Crown, label: 'Create Admin' },
        { path: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    const menuItems = isSysAdmin ? sysAdminMenu : isAdmin ? adminMenu : citizenMenu;

    return (
        <div
            className={`h-[calc(100vh-64px)] sticky top-16 flex flex-col transition-all duration-300 glass border-r ${collapsed ? 'w-[72px] px-3 py-4' : 'w-64 p-4'}`}
        >
            {/* Close button for mobile */}
            {onClose && (
                <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-sm font-bold text-slate-800">Menu</span>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/40 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Label */}
            {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">
                    {isSysAdmin ? 'System Admin' : isAdmin ? 'Administration' : 'Navigation'}
                </p>
            )}

            {/* Menu Items */}
            <div className={`space-y-1 flex-grow ${collapsed ? 'flex flex-col items-center' : ''}`}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={onClose}
                        className={({ isActive }) => `
                            flex items-center ${collapsed ? 'justify-center' : 'justify-between'} ${collapsed ? 'p-2.5' : 'px-3 py-2.5'} rounded-xl transition-all duration-200 group
                            ${isActive
                                ? 'bg-primary-500/15 text-primary-700 font-bold shadow-sm'
                                : 'text-slate-600 hover:bg-white/50 hover:text-slate-800'}
                        `}
                        title={collapsed ? item.label : undefined}
                    >
                        <div className={`flex items-center ${collapsed ? '' : 'gap-2.5'}`}>
                            <item.icon className="w-[18px] h-[18px] shrink-0" />
                            {!collapsed && <span className="text-sm">{item.label}</span>}
                        </div>
                        {!collapsed && (
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Help Card */}
            {!collapsed && (
                <div className="mt-4 p-4 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(20,184,166,0.08))' }}>
                    <HelpCircle className="w-5 h-5 text-primary-500 mb-2" />
                    <p className="font-bold text-sm text-slate-800 mb-0.5">Need Help?</p>
                    <p className="text-xs text-slate-500 leading-relaxed">24/7 support available for all users.</p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
