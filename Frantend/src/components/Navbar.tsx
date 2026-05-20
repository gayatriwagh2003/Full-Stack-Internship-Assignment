import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-14 border-b border-white/8 bg-[#080a0f]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-white font-semibold tracking-tight">SmartLeads</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 hidden sm:block">{user?.name}</span>
        {user?.role === 'admin' && (
          <span className="text-xs bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30 px-2 py-0.5 rounded-full">Admin</span>
        )}
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};