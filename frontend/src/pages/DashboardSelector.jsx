import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CitizenDashboard from './CitizenDashboard';

const DashboardSelector = () => {
    const { user } = useAuth();

    if (user?.role === 'ADMIN' || user?.role === 'SYSTEM_ADMIN') {
        return <Navigate to="/admin/analytics" replace />;
    }

    return <CitizenDashboard />;
};

export default DashboardSelector;
