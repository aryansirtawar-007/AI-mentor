import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  Star
} from 'lucide-react';
import { api } from '../lib/api';

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [careerPlan, setCareerPlan] = useState<any>(null);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [user, plan, chats] = await Promise.all([
          api.auth.me(),
          api.career.getPlan(),
          api.chat.getHistory()
        ]);
        setUserProfile(user);
        setCareerPlan(plan);
        setRecentChats(chats.slice(-3).reverse());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            Welcome back, <span className="text-gradient">{userProfile?.name || 'Explorer'}</span>
          </h1>
          <p className="text-slate-400">Here's your career progress and AI insights.</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Career Plan Card */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-dark p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Brain className="w-32 h-32 text-neon-purple" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold">Current Career Plan</h2>
                <Link 
                  to="/analyze" 
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  title="Update Plan"
                >
                  <Plus className="w-5 h-5" />
                </Link>
              </div>

              {careerPlan ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {careerPlan.suggestedRoles?.slice(0, 2).map((role: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-neon-blue">{role.title}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-neon-blue/10 text-neon-blue">
                            {role.matchPercentage}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{role.reason}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Next Steps</h3>
                    <div className="space-y-3">
                      {careerPlan.roadmap?.[0]?.tasks?.slice(0, 3).map((task: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-neon-purple transition-colors flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-neon-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-sm text-slate-300">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/analyze"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all"
                  >
                    View Full Roadmap
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-6">You haven't generated a career plan yet.</p>
                  <Link
                    to="/analyze"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold shadow-lg"
                  >
                    Analyze My Career
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-dark p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Skill Progress</div>
              </div>
            </div>
            <div className="glass-dark p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neon-pink/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-neon-pink" />
              </div>
              <div>
                <div className="text-2xl font-bold">12h</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Learning Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* AI Mentor Quick Access */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-dark p-6 rounded-3xl"
          >
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-neon-purple" />
              Recent Chats
            </h3>
            <div className="space-y-4 mb-6">
              {recentChats.length > 0 ? recentChats.map((chat) => (
                <Link
                  key={chat.id}
                  to={`/chat?id=${chat.id}`}
                  className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <div className="text-sm font-medium text-slate-200 mb-1 truncate">
                    {chat.title || 'Career Discussion'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
              )) : (
                <p className="text-sm text-slate-500 text-center py-4">No recent chats</p>
              )}
            </div>
            <Link
              to="/chat"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neon-purple text-white text-sm font-bold shadow-lg hover:shadow-neon-purple/25 transition-all"
            >
              Start New Chat
            </Link>
          </motion.div>

          {/* Recommended Skills */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-dark p-6 rounded-3xl"
          >
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Top Skills to Learn
            </h3>
            <div className="space-y-3">
              {careerPlan?.requiredSkills?.slice(0, 4).map((skill: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-sm text-slate-300">{skill.skill}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    skill.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {skill.priority}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
