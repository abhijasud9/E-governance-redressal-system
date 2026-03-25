import { useState, useEffect } from 'react';
import api, { resolveImageUrl } from '../api/api';
import {
    Layers, CheckCircle2, Clock, AlertTriangle,
    Calendar, MapPin, ChevronDown, RefreshCw, Eye, Loader2, Image as ImageIcon
} from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import StatusBadge from '../components/ui/StatusBadge';
import SearchFilter from '../components/ui/SearchFilter';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import Map from '../components/Map';
import { useToast } from '../hooks/useToast';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showMapComplaint, setShowMapComplaint] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const toast = useToast();

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const updateStatus = async (id, status) => {
        setUpdatingStatusId(id);
        try {
            await api.patch(`/complaints/${id}/status`, null, { params: { status } });
            setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
            toast?.success(`Status updated to ${status.replace('_', ' ')}`);
        } catch (_err) {
            toast?.error('Failed to update status');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'PENDING').length,
        inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
        resolved: complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length,
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.address?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' ||
            (statusFilter === 'RESOLVED' ? (c.status === 'RESOLVED' || c.status === 'CLOSED') : c.status === statusFilter);
        return matchesSearch && matchesStatus;
    });

    const filters = [
        { value: 'ALL', label: 'All' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'RESOLVED', label: 'Resolved' },
    ];

    const statusOptions = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Complaints Management</h1>
                    <p className="page-subtitle">Manage and process civic complaints</p>
                </div>
                <button
                    onClick={() => { setLoading(true); fetchComplaints(); }}
                    className="btn-secondary"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {loading ? <LoadingSkeleton variant="card" count={4} /> : [
                    { label: 'Total Reports', value: stats.total, icon: Layers, color: 'text-slate-600', bg: 'bg-slate-100' },
                    { label: 'Pending Action', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: `${stats.pending > 0 ? stats.pending + ' active' : ''}` },
                    { label: 'In Progress', value: stats.inProgress, icon: AlertTriangle, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: stats.total > 0 ? `${Math.round((stats.resolved / stats.total) * 100)}%` : '0%' },
                ].map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}
            </div>

            {/* Search & Filter */}
            <SearchFilter
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="   Search complaints..."
                filters={filters}
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
            />

            {/* Complaints Table */}
            <div className="table-container">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="table-header text-left w-20">ID</th>
                                <th className="table-header text-left">Complaint</th>
                                <th className="table-header text-left">Category</th>
                                <th className="table-header text-left hidden md:table-cell">Date</th>
                                <th className="table-header text-left">Status</th>
                                <th className="table-header text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <LoadingSkeleton variant="table-row" count={5} /> :
                                filteredComplaints.length === 0 ? (
                                    <tr>
                                        <td colSpan={5}>
                                            <EmptyState title="No Complaints Found" description="No results match your current filter." />
                                        </td>
                                    </tr>
                                ) : filteredComplaints.map(complaint => (
                                    <tr key={complaint.id} className="table-row">
                                        <td className="table-cell text-xs font-bold text-primary-600 bg-primary-50/50">#{complaint.id}</td>
                                        <td className="table-cell">
                                            <div className="flex items-start gap-3.5">
                                                {complaint.imageUrl ? (
                                                    <img
                                                        src={resolveImageUrl(complaint.imageUrl)}
                                                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                                                        alt=""
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                {(!complaint.imageUrl || true) && (
                                                    <div
                                                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"
                                                        style={{ display: complaint.imageUrl ? 'none' : 'flex' }}
                                                    >
                                                        <Layers className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 text-sm truncate max-w-[200px]">{complaint.title}</p>
                                                    <button
                                                        onClick={() => setShowMapComplaint(complaint)}
                                                        className="flex items-center gap-1 text-xs text-slate-400 mt-0.5 font-medium hover:text-primary-600 transition-colors text-left"
                                                    >
                                                        <MapPin className="w-3 h-3 shrink-0" />
                                                        <span className="truncate max-w-[150px]">{complaint.address}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell text-sm font-medium text-slate-600">{complaint.category?.name}</td>
                                        <td className="table-cell text-sm text-slate-400 font-medium hidden md:table-cell">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="relative group/status">
                                                <StatusBadge status={complaint.status} />
                                                <div className="absolute left-0 top-full mt-1 z-30 bg-white rounded-xl border border-slate-100 shadow-xl p-1 hidden group-hover/status:block min-w-[140px]">
                                                    {statusOptions.map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => updateStatus(complaint.id, s)}
                                                            disabled={complaint.status === s || updatingStatusId === complaint.id}
                                                            className={`w-full px-3 py-2 text-left text-xs font-bold rounded-lg transition-all ${complaint.status === s
                                                                ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                                                : 'text-slate-600 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {s.replace('_', ' ')}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell text-center">
                                            <button
                                                onClick={() => setSelectedComplaint(complaint)}
                                                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <Modal
                isOpen={!!selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
                title="Complaint Details"
                maxWidth="max-w-2xl"
            >
                {selectedComplaint && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">ID</p>
                                <p className="text-sm font-bold text-primary-600">#{selectedComplaint.id}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                                <p className="text-sm font-semibold text-slate-900">{selectedComplaint.category?.name}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                <StatusBadge status={selectedComplaint.status} />
                            </div>
                            <div className="col-span-2">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Title</p>
                                <p className="text-base font-bold text-slate-900">{selectedComplaint.title}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                                <p className="text-sm text-slate-600 leading-relaxed">{selectedComplaint.description}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                <button
                                    onClick={() => setShowMapComplaint(selectedComplaint)}
                                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors w-full text-left"
                                >
                                    <MapPin className="w-4 h-4 text-slate-300" />
                                    {selectedComplaint.address}
                                </button>
                            </div>
                            {selectedComplaint.imageUrl && (
                                <div className="col-span-2">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Photo Evidence</p>
                                    <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 min-h-[200px] flex items-center justify-center">
                                        <img
                                            src={resolveImageUrl(selectedComplaint.imageUrl)}
                                            alt="Evidence"
                                            className="w-full"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden flex-col items-center justify-center p-8 text-center text-slate-400">
                                            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                                            <p className="text-sm font-bold text-slate-900 mb-1">Photo Missing</p>
                                            <p className="text-xs">The evidence photo for this complaint could not be loaded or was removed from the server.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                            {statusOptions.map(s => (
                                <button
                                    key={s}
                                    onClick={() => { updateStatus(selectedComplaint.id, s); setSelectedComplaint(null); }}
                                    disabled={selectedComplaint.status === s}
                                    className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedComplaint.status === s
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {s.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Map Modal */}
            <Modal
                isOpen={!!showMapComplaint}
                onClose={() => setShowMapComplaint(null)}
                title="Location Map"
                maxWidth="max-w-4xl"
            >
                {showMapComplaint && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary-600 shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complaint Address</p>
                                <p className="text-sm font-semibold text-slate-900 leading-tight">{showMapComplaint.address}</p>
                            </div>
                        </div>
                        <div className="h-[500px] w-full border border-slate-100 rounded-2xl overflow-hidden relative">
                            {showMapComplaint.latitude && showMapComplaint.longitude ? (
                                <Map
                                    readOnly={true}
                                    center={[showMapComplaint.latitude, showMapComplaint.longitude]}
                                    complaints={[showMapComplaint]}
                                    zoom={15}
                                />
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center">
                                    <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="font-bold text-slate-900 mb-1">No coordinates saved</p>
                                    <p className="text-sm max-w-xs">This complaint doesn't have GPS coordinates associated with it.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
