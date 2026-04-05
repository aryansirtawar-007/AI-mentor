import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, User, MessageSquare, LayoutDashboard, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Career Analysis', path: '/analyze', icon: Brain },
    { name: 'AI Mentor', path: '/chat', icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center group-hover:scale-110 transition-transform">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Career<span className="text-neon-purple">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {user && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                location.pathname === item.path
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-neon-purple flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-300 hidden sm:block">
                  {user.name || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl text-slate-400 hover:text-neon-pink hover:bg-neon-pink/10 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-sm font-bold text-white shadow-lg hover:shadow-neon-purple/25 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
