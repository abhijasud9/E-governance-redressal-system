import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { LayoutContext } from '../context/LayoutContextObject';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen }}>
            <div className="min-h-screen flex flex-col relative overflow-hidden">
                {/* Decorative gradient orbs */}
                <div className="orb w-[500px] h-[500px] bg-primary-300/30 top-[-100px] left-[-100px] fixed" />
                <div className="orb w-[400px] h-[400px] bg-accent-200/20 bottom-[10%] right-[-80px] fixed" />
                <div className="orb w-[300px] h-[300px] bg-primary-200/20 top-[50%] left-[40%] fixed" />

                <Navbar />
                <div className="flex flex-1 relative z-10">
                    {/* Desktop Sidebar */}
                    <div className={`hidden lg:block transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-[72px]'}`}>
                        <Sidebar collapsed={!sidebarOpen} />
                    </div>

                    {/* Mobile Sidebar Overlay */}
                    {mobileSidebarOpen && (
                        <div className="fixed inset-0 z-[150] lg:hidden">
                            <div
                                className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
                                onClick={() => setMobileSidebarOpen(false)}
                            />
                            <div className="absolute left-0 top-0 h-full w-64 animate-slide-in-right">
                                <Sidebar collapsed={false} onClose={() => setMobileSidebarOpen(false)} />
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="max-w-6xl mx-auto p-6 lg:p-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </LayoutContext.Provider>
    );
};

export default Layout;
