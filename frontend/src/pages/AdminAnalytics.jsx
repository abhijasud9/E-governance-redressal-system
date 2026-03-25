import { useState, useEffect } from 'react';
import api from '../api/api';
import { BarChart3, TrendingUp, Layers, Clock, CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const AdminAnalytics = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'PENDING').length,
        inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
        resolved: complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length,
    };

    const resolutionRate = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;

    // Category breakdown
    const categoryMap = {};
    complaints.forEach(c => {
        const cat = c.category?.name || 'Uncategorized';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categoryData = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const maxCategoryCount = categoryData.length > 0 ? categoryData[0][1] : 1;

    // Status breakdown for bar chart
    const statusData = [
        { label: 'Pending', value: stats.pending, color: 'bg-amber-500' },
        { label: 'In Progress', value: stats.inProgress, color: 'bg-primary-500' },
        { label: 'Resolved', value: stats.resolved, color: 'bg-emerald-500' },
    ];
    const maxStatusCount = Math.max(...statusData.map(s => s.value), 1);

    // Recent by month (last 6 months simulation)
    const monthlyData = [
        { month: 'Jan', count: Math.floor(Math.random() * 20) + 5 },
        { month: 'Feb', count: Math.floor(Math.random() * 20) + 5 },
        { month: 'Mar', count: Math.floor(Math.random() * 20) + 5 },
        { month: 'Apr', count: Math.floor(Math.random() * 20) + 5 },
        { month: 'May', count: Math.floor(Math.random() * 20) + 5 },
        { month: 'Jun', count: complaints.length || 10 },
    ];
    const maxMonthly = Math.max(...monthlyData.map(m => m.count), 1);

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Analytics</h1>
                    <p className="page-subtitle">Insights into city complaint trends and performance</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {loading ? <LoadingSkeleton variant="card" count={4} /> : [
                    { label: 'Total Complaints', value: stats.total, icon: Layers, color: 'text-slate-600', bg: 'bg-slate-100' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'In Progress', value: stats.inProgress, icon: AlertTriangle, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Resolution Rate', value: `${resolutionRate}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: resolutionRate >= 80 ? 'Great' : 'Needs Work' },
                ].map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="card p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Status Distribution</h3>
                    <div className="space-y-5">
                        {statusData.map((s, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-slate-700">{s.label}</span>
                                    <span className="text-sm font-bold text-slate-900">{s.value}</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${s.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${(s.value / maxStatusCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Resolution Ring */}
                    <div className="mt-8 flex items-center justify-center">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                <circle
                                    cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="10"
                                    strokeDasharray={`${resolutionRate * 2.51} ${251 - resolutionRate * 2.51}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-extrabold text-slate-900">{resolutionRate}%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="card p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Trend</h3>
                    <div className="flex items-end justify-between gap-2 h-48">
                        {monthlyData.map((m, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                <span className="text-xs font-bold text-slate-900">{m.count}</span>
                                <div
                                    className="w-full bg-primary-500 rounded-t-xl transition-all duration-700 hover:bg-primary-600"
                                    style={{ height: `${(m.count / maxMonthly) * 100}%`, minHeight: '8px' }}
                                />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="card p-8 lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Category Breakdown</h3>
                    {categoryData.length === 0 ? (
                        <p className="text-slate-400 text-sm">No data available</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categoryData.map(([name, count], i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
                                        <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-primary-500 rounded-full transition-all duration-700"
                                                style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-lg font-extrabold text-slate-900">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
