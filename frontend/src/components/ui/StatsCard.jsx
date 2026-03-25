// eslint-disable-next-line no-unused-vars
const StatsCard = ({ icon: _Icon, label, value, trend, color = 'text-primary-600', bg = 'bg-primary-50', iconBg }) => {
    const trendColor = trend?.startsWith('+') ? 'text-emerald-600 bg-emerald-50/80'
        : trend?.startsWith('-') ? 'text-rose-600 bg-rose-50/80'
            : 'text-primary-600 bg-primary-50/80';

    return (
        <div className="card-hover p-5 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`${bg || 'bg-primary-100/60'} ${color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <_Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${trendColor}`}>
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
    );
};

export default StatsCard;
