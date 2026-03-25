import { useState, useEffect } from 'react';
import api from '../api/api';
import { Users as UsersIcon, Shield, User, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../hooks/useAuth';

const ITEMS_PER_PAGE = 8;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const { user: currentUser } = useAuth();
    const isSystemAdmin = currentUser?.role === 'SYSTEM_ADMIN';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">View and manage all registered users</p>
                </div>
                <div className="card px-5 py-3 flex items-center gap-6">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Citizens</p>
                        <p className="text-xl font-extrabold text-slate-900">{users.filter(u => u.role === 'CITIZEN').length}</p>
                    </div>
                    {isSystemAdmin && (
                        <>
                            <div className="h-8 w-px bg-slate-100"></div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Admins</p>
                                <p className="text-xl font-extrabold text-primary-600">{users.filter(u => u.role === 'ADMIN').length}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Search & Role Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 group">
                    <input
                        type="text"
                        placeholder="Search by name, username, or email..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="input-premium pl-4 py-3"
                    />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {['ALL', 'CITIZEN', isSystemAdmin ? 'ADMIN' : null].filter(Boolean).map(r => (
                        <button
                            key={r}
                            onClick={() => { setRoleFilter(r); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-wide transition-all whitespace-nowrap ${roleFilter === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {r === 'ALL' ? 'All Roles' : r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="table-container">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="table-header text-left">User</th>
                                <th className="table-header text-left">Username</th>
                                <th className="table-header text-left hidden md:table-cell">Email</th>
                                <th className="table-header text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <LoadingSkeleton variant="table-row" count={5} /> :
                                paginatedUsers.length === 0 ? (
                                    <tr><td colSpan={4}><EmptyState title="No Users Found" description="No users match your search criteria." /></td></tr>
                                ) : paginatedUsers.map(u => (
                                    <tr key={u.id} className="table-row">
                                        <td className="table-cell">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${u.role === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-primary-100 text-primary-600'
                                                    }`}>
                                                    {u.role === 'ADMIN' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                                </div>
                                                <span className="font-bold text-sm text-slate-900">{u.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="table-cell text-sm text-slate-500 font-medium">@{u.username}</td>
                                        <td className="table-cell text-sm text-slate-400 font-medium hidden md:table-cell">{u.email}</td>
                                        <td className="table-cell">
                                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${u.role === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-primary-50 text-primary-600 border border-primary-200'
                                                }`}>
                                                {u.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                {u.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{page}</button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
