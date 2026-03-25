const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
    const skeletons = Array.from({ length: count });

    if (variant === 'card') {
        return skeletons.map((_, i) => (
            <div key={i} className="card p-7 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="skeleton w-12 h-12 rounded-2xl" />
                    <div className="skeleton w-16 h-6 rounded-lg" />
                </div>
                <div className="skeleton w-24 h-4" />
                <div className="skeleton w-16 h-8" />
            </div>
        ));
    }

    if (variant === 'table-row') {
        return skeletons.map((_, i) => (
            <tr key={i} className="border-b border-slate-50">
                <td className="table-cell">
                    <div className="flex items-center gap-4">
                        <div className="skeleton w-10 h-10 rounded-xl" />
                        <div className="space-y-2">
                            <div className="skeleton w-32 h-4" />
                            <div className="skeleton w-48 h-3" />
                        </div>
                    </div>
                </td>
                <td className="table-cell"><div className="skeleton w-24 h-4" /></td>
                <td className="table-cell"><div className="skeleton w-20 h-6 rounded-lg" /></td>
                <td className="table-cell"><div className="skeleton w-8 h-8 rounded-lg" /></td>
            </tr>
        ));
    }

    if (variant === 'list') {
        return skeletons.map((_, i) => (
            <div key={i} className="card p-6 flex items-center gap-6">
                <div className="skeleton w-14 h-14 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="skeleton w-3/4 h-4" />
                    <div className="skeleton w-1/2 h-3" />
                    <div className="skeleton w-1/3 h-3" />
                </div>
                <div className="skeleton w-24 h-8 rounded-xl" />
            </div>
        ));
    }

    // default: simple block
    return skeletons.map((_, i) => (
        <div key={i} className="skeleton w-full h-32 rounded-3xl" />
    ));
};

export default LoadingSkeleton;
