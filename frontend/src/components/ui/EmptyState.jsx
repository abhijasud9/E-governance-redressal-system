import { Inbox } from 'lucide-react';

const EmptyState = ({
    // eslint-disable-next-line no-unused-vars
    icon: _Icon = Inbox,
    title = 'No data found',
    description = 'There is nothing to display at the moment.',
    action,
    actionLabel = 'Take Action',
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                <_Icon className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 font-medium max-w-sm mb-6">{description}</p>
            {action && (
                <button onClick={action} className="btn-primary">
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
