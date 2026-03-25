import { useState, useEffect } from 'react';
import api from '../api/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers, MapPin } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

// Fix default leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom status-based icons
const createStatusIcon = (status) => {
    let colorClass = 'bg-primary-600'; // Default
    if (status === 'PENDING') colorClass = 'bg-amber-500';
    if (status === 'IN_PROGRESS') colorClass = 'bg-primary-500';
    if (status === 'RESOLVED' || status === 'CLOSED') colorClass = 'bg-emerald-500';

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-6 h-6 ${colorClass} rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

const AdminMapView = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/complaints');
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filteredComplaints = complaints.filter(c => {
        const hasCoords = c.latitude && c.longitude;
        const matchesStatus = statusFilter === 'ALL' ||
            (statusFilter === 'RESOLVED' ? (c.status === 'RESOLVED' || c.status === 'CLOSED') : c.status === statusFilter);
        return hasCoords && matchesStatus;
    });

    const filters = ['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Map View</h1>
                    <p className="page-subtitle">Geographic view of all reported complaints</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-3 py-2 rounded-lg text-[11px] font-bold tracking-wide transition-all whitespace-nowrap ${statusFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {f === 'ALL' ? 'All' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-6 card px-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                    <span className="font-semibold text-slate-700">{filteredComplaints.length} complaints on map</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium ml-auto">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Pending</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary-500"></div> In Progress</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Resolved</span>
                </div>
            </div>

            {/* Map */}
            {loading ? (
                <LoadingSkeleton count={1} />
            ) : (
                <div className="card overflow-hidden" style={{ height: '600px' }}>
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {filteredComplaints.map(c => (
                            <Marker
                                key={c.id}
                                position={[c.latitude, c.longitude]}
                                icon={createStatusIcon(c.status)}
                            >
                                <Popup>
                                    <div className="min-w-[200px] p-1">
                                        <h4 className="font-bold text-sm text-slate-900 mb-1">{c.title}</h4>
                                        <p className="text-xs text-slate-500 mb-2">{c.address}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{c.category?.name}</span>
                                            <StatusBadge status={c.status} showIcon={false} />
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default AdminMapView;
