import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';

const statusConfig = {
    PENDING: {
        label: 'Pending',
        className: 'badge-pending',
        icon: <Clock className="w-3.5 h-3.5" />,
    },
    IN_PROGRESS: {
        label: 'In Progress',
        className: 'badge-in-progress',
        icon: <Loader2 className="w-3.5 h-3.5" />,
    },
    RESOLVED: {
        label: 'Resolved',
        className: 'badge-resolved',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    CLOSED: {
        label: 'Closed',
        className: 'badge-resolved',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
};

const StatusBadge = ({ status, showIcon = true }) => {
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
        <span className={config.className}>
            {showIcon && config.icon}
            {config.label}
        </span>
    );
};

export default StatusBadge;
