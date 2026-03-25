import { useState, useEffect } from 'react';
import api, { resolveImageUrl } from '../api/api';
import { ArrowLeft, Calendar, MapPin, Search, ChevronLeft, ChevronRight, FileText, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import SearchFilter from '../components/ui/SearchFilter';
import Modal from '../components/ui/Modal';
import Map from '../components/Map';

const ITEMS_PER_PAGE = 6;

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await api.get('/complaints/my');
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' ||
            (statusFilter === 'RESOLVED' ? (c.status === 'RESOLVED' || c.status === 'CLOSED') : c.status === statusFilter);
        return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
    const paginatedComplaints = filteredComplaints.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const filters = [
        { value: 'ALL', label: 'All' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'RESOLVED', label: 'Resolved' },
    ];

    return (
        <div className="page-container pb-20">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-medium text-sm mb-4 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Portal
                </button>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">My Reports</h1>
                        <p className="page-subtitle">Track all your submitted complaints</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="card px-5 py-3 flex items-center gap-6">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                                <p className="text-xl font-extrabold text-slate-900">{complaints.length}</p>
                            </div>
                            <div className="h-8 w-px bg-slate-100"></div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolved</p>
                                <p className="text-xl font-extrabold text-emerald-600">{complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <SearchFilter
                searchValue={searchQuery}
                onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
                searchPlaceholder="Search by title or location..."
                filters={filters}
                activeFilter={statusFilter}
                onFilterChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
            />

            {/* Complaint List */}
            <div className="space-y-3">
                {loading ? (
                    <LoadingSkeleton variant="list" count={4} />
                ) : paginatedComplaints.length === 0 ? (
                    <EmptyState
                        title="No Reports Found"
                        description="No results match your search or filter criteria."
                        action={() => navigate('/new-complaint')}
                        actionLabel="Report First Issue"
                    />
                ) : (
                    paginatedComplaints.map((complaint) => (
                        <div
                            key={complaint.id}
                            onClick={() => setSelectedComplaint(complaint)}
                            className="card-hover p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer"
                        >
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-slate-400 ${(complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') ? 'bg-emerald-50 text-emerald-600' :
                                    complaint.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-primary-50 text-primary-600'
                                    }`}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{complaint.category?.name}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-1 truncate">
                                        {complaint.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate max-w-[200px]">{complaint.address}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {complaint.imageUrl && (
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 hidden sm:block bg-slate-50 flex items-center justify-center">
                                        <img
                                            src={resolveImageUrl(complaint.imageUrl)}
                                            alt="Proof"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden flex items-center justify-center text-slate-300">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                )}
                                <StatusBadge status={complaint.status} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-slate-500 font-medium">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredComplaints.length)} of {filteredComplaints.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

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
                                <p className="text-sm text-slate-600 leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedComplaint.description}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                                    <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                                    {selectedComplaint.address}
                                </div>
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
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Photo Evidence</p>
                                    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 min-h-[150px] flex items-center justify-center relative">
                                        <img
                                            src={resolveImageUrl(selectedComplaint.imageUrl)}
                                            alt="Evidence"
                                            className="w-full h-auto"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden flex-col items-center justify-center p-6 text-center text-slate-400">
                                            <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                                            <p className="text-sm font-bold text-slate-900 mb-1">Photo Missing</p>
                                            <p className="text-xs">This photo could not be loaded.</p>
                                        </div>
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

export default MyComplaints;
