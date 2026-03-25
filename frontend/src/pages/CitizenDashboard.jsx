import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { resolveImageUrl } from '../api/api';
import { Layers, CheckCircle2, Clock, Plus, ChevronRight, MapPin, Calendar, TrendingUp, FileText } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import Map from '../components/Map';

const CitizenDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/complaints/my');
                const complaints = res.data;
                setRecentComplaints(complaints.slice(0, 5));
                setStats({
                    total: complaints.length,
                    pending: complaints.filter(c => c.status === 'PENDING').length,
                    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
                    resolved: complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const statCards = [
        { label: 'Total Reports', value: stats.total, icon: Layers, color: 'text-indigo-600', bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50', iconBg: 'bg-indigo-100' },
        { label: 'Pending Action', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50', iconBg: 'bg-amber-100' },
        { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50', iconBg: 'bg-blue-100' },
        { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50', iconBg: 'bg-emerald-100' },
    ];

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-1">Citizen Portal</h1>
                    <p className="text-sm text-slate-500">Monitor your community impact & reported issues</p>
                </div>
                <button
                    onClick={() => navigate('/new-complaint')}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5" />
                    New Report
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? <LoadingSkeleton variant="card" count={4} /> : statCards.map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                        <button
                            onClick={() => navigate('/my-complaints')}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1.5 group"
                        >
                            View All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {loading ? <LoadingSkeleton variant="list" count={3} /> : recentComplaints.length === 0 ? (
                        <EmptyState
                            icon={FileText}
                            title="No reports submitted yet"
                            description="Start making a difference by reporting your first civic issue."
                            action={() => navigate('/new-complaint')}
                            actionLabel="Report First Issue"
                        />
                    ) : (
                        <div className="space-y-4">
                            {recentComplaints.map((complaint) => (
                                <div
                                    key={complaint.id}
                                    onClick={() => setSelectedComplaint(complaint)}
                                    className="bg-gradient-to-r from-white to-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-slate-900 to-slate-700 text-white px-3 py-1 rounded-lg">
                                                {complaint.category?.name}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-500 group-hover:bg-clip-text group-hover:text-transparent transition-all mb-2">{complaint.title}</h3>
                                        <div className="flex items-center gap-2 text-base text-slate-600">
                                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="truncate">{complaint.address}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <StatusBadge status={complaint.status} />
                                        <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-500 group-hover:text-white transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900">Insights</h2>

                    <div className="gradient-primary rounded-2xl p-6 text-white shadow-lg shadow-primary-400/25 transition-all relative overflow-hidden">
                        <TrendingUp className="w-8 h-8 text-primary-200 mb-3" />
                        <h4 className="text-base font-semibold mb-1">Civic Engagement Rising</h4>
                        <p className="text-primary-100 text-sm leading-relaxed mb-4">Your reports have helped resolve over 15 issues this month.</p>
                        <button className="w-full py-2.5 bg-white/15 hover:bg-white/25 transition-all rounded-lg text-sm font-medium border border-white/20">
                            View Report
                        </button>
                    </div>

                    <div className="glass-card p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                        <h4 className="font-extrabold text-slate-900 mb-3 text-base">💡 Quick Tip</h4>
                        <p className="text-base text-slate-700 leading-relaxed font-medium">Providing a clear photo increases resolution speed by up to 45%.</p>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                    </div>
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
                                <p className="text-sm text-slate-600 font-medium leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedComplaint.description}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                <p className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    {selectedComplaint.address}
                                </p>
                                <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-100 relative">
                                    {selectedComplaint.latitude && selectedComplaint.longitude ? (
                                        <Map
                                            readOnly={true}
                                            center={[selectedComplaint.latitude, selectedComplaint.longitude]}
                                            complaints={[selectedComplaint]}
                                            zoom={15}
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400 text-xs font-medium">
                                            Location coordinates unavailable
                                        </div>
                                    )}
                                </div>
                            </div>
                            {selectedComplaint.imageUrl && (
                                <div className="col-span-2">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        Photo Evidence
                                    </p>
                                    <div className="rounded-2xl overflow-hidden border border-slate-100">
                                        <img src={resolveImageUrl(selectedComplaint.imageUrl)} alt="Evidence" className="w-full h-auto" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CitizenDashboard;
